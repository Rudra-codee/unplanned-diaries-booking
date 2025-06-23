
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

export interface Trip {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string | null;
  image_url: string | null;
  tags: string[];
  type: Database["public"]["Enums"]["trip_type"];
  duration: number;
  max_guests: number | null;
  available_from: string | null;
  available_to: string | null;
  section: string;
  itinerary: any | null;
  created_at: string | null;
  updated_at: string | null;
}

export const useTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        console.error('Error fetching trips:', error);
      } else {
        setTrips(data || []);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  return { trips, loading, error, refetch: fetchTrips };
};
