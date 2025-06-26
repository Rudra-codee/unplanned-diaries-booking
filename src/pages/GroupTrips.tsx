
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useGroupTrips } from "@/hooks/useGroupTrips";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Users, Calendar, Star } from "lucide-react";
import { toast } from "sonner";

const GroupTrips = () => {
  const { groupTrips, loading } = useGroupTrips();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { user } = useAuth();
  const navigate = useNavigate();

  const categories = [
    { id: "all", name: "All Trips", icon: "🌟" },
    { id: "educational", name: "Educational", icon: "📚" },
    { id: "corporate", name: "Corporate", icon: "💼" },
    { id: "family", name: "Family", icon: "👨‍👩‍👧‍👦" },
    { id: "adventure", name: "Adventure", icon: "🏔️" },
    { id: "cultural", name: "Cultural", icon: "🏛️" },
    { id: "wellness", name: "Wellness", icon: "🧘‍♀️" }
  ];

  const filteredTrips = selectedCategory === "all" 
    ? groupTrips 
    : groupTrips.filter(trip => trip.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      educational: "bg-blue-100 text-blue-800",
      corporate: "bg-purple-100 text-purple-800",
      family: "bg-green-100 text-green-800",
      adventure: "bg-orange-100 text-orange-800",
      cultural: "bg-pink-100 text-pink-800",
      wellness: "bg-teal-100 text-teal-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const handleBookNow = (trip: any) => {
    if (!user) {
      toast.error("Please sign in to make a booking");
      navigate("/auth");
      return;
    }
    
    // For now, just show a success message
    toast.success("Booking request submitted! We'll contact you soon.");
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Group <span className="text-emerald-600">Adventures</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Discover amazing group travel experiences tailored for educational tours, corporate retreats, 
              family vacations, and adventure seekers.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center gap-2"
              >
                <span>{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-lg">Loading amazing trips...</div>
            </div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip) => (
                <Card key={trip.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                  {trip.image_url && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={trip.image_url}
                        alt={trip.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge className={getCategoryColor(trip.category)}>
                          {trip.category.charAt(0).toUpperCase() + trip.category.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )}
                  
                  <CardHeader>
                    <CardTitle className="text-xl group-hover:text-emerald-600 transition-colors">
                      {trip.title}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {trip.location}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 line-clamp-3">
                      {trip.description}
                    </p>
                    
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {trip.duration} days
                      </div>
                      {trip.max_guests && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          Up to {trip.max_guests} people
                        </div>
                      )}
                    </div>
                    
                    {trip.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {trip.tags.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <div>
                        <span className="text-2xl font-bold text-emerald-600">₹{trip.price.toLocaleString()}</span>
                        <span className="text-sm text-gray-500 ml-1">per person</span>
                      </div>
                      <Button 
                        onClick={() => handleBookNow(trip)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        Book Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No trips found in this category
              </h3>
              <p className="text-gray-600 mb-6">
                Try selecting a different category or check back later for new adventures!
              </p>
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory("all")}
              >
                View All Trips
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GroupTrips;
