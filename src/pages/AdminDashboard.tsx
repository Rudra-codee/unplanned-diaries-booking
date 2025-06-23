
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { Users, MapPin, Calendar, DollarSign, Loader2, Plus, Edit, Trash2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import { TripModal } from "@/components/admin/TripModal";
import { useTripsWithRealtime } from "@/hooks/useTripsWithRealtime";
import type { Database } from "@/integrations/supabase/types";
import type { Trip } from "@/hooks/useTrips";

type BookingStatus = Database["public"]["Enums"]["booking_status"];

interface AdminStats {
  total_users: number;
  total_trips: number;
  total_bookings: number;
  total_revenue: number;
  pending_bookings: number;
  confirmed_bookings: number;
}

interface Booking {
  id: string;
  guest_name: string;
  guest_email: string;
  travel_date: string;
  status: string;
  total_amount: number;
  number_of_guests: number;
  created_at: string;
  trips: {
    title: string;
    location: string;
  };
}

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { trips, loading: tripsLoading, createTrip, updateTrip, deleteTrip } = useTripsWithRealtime();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
      return;
    }

    if (user) {
      checkAdminStatus();
    }
  }, [user, authLoading, navigate]);

  const checkAdminStatus = async () => {
    try {
      const { data, error } = await supabase.rpc('is_admin');
      
      if (error) {
        console.error('Error checking admin status:', error);
        toast.error("Error checking admin permissions");
        navigate("/");
        return;
      }

      if (!data) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }

      setIsAdmin(true);
      await loadDashboardData();
    } catch (error) {
      console.error('Error in checkAdminStatus:', error);
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      // Load booking stats using the correct function
      const { data: bookingStatsData, error: statsError } = await supabase.rpc('get_booking_stats');
      if (statsError) {
        console.error('Error loading booking stats:', statsError);
      } else if (bookingStatsData && bookingStatsData.length > 0) {
        const bookingStats = bookingStatsData[0];
        
        // Get additional stats
        const { count: userCount } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        const { count: tripCount } = await supabase
          .from('trips')
          .select('*', { count: 'exact', head: true });

        setStats({
          total_users: userCount || 0,
          total_trips: tripCount || 0,
          total_bookings: Number(bookingStats.total_bookings) || 0,
          total_revenue: Number(bookingStats.total_revenue) || 0,
          pending_bookings: Number(bookingStats.pending_bookings) || 0,
          confirmed_bookings: Number(bookingStats.confirmed_bookings) || 0,
        });
      }

      // Load recent bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select(`
          *,
          trips:trip_id (
            title,
            location
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (bookingsError) {
        console.error('Error loading bookings:', bookingsError);
      } else {
        setBookings(bookingsData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: BookingStatus) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: newStatus })
        .eq('id', bookingId);

      if (error) {
        toast.error("Failed to update booking status");
        return;
      }

      toast.success("Booking status updated successfully");
      loadDashboardData(); // Refresh data
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleCreateTrip = () => {
    setSelectedTrip(null);
    setIsModalOpen(true);
  };

  const handleEditTrip = (trip: Trip) => {
    setSelectedTrip(trip);
    setIsModalOpen(true);
  };

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm("Are you sure you want to delete this trip? This action cannot be undone.")) {
      return;
    }

    try {
      await deleteTrip(tripId);
      toast.success("Trip deleted successfully");
    } catch (error) {
      toast.error("Failed to delete trip");
    }
  };

  const handleTripSubmit = async (data: any) => {
    setIsSubmitting(true);
    try {
      if (selectedTrip) {
        await updateTrip(selectedTrip.id, data);
        toast.success("Trip updated successfully");
      } else {
        await createTrip(data);
        toast.success("Trip created successfully");
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(`Failed to ${selectedTrip ? 'update' : 'create'} trip`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your travel business with real-time updates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_users || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Trips</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_trips || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats?.total_bookings || 0}</div>
              <p className="text-xs text-muted-foreground">
                {stats?.pending_bookings || 0} pending
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats?.total_revenue || 0}</div>
              <p className="text-xs text-muted-foreground">
                From confirmed bookings
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for different sections */}
        <Tabs defaultValue="trips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trips">Manage Trips</TabsTrigger>
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Trip Management</CardTitle>
                    <CardDescription>
                      Create, edit, and manage all trips with real-time synchronization
                    </CardDescription>
                  </div>
                  <Button onClick={handleCreateTrip} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Trip
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {tripsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {trips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center space-x-4">
                          <img
                            src={trip.image_url}
                            alt={trip.title}
                            className="w-16 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{trip.title}</h3>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {trip.location}
                            </p>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="text-sm text-gray-500">${trip.price}</span>
                              <span className="text-sm text-gray-500">{trip.duration} days</span>
                              <span className="text-sm text-gray-500">Max {trip.max_guests} guests</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {trip.type}
                          </Badge>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditTrip(trip)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDeleteTrip(trip.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    {trips.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No trips found. Create your first trip to get started.
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Latest booking requests and their status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Guest</TableHead>
                      <TableHead>Trip</TableHead>
                      <TableHead>Travel Date</TableHead>
                      <TableHead>Guests</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.guest_name}</div>
                            <div className="text-sm text-gray-500">{booking.guest_email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{booking.trips?.title}</div>
                            <div className="text-sm text-gray-500">{booking.trips?.location}</div>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(booking.travel_date).toLocaleDateString()}</TableCell>
                        <TableCell>{booking.number_of_guests}</TableCell>
                        <TableCell>${booking.total_amount}</TableCell>
                        <TableCell>
                          <Badge variant={
                            booking.status === 'confirmed' ? 'default' :
                            booking.status === 'pending' ? 'secondary' :
                            booking.status === 'cancelled' ? 'destructive' : 'outline'
                          }>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => updateBookingStatus(booking.id, 'confirmed')}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateBookingStatus(booking.id, 'cancelled')}
                              >
                                Cancel
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View registered users and their activity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center text-gray-500 py-8">
                  User management features coming soon...
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <TripModal
        trip={selectedTrip}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleTripSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default AdminDashboard;
