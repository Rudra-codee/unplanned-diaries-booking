
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Trip } from '@/hooks/useTrips';
import type { Database } from '@/integrations/supabase/types';

type TripType = Database["public"]["Enums"]["trip_type"];

interface TripsContextType {
  trips: Trip[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  createTrip: (tripData: Omit<Trip, 'id' | 'created_at' | 'updated_at'>) => Promise<any>;
  updateTrip: (id: string, tripData: Partial<Trip>) => Promise<any>;
  deleteTrip: (id: string) => Promise<void>;
}

const TripsContext = createContext<TripsContextType | undefined>(undefined);

export const useTripsContext = () => {
  const context = useContext(TripsContext);
  if (context === undefined) {
    throw new Error('useTripsContext must be used within a TripsProvider');
  }
  return context;
};

interface TripsProviderProps {
  children: ReactNode;
}

export const TripsProvider: React.FC<TripsProviderProps> = ({ children }) => {
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
      console.log('Creating trip with data:', tripData);
      
      const processedData = {
        ...tripData,
        type: tripData.type as TripType,
        available_from: tripData.available_from || new Date().toISOString().split('T')[0],
        tags: tripData.tags || [],
        section: tripData.section || 'trending',
        itinerary: tripData.itinerary || []
      };

      const { data, error } = await supabase
        .from('trips')
        .insert([processedData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Trip created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating trip:', error);
      throw error;
    }
  };

  const updateTrip = async (id: string, tripData: Partial<Trip>) => {
    try {
      console.log('Updating trip with ID:', id, 'Data:', tripData);
      
      const updateData = {
        ...tripData,
        type: tripData.type as TripType,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('trips')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Trip updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating trip:', error);
      throw error;
    }
  };

  const deleteTrip = async (id: string) => {
    try {
      console.log('Deleting trip with ID:', id);
      
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Trip deleted successfully');
    } catch (error) {
      console.error('Error deleting trip:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchTrips();

    // Set up real-time subscription - only once in the provider
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

  const value: TripsContextType = {
    trips,
    loading,
    error,
    refetch: fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip
  };

  return (
    <TripsContext.Provider value={value}>
      {children}
    </TripsContext.Provider>
  );
};
