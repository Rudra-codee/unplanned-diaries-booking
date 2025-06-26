
-- Create table for custom trip requests
CREATE TABLE public.custom_trip_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  location TEXT NOT NULL,
  number_of_guests INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  contact_number TEXT NOT NULL,
  contact_email TEXT,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for trip itineraries
CREATE TABLE public.trip_itineraries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activities JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(trip_id, day_number)
);

-- Enable RLS for custom trip requests
ALTER TABLE public.custom_trip_requests ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to view all custom trip requests
CREATE POLICY "Admins can view all custom trip requests" 
  ON public.custom_trip_requests 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = auth.uid()));

-- Enable RLS for trip itineraries
ALTER TABLE public.trip_itineraries ENABLE ROW LEVEL SECURITY;

-- Create policy for admins to manage trip itineraries
CREATE POLICY "Admins can manage trip itineraries" 
  ON public.trip_itineraries 
  FOR ALL 
  USING (EXISTS (SELECT 1 FROM public.admins WHERE admins.user_id = auth.uid()));

-- Enable realtime for trip itineraries
ALTER TABLE public.trip_itineraries REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trip_itineraries;

-- Enable realtime for custom trip requests
ALTER TABLE public.custom_trip_requests REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.custom_trip_requests;
