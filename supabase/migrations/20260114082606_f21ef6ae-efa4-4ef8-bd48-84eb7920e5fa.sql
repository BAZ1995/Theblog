-- Create page_views table for tracking site visits
CREATE TABLE public.page_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  path TEXT NOT NULL,
  referrer TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert page views (anonymous tracking)
CREATE POLICY "Anyone can insert page views" 
ON public.page_views 
FOR INSERT 
WITH CHECK (true);

-- Only admins can view page views
CREATE POLICY "Admins can view page views" 
ON public.page_views 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Create index for faster queries
CREATE INDEX idx_page_views_created_at ON public.page_views(created_at DESC);
CREATE INDEX idx_page_views_path ON public.page_views(path);