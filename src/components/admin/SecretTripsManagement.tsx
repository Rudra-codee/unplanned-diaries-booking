
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Plus, Timer, Users, Trash2, Eye } from 'lucide-react';
import SecretTripModal from './SecretTripModal';

interface SecretTrip {
  id: string;
  title: string;
  description: string;
  max_guests: number;
  available_seats: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
}

const SecretTripsManagement = () => {
  const [secretTrips, setSecretTrips] = useState<SecretTrip[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchSecretTrips();
  }, []);

  const fetchSecretTrips = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('secret_trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching secret trips:', error);
        toast.error('Failed to load secret trips');
      } else {
        setSecretTrips(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTrip = (newTrip: SecretTrip) => {
    setSecretTrips(prev => [newTrip, ...prev]);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Are you sure you want to delete this secret trip?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('secret_trips')
        .delete()
        .eq('id', tripId);

      if (error) {
        console.error('Error deleting secret trip:', error);
        toast.error('Failed to delete secret trip');
        return;
      }

      setSecretTrips(prev => prev.filter(trip => trip.id !== tripId));
      toast.success('Secret trip deleted successfully');
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while deleting the secret trip');
    }
  };

  const getTimeRemaining = (endDate: string) => {
    const now = new Date().getTime();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) return 'Expired';

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Secret Trips Management</h2>
          <p className="text-muted-foreground">Manage mystery adventures with bidding timers</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create Secret Trip
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {secretTrips.map((trip) => (
          <Card key={trip.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <Badge variant={trip.is_active ? "default" : "secondary"}>
                  {trip.is_active ? "Active" : "Inactive"}
                </Badge>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => handleDeleteTrip(trip.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <CardTitle className="text-lg">{trip.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground line-clamp-2">
                {trip.description}
              </p>
              
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  {trip.available_seats}/{trip.max_guests} seats
                </div>
                <div className="flex items-center gap-1">
                  <Timer className="h-4 w-4" />
                  {getTimeRemaining(trip.end_date)}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                <p>Start: {new Date(trip.start_date).toLocaleDateString()}</p>
                <p>End: {new Date(trip.end_date).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {secretTrips.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">No secret trips found</p>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Secret Trip
            </Button>
          </CardContent>
        </Card>
      )}

      <SecretTripModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTrip}
        isLoading={isCreating}
      />
    </div>
  );
};

export default SecretTripsManagement;
