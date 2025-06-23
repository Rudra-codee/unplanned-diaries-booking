
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Trip } from './useTrips';

export const useTripsWithRealtime = () => {
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
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createTrip = async (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert([tripData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update({ ...tripData, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTrips();

    // Set up real-time subscription
    const channel = supabase
      .channel('trips-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'trips'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setTrips(prev => [payload.new as Trip, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setTrips(prev => prev.map(trip => 
              trip.id === payload.new.id ? payload.new as Trip : trip
            ));
          } else if (payload.eventType === 'DELETE') {
            setTrips(prev => prev.filter(trip => trip.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { 
    trips, 
    loading, 
    error, 
    refetch: fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip
  };
};
