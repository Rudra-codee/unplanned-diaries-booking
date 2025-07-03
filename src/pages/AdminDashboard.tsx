
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Users, TrendingUp, Calendar, MapPin, Timer, MessageSquare } from "lucide-react";
import { toast } from "sonner";
import TripManagement from "@/components/admin/TripManagement";
import CustomTripPlanner from "@/components/admin/CustomTripPlanner";
import { GroupTripsManagement } from "@/components/admin/GroupTripsManagement";
import SecretTripsManagement from "@/components/admin/SecretTripsManagement";
import SubscriberManagement from "@/components/admin/SubscriberManagement";

const AdminDashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total_bookings: 0,
    pending_bookings: 0,
    confirmed_bookings: 0,
    total_revenue: 0,
    total_guests: 0
  });
  const [dashboardStats, setDashboardStats] = useState({
    total_users: 0,
    custom_trip_requests: 0,
    tour_packages_count: 0,
    mountain_treks_count: 0,
    subscribers_count: 0,
    secret_trips_count: 0
  });

  useEffect(() => {
    checkAdminStatus();
    fetchStats();
    fetchDashboardStats();
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      if (!user) {
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase.rpc('is_admin');
      
      if (error || !data) {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
        return;
      }
      
      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin status:", error);
      toast.error("Access denied. Admin privileges required.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_booking_stats');
      if (error) throw error;
      
      if (data && data.length > 0) {
        setStats(data[0]);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      // Fetch total users count
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Fetch custom trip requests count
      const { count: customTripCount } = await supabase
        .from('custom_trip_requests')
        .select('*', { count: 'exact', head: true });

      // Fetch tour packages count (trips with section 'packages')
      const { count: tourPackagesCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('section', 'packages');

      // Fetch mountain treks count (trips with section 'mountain')
      const { count: mountainTreksCount } = await supabase
        .from('trips')
        .select('*', { count: 'exact', head: true })
        .eq('section', 'mountain');

      // Fetch subscribers count
      const { count: subscribersCount } = await supabase
        .from('subscribers')
        .select('*', { count: 'exact', head: true });

      // Fetch secret trips count
      const { count: secretTripsCount } = await supabase
        .from('secret_trips')
        .select('*', { count: 'exact', head: true });

      setDashboardStats({
        total_users: usersCount || 0,
        custom_trip_requests: customTripCount || 0,
        tour_packages_count: tourPackagesCount || 0,
        mountain_treks_count: mountainTreksCount || 0,
        subscribers_count: subscribersCount || 0,
        secret_trips_count: secretTripsCount || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate("/");
      toast.success("Successfully signed out!");
    } catch (error) {
      toast.error("Error signing out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p>Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-600">Welcome back, {user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_bookings}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.total_users}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Custom Trip Requests</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.custom_trip_requests}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tour Packages</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.tour_packages_count}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Mountain Treks</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.mountain_treks_count}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Subscribers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.subscribers_count}</div>
            </CardContent>
          </Card>
        </div>

        {/* Revenue and Secret Trips Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{Number(stats.total_revenue).toLocaleString()}</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Secret Trips</CardTitle>
              <Timer className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardStats.secret_trips_count}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="trips" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="trips">Trip Management</TabsTrigger>
            <TabsTrigger value="secret-trips">Secret Trips</TabsTrigger>
            <TabsTrigger value="group-trips">Group Trips</TabsTrigger>
            <TabsTrigger value="custom-trips">Custom Trip Planner</TabsTrigger>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trips">
            <Card>
              <CardHeader>
                <CardTitle>Trip Management</CardTitle>
                <CardDescription>
                  Manage all trips, packages, and destinations with real-time updates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TripManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="secret-trips">
            <Card>
              <CardHeader>
                <CardTitle>Secret Trips Management</CardTitle>
                <CardDescription>
                  Create and manage mystery adventures with bidding timers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SecretTripsManagement />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="group-trips">
            <Card>
              <CardHeader>
                <CardTitle>Group Trips Management</CardTitle>
                <CardDescription>
                  Manage educational, corporate, family and other group travel packages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <GroupTripsManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="custom-trips">
            <Card>
              <CardHeader>
                <CardTitle>Custom Trip Planner</CardTitle>
                <CardDescription>
                  Manage custom trip requests and create personalized itineraries
                </CardDescription>
              </CardHeader>
              <CardContent>
                <CustomTripPlanner />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Subscriber Management</CardTitle>
                <CardDescription>
                  Manage subscribers and send notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <SubscriberManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
