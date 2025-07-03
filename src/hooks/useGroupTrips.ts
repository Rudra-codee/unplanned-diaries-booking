
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface GroupTrip {
  id: string;
  title: string;
  category: string;
  location: string;
  price: number;
  description: string | null;
  image_url: string | null;
  duration: number;
  max_guests: number | null;
  available_from: string | null;
  available_to: string | null;
  tags: string[];
  features: any[];
  itinerary: any[];
  created_at: string;
  updated_at: string;
}

export const useGroupTrips = () => {
  const [groupTrips, setGroupTrips] = useState<GroupTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGroupTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('group_trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        setError(error.message);
        console.error('Error fetching group trips:', error);
      } else {
        setGroupTrips(data || []);
        setError(null);
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const createGroupTrip = async (tripData: Omit<GroupTrip, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating group trip with data:', tripData);
      
      const { data, error } = await supabase
        .from('group_trips')
        .insert([tripData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Group trip created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating group trip:', error);
      throw error;
    }
  };

  const updateGroupTrip = async (id: string, tripData: Partial<GroupTrip>) => {
    try {
      console.log('Updating group trip with ID:', id, 'Data:', tripData);
      
      const updateData = {
        ...tripData,
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('group_trips')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Group trip updated successfully:', data);
      return data;
    } catch (error) {
      console.error('Error updating group trip:', error);
      throw error;
    }
  };

  const deleteGroupTrip = async (id: string) => {
    try {
      console.log('Deleting group trip with ID:', id);
      
      const { error } = await supabase
        .from('group_trips')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      console.log('Group trip deleted successfully');
    } catch (error) {
      console.error('Error deleting group trip:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchGroupTrips();

    // Set up real-time subscription
    const channel = supabase
      .channel('group-trips-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_trips'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setGroupTrips(prev => [payload.new as GroupTrip, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setGroupTrips(prev => prev.map(trip => 
              trip.id === payload.new.id ? payload.new as GroupTrip : trip
            ));
          } else if (payload.eventType === 'DELETE') {
            setGroupTrips(prev => prev.filter(trip => trip.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { 
    groupTrips, 
    loading, 
    error, 
    refetch: fetchGroupTrips,
    createGroupTrip,
    updateGroupTrip,
    deleteGroupTrip
  };
};
