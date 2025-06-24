
-- Create function to get active secret trip
CREATE OR REPLACE FUNCTION public.get_active_secret_trip()
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  max_guests integer,
  available_seats integer,
  start_date date,
  end_date timestamp with time zone,
  is_active boolean
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    st.id,
    st.title,
    st.description,
    st.max_guests,
    st.available_seats,
    st.start_date,
    st.end_date,
    st.is_active
  FROM public.secret_trips st
  WHERE st.is_active = true 
    AND st.end_date > now()
  ORDER BY st.created_at DESC
  LIMIT 1;
$$;

-- Create function to get all secret trips (for admin)
CREATE OR REPLACE FUNCTION public.get_all_secret_trips()
RETURNS TABLE (
  id uuid,
  title text,
  end_date timestamp with time zone,
  max_guests integer,
  available_seats integer
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    st.id,
    st.title,
    st.end_date,
    st.max_guests,
    st.available_seats
  FROM public.secret_trips st
  WHERE st.is_active = true
  ORDER BY st.created_at DESC;
$$;

-- Create function to get bids for a trip
CREATE OR REPLACE FUNCTION public.get_trip_bids(trip_id uuid)
RETURNS TABLE (
  id uuid,
  bid_amount numeric,
  user_name text,
  created_at timestamp with time zone
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.id,
    b.bid_amount,
    b.user_name,
    b.created_at
  FROM public.bids b
  WHERE b.secret_trip_id = trip_id
  ORDER BY b.bid_amount DESC
  LIMIT 3;
$$;

-- Create function to get all bids (for admin)
CREATE OR REPLACE FUNCTION public.get_all_bids()
RETURNS TABLE (
  id uuid,
  bid_amount numeric,
  user_name text,
  user_email text,
  created_at timestamp with time zone,
  secret_trip_id uuid
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT 
    b.id,
    b.bid_amount,
    b.user_name,
    b.user_email,
    b.created_at,
    b.secret_trip_id
  FROM public.bids b
  ORDER BY b.created_at DESC;
$$;

-- Create function to place a bid
CREATE OR REPLACE FUNCTION public.place_bid(
  trip_id uuid,
  user_id uuid,
  bid_amount numeric,
  user_name text,
  user_email text
)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.bids (secret_trip_id, user_id, bid_amount, user_name, user_email)
  VALUES (trip_id, user_id, bid_amount, user_name, user_email)
  ON CONFLICT (secret_trip_id, user_id)
  DO UPDATE SET 
    bid_amount = EXCLUDED.bid_amount,
    updated_at = now();
$$;

-- Create function to create secret trip (for admin)
CREATE OR REPLACE FUNCTION public.create_secret_trip(
  title text,
  description text,
  max_guests integer,
  start_date date,
  end_date timestamp with time zone,
  created_by uuid
)
RETURNS uuid
LANGUAGE sql
SECURITY DEFINER
AS $$
  INSERT INTO public.secret_trips (title, description, max_guests, available_seats, start_date, end_date, created_by)
  VALUES (title, description, max_guests, max_guests, start_date, end_date, created_by)
  RETURNING id;
$$;
