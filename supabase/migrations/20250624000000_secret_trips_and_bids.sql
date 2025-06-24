
-- Create secret trips table
CREATE TABLE public.secret_trips (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL DEFAULT 'Secret Location Trip',
    description text DEFAULT 'Location unknown, fun guaranteed! Join our exclusive mystery adventure where the destination is a surprise until you arrive.',
    max_guests integer NOT NULL DEFAULT 25,
    available_seats integer NOT NULL DEFAULT 25,
    start_date date NOT NULL,
    end_date timestamp with time zone NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    created_by uuid REFERENCES auth.users(id)
);

-- Create bids table
CREATE TABLE public.bids (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    secret_trip_id uuid REFERENCES public.secret_trips(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    bid_amount numeric NOT NULL,
    user_name text NOT NULL,
    user_email text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    UNIQUE(secret_trip_id, user_id)
);

-- Enable RLS
ALTER TABLE public.secret_trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;

-- RLS policies for secret_trips
CREATE POLICY "Anyone can view active secret trips" ON public.secret_trips
    FOR SELECT USING (is_active = true AND end_date > now());

CREATE POLICY "Admins can manage secret trips" ON public.secret_trips
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.admins 
            WHERE admins.user_id = auth.uid()
        )
    );

-- RLS policies for bids
CREATE POLICY "Users can view all bids" ON public.bids
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert their own bids" ON public.bids
    FOR INSERT TO authenticated 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bids" ON public.bids
    FOR UPDATE TO authenticated 
    USING (auth.uid() = user_id);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.secret_trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.bids;

-- Set replica identity for realtime
ALTER TABLE public.secret_trips REPLICA IDENTITY FULL;
ALTER TABLE public.bids REPLICA IDENTITY FULL;
