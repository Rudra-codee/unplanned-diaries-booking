import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, DollarSign, Calendar, TrendingUp, Mail, MessageSquare } from "lucide-react";
import { TripModal } from "@/components/admin/TripModal";
import SecretTripModal from "@/components/admin/SecretTripModal";
import LiveBiddingFeed from "@/components/admin/LiveBiddingFeed";
import SubscriberManagement from "@/components/admin/SubscriberManagement";
import TripQueries from "@/components/admin/TripQueries";
import { useTripsWithRealtime } from "@/hooks/useTripsWithRealtime";
import { toast } from "sonner";
import type { Trip } from "@/hooks/useTrips";

interface BookingStats {
  total_bookings: number;
  pending_bookings: number;
  confirmed_bookings: number;
  total_revenue: number;
  total_guests: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showTripModal, setShowTripModal] = useState(false);
  const [showSecretTripModal, setShowSecretTripModal] = useState(false);
  const [editingTrip, setEditingTrip] = useState<Trip | undefined>(undefined);
  const [stats, setStats] = useState<BookingStats | null>(null);
  
  const { trips, loading: tripsLoading, refetch } = useTripsWithRealtime();

  useEffect(() => {
    checkAdmin();
    fetchStats();
  }, [user]);

  const checkAdmin = async () => {
    if (!user) {
      navigate("/auth");
      return;
    }

    try {
      const { data, error } = await supabase.rpc('is_admin', { user_id: user.id });
      
      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } else {
        setIsAdmin(data || false);
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_booking_stats');
      
      if (error) {
        console.error('Error fetching booking stats:', error);
      } else {
        setStats(data?.[0] || null);
      }
    } catch (error) {
      console.error('Error fetching booking stats:', error);
    }
  };

  const handleTripSubmit = async (tripData: any) => {
    console.log('Creating/updating trip:', tripData);
    
    try {
      if (editingTrip) {
        const { error } = await supabase
          .from('trips')
          .update(tripData)
          .eq('id', editingTrip.id);
          
        if (error) throw error;
        toast.success("Trip updated successfully!");
      } else {
        const { error } = await supabase
          .from('trips')
          .insert([tripData]);
          
        if (error) throw error;
        toast.success("Trip created successfully!");
      }
      
      setShowTripModal(false);
      setEditingTrip(undefined);
      refetch();
    } catch (error: any) {
      console.error('Error saving trip:', error);
      toast.error(`Failed to save trip: ${error.message}`);
    }
  };

  const handleEditTrip = (trip: Trip) => {
    setEditingTrip(trip);
    setShowTripModal(true);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip?")) return;
    
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', tripId);
        
      if (error) throw error;
      toast.success("Trip deleted successfully!");
      refetch();
    } catch (error: any) {
      console.error('Error deleting trip:', error);
      toast.error(`Failed to delete trip: ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go Back Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your travel business</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_bookings || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-500">
                {stats?.pending_bookings || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">
                {stats?.confirmed_bookings || 0}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.total_revenue || 0}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_guests || 0}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="trips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trips">Trips</TabsTrigger>
            <TabsTrigger value="secret-trips">Secret Trips</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="queries">Trip Queries</TabsTrigger>
            <TabsTrigger value="live-bidding">Live Bidding</TabsTrigger>
          </TabsList>

          <TabsContent value="trips" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Manage Trips</h2>
              <Button onClick={() => setShowTripModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Trip
              </Button>
            </div>

            <div className="overflow-x-auto">
              {tripsLoading ? (
                <div className="flex justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
                </div>
              ) : trips.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No trips found. Add some trips to get started!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trips.map((trip) => (
                      <TableRow key={trip.id}>
                        <TableCell className="font-medium">{trip.title}</TableCell>
                        <TableCell>{trip.location}</TableCell>
                        <TableCell>${trip.price}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{trip.type}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditTrip(trip)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteTrip(trip.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          <TabsContent value="secret-trips" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Secret Trips</h2>
              <Button onClick={() => setShowSecretTripModal(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Secret Trip
              </Button>
            </div>
            <p className="text-gray-600">
              Manage exclusive mystery trips that users can bid on.
            </p>
          </TabsContent>

          <TabsContent value="subscribers" className="space-y-6">
            <SubscriberManagement />
          </TabsContent>

          <TabsContent value="queries" className="space-y-6">
            <TripQueries />
          </TabsContent>

          <TabsContent value="live-bidding" className="space-y-6">
            <LiveBiddingFeed />
          </TabsContent>
        </Tabs>
      </div>

      <TripModal
        trip={editingTrip}
        isOpen={showTripModal}
        onClose={() => {
          setShowTripModal(false);
          setEditingTrip(undefined);
        }}
        onSubmit={handleTripSubmit}
      />

      <SecretTripModal
        isOpen={showSecretTripModal}
        onClose={() => setShowSecretTripModal(false)}
      />
    </div>
  );
};

export default AdminDashboard;
