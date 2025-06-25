
-- Create subscribers table for email notifications
CREATE TABLE public.subscribers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create broadcasts table for admin messages
CREATE TABLE public.broadcasts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable RLS on both tables
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.broadcasts ENABLE ROW LEVEL SECURITY;

-- Allow public users to insert their email for notifications
CREATE POLICY "Anyone can subscribe for notifications" 
  ON public.subscribers 
  FOR INSERT 
  WITH CHECK (true);

-- Allow public users to view their own subscription
CREATE POLICY "Users can view their own subscription" 
  ON public.subscribers 
  FOR SELECT 
  USING (true);

-- Only admins can view all subscribers
CREATE POLICY "Admins can view all subscribers" 
  ON public.subscribers 
  FOR SELECT 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Only admins can create broadcasts
CREATE POLICY "Admins can create broadcasts" 
  ON public.broadcasts 
  FOR INSERT 
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Only admins can view broadcasts
CREATE POLICY "Admins can view broadcasts" 
  ON public.broadcasts 
  FOR SELECT 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Enable realtime for both tables
ALTER TABLE public.subscribers REPLICA IDENTITY FULL;
ALTER TABLE public.broadcasts REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.subscribers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.broadcasts;
