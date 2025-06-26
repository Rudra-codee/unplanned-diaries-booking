import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Users, DollarSign, Calendar, TrendingUp, Mail, MessageSquare, Settings, Bell, User, Search, Filter, Download, MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TripModal } from "@/components/admin/TripModal";
import SecretTripModal from "@/components/admin/SecretTripModal";
import LiveBiddingFeed from "@/components/admin/LiveBiddingFeed";
import SubscriberManagement from "@/components/admin/SubscriberManagement";
import TripQueries from "@/components/admin/TripQueries";
import CustomTripPlanner from "@/components/admin/CustomTripPlanner";
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
  const [activeTab, setActiveTab] = useState("trips");
  
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

  const handleSecretTripSubmit = async (data: any) => {
    console.log('Secret trip submitted:', data);
    toast.success("Secret trip created successfully!");
    setShowSecretTripModal(false);
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
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center">
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
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-orange-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-lg"></div>
                <span className="text-xl font-bold text-gray-900">Crextio</span>
              </div>
              <nav className="hidden md:flex space-x-6">
                <button 
                  onClick={() => setActiveTab("dashboard")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "dashboard" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Dashboard
                </button>
                <button 
                  onClick={() => setActiveTab("trips")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "trips" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Trips
                </button>
                <button 
                  onClick={() => setActiveTab("custom-trips")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "custom-trips" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MapPin className="h-4 w-4 mr-1 inline" />
                  Plan Custom Trip
                </button>
                <button 
                  onClick={() => setActiveTab("secret-trips")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "secret-trips" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Secret Trips
                </button>
                <button 
                  onClick={() => setActiveTab("subscribers")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "subscribers" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Subscribers
                </button>
                <button 
                  onClick={() => setActiveTab("queries")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "queries" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Queries
                </button>
                <button 
                  onClick={() => setActiveTab("live-bidding")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    activeTab === "live-bidding" ? "bg-gray-900 text-white" : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Live Bidding
                </button>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Overview */}
        {activeTab === "dashboard" && (
          <>
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Bookings</span>
                  <div className="flex space-x-1">
                    <div className="w-16 h-2 bg-gray-900 rounded-full"></div>
                    <span className="text-xs text-gray-600">25%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Revenue</span>
                  <div className="flex space-x-1">
                    <div className="w-16 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">51%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Growth</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
                    <span className="text-xs text-gray-600">10%</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Satisfaction</span>
                  <div className="flex space-x-1">
                    <div className="w-8 h-2 bg-gray-400 rounded-full"></div>
                    <span className="text-xs text-gray-600">14%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_bookings || 0}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
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
              
              <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
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
              
              <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats?.total_revenue || 0}</div>
                </CardContent>
              </Card>
              
              <Card className="bg-white/60 backdrop-blur-sm border-orange-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Guests</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.total_guests || 0}</div>
                </CardContent>
              </Card>
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-orange-100 overflow-hidden">
          {activeTab === "trips" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Trips</h2>
                  <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Filter className="h-4 w-4 mr-2" />
                        Columns
                      </Button>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="adventure">Adventure</SelectItem>
                          <SelectItem value="cultural">Cultural</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select>
                        <SelectTrigger className="w-32">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
                      <Input placeholder="Search trips..." className="pl-9 w-64" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button onClick={() => setShowTripModal(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add New Trip
                  </Button>
                </div>
              </div>

              <div className="overflow-x-auto">
                {tripsLoading ? (
                  <div className="flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                  </div>
                ) : trips.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No trips found. Add some trips to get started!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent border-gray-200">
                        <TableHead className="w-12">
                          <input type="checkbox" className="rounded" />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {trips.map((trip, index) => (
                        <TableRow 
                          key={trip.id} 
                          className={`hover:bg-yellow-50/50 border-gray-100 ${
                            index === 1 ? 'bg-yellow-100/50' : ''
                          }`}
                        >
                          <TableCell>
                            <input type="checkbox" className="rounded" />
                          </TableCell>
                          <TableCell className="font-medium">{trip.title}</TableCell>
                          <TableCell>{trip.location}</TableCell>
                          <TableCell>${trip.price}</TableCell>
                          <TableCell>
                            <Badge variant="secondary">{trip.type}</Badge>
                          </TableCell>
                          <TableCell>{trip.available_from}</TableCell>
                          <TableCell>
                            <Badge 
                              variant={index % 3 === 0 ? "default" : index % 3 === 1 ? "secondary" : "outline"}
                              className={
                                index % 3 === 0 ? "bg-green-100 text-green-700" :
                                index % 3 === 1 ? "bg-gray-100 text-gray-700" :
                                "bg-green-100 text-green-700"
                              }
                            >
                              {index % 3 === 0 ? "Active" : index % 3 === 1 ? "Pending" : "Active"}
                            </Badge>
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
            </div>
          )}

          {activeTab === "custom-trips" && (
            <div className="p-6">
              <CustomTripPlanner />
            </div>
          )}

          {activeTab === "secret-trips" && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Secret Trips</h2>
                <Button onClick={() => setShowSecretTripModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Secret Trip
                </Button>
              </div>
              <p className="text-gray-600 mb-6">
                Manage exclusive mystery trips that users can bid on.
              </p>
            </div>
          )}

          {activeTab === "subscribers" && (
            <div className="p-6">
              <SubscriberManagement />
            </div>
          )}

          {activeTab === "queries" && (
            <div className="p-6">
              <TripQueries />
            </div>
          )}

          {activeTab === "live-bidding" && (
            <div className="p-6">
              <LiveBiddingFeed />
            </div>
          )}
        </div>
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
        onSubmit={handleSecretTripSubmit}
        isLoading={false}
      />
    </div>
  );
};

export default AdminDashboard;
