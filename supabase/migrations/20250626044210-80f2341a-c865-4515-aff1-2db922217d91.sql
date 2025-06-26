
-- Create queries table for trip requests
CREATE TABLE public.queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  destination TEXT NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  guests TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on queries table
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;

-- Allow public users to insert queries
CREATE POLICY "Anyone can submit trip queries" 
  ON public.queries 
  FOR INSERT 
  WITH CHECK (true);

-- Only admins can view all queries
CREATE POLICY "Admins can view all queries" 
  ON public.queries 
  FOR SELECT 
  TO authenticated
  USING (EXISTS (SELECT 1 FROM public.admins WHERE user_id = auth.uid()));

-- Enable realtime for queries table
ALTER TABLE public.queries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.queries;
