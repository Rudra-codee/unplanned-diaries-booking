
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Trip {
  id: string;
  title: string;
  location: string;
  price: number;
  description: string;
  image_url: string;
  tags: string[];
  type: string;
  duration: number;
  max_guests: number;
  available_from: string;
  available_to: string;
  created_at: string;
  updated_at: string;
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
