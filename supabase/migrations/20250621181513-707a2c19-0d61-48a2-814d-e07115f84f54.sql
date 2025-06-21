
-- Create enum for booking status
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Create enum for trip types
CREATE TYPE trip_type AS ENUM ('adventure', 'cultural', 'relaxation', 'business', 'family', 'solo');

-- Create trips table
CREATE TABLE public.trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    location TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    tags TEXT[] DEFAULT '{}',
    type trip_type DEFAULT 'adventure',
    duration INTEGER NOT NULL, -- duration in days
    max_guests INTEGER DEFAULT 10,
    available_from DATE DEFAULT CURRENT_DATE,
    available_to DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE public.bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    trip_id UUID REFERENCES public.trips(id) ON DELETE CASCADE NOT NULL,
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    guest_phone TEXT,
    number_of_guests INTEGER NOT NULL DEFAULT 1,
    travel_date DATE NOT NULL,
    status booking_status DEFAULT 'pending',
    total_amount DECIMAL(10,2) NOT NULL,
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admins table for role management
CREATE TABLE public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table for additional user info
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.admins 
        WHERE admins.user_id = $1
    );
$$;

-- RLS Policies for trips table (public read, admin write)
CREATE POLICY "Anyone can view trips" ON public.trips
    FOR SELECT USING (true);

CREATE POLICY "Admins can insert trips" ON public.trips
    FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update trips" ON public.trips
    FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete trips" ON public.trips
    FOR DELETE USING (public.is_admin());

-- RLS Policies for bookings table (users can see their own, admins can see all)
CREATE POLICY "Users can view their own bookings" ON public.bookings
    FOR SELECT USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Authenticated users can create bookings" ON public.bookings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings" ON public.bookings
    FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Admins can delete bookings" ON public.bookings
    FOR DELETE USING (public.is_admin());

-- RLS Policies for admins table (only admins can view)
CREATE POLICY "Admins can view admins table" ON public.admins
    FOR SELECT USING (public.is_admin());

CREATE POLICY "Admins can manage admins table" ON public.admins
    FOR ALL USING (public.is_admin());

-- RLS Policies for profiles table
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
    );
    RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_trips_location ON public.trips(location);
CREATE INDEX idx_trips_type ON public.trips(type);
CREATE INDEX idx_trips_price ON public.trips(price);
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_trip_id ON public.bookings(trip_id);
CREATE INDEX idx_bookings_travel_date ON public.bookings(travel_date);
CREATE INDEX idx_bookings_status ON public.bookings(status);

-- Insert sample trips data
INSERT INTO public.trips (title, location, price, description, image_url, tags, type, duration, max_guests) VALUES
('Kedarkantha Trek', 'Uttarakhand, India', 299.00, 'One of the most rewarding winter treks offering panoramic views of major Himalayan peaks.', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['trekking', 'mountains', 'winter'], 'adventure', 6, 12),
('Har Ki Dun Trek', 'Uttarakhand, India', 399.00, 'A cradle-shaped hanging valley also known as the Valley of Gods in Garhwal Himalayas.', 'https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['trekking', 'valley', 'nature'], 'adventure', 7, 10),
('Sandakphu Trek', 'West Bengal, India', 349.00, 'Famous for the sunrise view over the world highest peaks including Everest and Kanchenjunga.', 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['trekking', 'sunrise', 'everest'], 'adventure', 5, 15),
('Goa Beach Holiday', 'Goa, India', 199.00, 'Relax on pristine beaches with crystal clear waters and golden sand.', 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['beach', 'relaxation', 'sun'], 'relaxation', 4, 20),
('Kerala Backwaters', 'Kerala, India', 449.00, 'Experience the serene backwaters of Kerala with traditional houseboat stays.', 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80', ARRAY['backwaters', 'houseboat', 'culture'], 'cultural', 3, 8);

-- Create a function to get booking statistics
CREATE OR REPLACE FUNCTION public.get_booking_stats()
RETURNS TABLE (
    total_bookings BIGINT,
    pending_bookings BIGINT,
    confirmed_bookings BIGINT,
    total_revenue NUMERIC,
    total_guests BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
    SELECT 
        COUNT(*) as total_bookings,
        COUNT(*) FILTER (WHERE status = 'pending') as pending_bookings,
        COUNT(*) FILTER (WHERE status = 'confirmed') as confirmed_bookings,
        COALESCE(SUM(total_amount), 0) as total_revenue,
        COALESCE(SUM(number_of_guests), 0) as total_guests
    FROM public.bookings;
$$;
