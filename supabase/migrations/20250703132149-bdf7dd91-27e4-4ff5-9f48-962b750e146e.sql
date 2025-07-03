
-- Create the group_trips table for educational, corporate, family and other group travel packages
CREATE TABLE public.group_trips (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'educational',
  location TEXT NOT NULL,
  price NUMERIC NOT NULL,
  description TEXT,
  image_url TEXT,
  duration INTEGER NOT NULL DEFAULT 1,
  max_guests INTEGER,
  available_from DATE,
  available_to DATE,
  tags TEXT[] DEFAULT '{}',
  features JSONB DEFAULT '[]',
  itinerary JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.group_trips ENABLE ROW LEVEL SECURITY;

-- Create policy for public to view group trips
CREATE POLICY "Anyone can view group trips" 
  ON public.group_trips 
  FOR SELECT 
  USING (true);

-- Create policy for admins to manage group trips
CREATE POLICY "Admins can manage group trips" 
  ON public.group_trips 
  FOR ALL 
  USING (is_admin());

-- Add constraints
ALTER TABLE public.group_trips 
ADD CONSTRAINT group_trips_category_check 
CHECK (category IN ('educational', 'corporate', 'family', 'adventure', 'cultural', 'wellness'));

-- Enable real-time updates
ALTER TABLE public.group_trips REPLICA IDENTITY FULL;
