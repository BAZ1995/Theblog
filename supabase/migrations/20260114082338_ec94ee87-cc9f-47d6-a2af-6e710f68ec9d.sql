-- Drop the insecure policy
DROP POLICY IF EXISTS "Anyone can create comments" ON public.comments;

-- Create secure policy requiring authentication
CREATE POLICY "Authenticated users can create comments" 
ON public.comments 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());