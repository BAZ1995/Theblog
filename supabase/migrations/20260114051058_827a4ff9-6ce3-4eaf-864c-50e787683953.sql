-- Make user_id nullable for anonymous comments
ALTER TABLE public.comments ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing insert policy and create new one for anonymous comments
DROP POLICY IF EXISTS "Authenticated users can create comments" ON public.comments;

CREATE POLICY "Anyone can create comments"
ON public.comments
FOR INSERT
WITH CHECK (true);

-- Update delete policy to allow admins or comment owners (when user_id is set)
DROP POLICY IF EXISTS "Users can delete their own comments or admins can delete any" ON public.comments;

CREATE POLICY "Users can delete their own comments or admins can delete any"
ON public.comments
FOR DELETE
USING (
  (user_id IS NOT NULL AND auth.uid() = user_id) 
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Update update policy
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;

CREATE POLICY "Users can update their own comments"
ON public.comments
FOR UPDATE
USING (user_id IS NOT NULL AND auth.uid() = user_id);