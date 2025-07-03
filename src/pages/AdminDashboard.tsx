
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Calendar, DollarSign, TrendingUp, Settings } from "lucide-react";
import TripManagement from "@/components/admin/TripManagement";
import SecretTripsManagement from "@/components/admin/SecretTripsManagement";
import GroupTripsManagement from "@/components/admin/GroupTripsManagement";
import SubscriberManagement from "@/components/admin/SubscriberManagement";
import TripQueries from "@/components/admin/TripQueries";
import CustomTripPlanner from "@/components/admin/CustomTripPlanner";
import { TripsProvider } from "@/contexts/TripsContext";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  const stats = [
    {
      title: "Total Trips",
      value: "24",
      description: "Active travel packages",
      icon: MapPin,
      trend: "+12%",
    },
    {
      title: "Bookings",
      value: "156",
      description: "This month",
      icon: Calendar,
      trend: "+23%",
    },
    {
      title: "Revenue",
      value: "₹2,45,000",
      description: "This month",
      icon: DollarSign,
      trend: "+18%",
    },
    {
      title: "Subscribers",
      value: "1,247",
      description: "Newsletter subscribers",
      icon: Users,
      trend: "+8%",
    },
  ];

  return (
    <TripsProvider>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your travel business with ease</p>
            </div>
            <Badge variant="secondary">
              <Settings className="h-4 w-4 mr-1" />
              Admin Panel
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="trips">Trips</TabsTrigger>
              <TabsTrigger value="secret-trips">Secret Trips</TabsTrigger>
              <TabsTrigger value="group-trips">Group Trips</TabsTrigger>
              <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
              <TabsTrigger value="queries">Queries</TabsTrigger>
              <TabsTrigger value="custom-trips">Custom Trips</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                      <stat.icon className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stat.value}</div>
                      <p className="text-xs text-muted-foreground">{stat.description}</p>
                      <div className="flex items-center space-x-1 text-xs text-green-600 mt-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>{stat.trend}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>Latest trip bookings from customers</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "Raj Patel", trip: "Goa Beach Paradise", amount: "₹25,000" },
                        { name: "Priya Sharma", trip: "Himalayan Trek", amount: "₹18,000" },
                        { name: "Amit Kumar", trip: "Kerala Backwaters", amount: "₹22,000" },
                      ].map((booking, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{booking.name}</p>
                            <p className="text-sm text-muted-foreground">{booking.trip}</p>
                          </div>
                          <p className="font-semibold">{booking.amount}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Popular Destinations</CardTitle>
                    <CardDescription>Most booked travel destinations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { destination: "Goa", bookings: 45, trend: "+12%" },
                        { destination: "Manali", bookings: 32, trend: "+8%" },
                        { destination: "Kerala", bookings: 28, trend: "+15%" },
                      ].map((destination, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">{destination.destination}</p>
                            <p className="text-sm text-muted-foreground">{destination.bookings} bookings</p>
                          </div>
                          <Badge variant="secondary">{destination.trend}</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trips">
              <TripManagement />
            </TabsContent>

            <TabsContent value="secret-trips">
              <SecretTripsManagement />
            </TabsContent>

            <TabsContent value="group-trips">
              <GroupTripsManagement />
            </TabsContent>

            <TabsContent value="subscribers">
              <SubscriberManagement />
            </TabsContent>

            <TabsContent value="queries">
              <TripQueries />
            </TabsContent>

            <TabsContent value="custom-trips">
              <CustomTripPlanner />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TripsProvider>
  );
}
