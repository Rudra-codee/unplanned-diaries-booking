
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
import { Users, MapPin, Calendar, DollarSign, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";

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
  const [trips, setTrips] = useState([]);

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
      // Load stats
      const { data: statsData, error: statsError } = await supabase.rpc('get_admin_stats');
      if (statsError) {
        console.error('Error loading stats:', statsError);
      } else {
        setStats(statsData[0]);
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

      // Load trips
      const { data: tripsData, error: tripsError } = await supabase
        .from('trips')
        .select('*')
        .order('created_at', { ascending: false });

      if (tripsError) {
        console.error('Error loading trips:', tripsError);
      } else {
        setTrips(tripsData || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const updateBookingStatus = async (bookingId: string, newStatus: string) => {
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
          <p className="text-gray-600">Manage your travel business</p>
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
        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">Recent Bookings</TabsTrigger>
            <TabsTrigger value="trips">Manage Trips</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
          </TabsList>

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

          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <CardTitle>Manage Trips</CardTitle>
                <CardDescription>
                  View and manage all available trips
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  {trips.map((trip: any) => (
                    <div key={trip.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{trip.title}</h3>
                        <p className="text-sm text-gray-600">{trip.location}</p>
                        <p className="text-sm text-gray-500">${trip.price} • {trip.duration} days</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{trip.type}</Badge>
                        <Button size="sm" variant="outline">Edit</Button>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
};

export default AdminDashboard;
