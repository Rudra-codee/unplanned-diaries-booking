
import { useTripsContext } from "@/contexts/TripsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users } from "lucide-react";

interface TrendingDestinationsProps {
  onTripClick: (trip: any) => void;
}

const TrendingDestinations = ({ onTripClick }: TrendingDestinationsProps) => {
  const { trips, loading, error } = useTripsContext();

  // Filter trips for trending section
  const trendingTrips = trips.filter(trip => trip.section === 'trending');

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Trending <span className="text-emerald-500">Destinations</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden hover:shadow-xl transition-shadow animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trending <span className="text-emerald-500">Destinations</span>
          </h2>
          <p className="text-red-600">Error loading destinations: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="destinations" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trending <span className="text-emerald-500">Destinations</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the most popular destinations loved by travelers around the world
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trendingTrips.slice(0, 6).map((trip) => (
            <Card 
              key={trip.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
              onClick={() =>
                onTripClick({
                  id: trip.id,
                  title: trip.title,
                  location: trip.location,
                  price: trip.price,
                  description: trip.description,
                  image: trip.image_url,
                  tags: trip.tags,
                  duration: trip.duration,
                  max_guests: trip.max_guests,
                })
              }
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trip.image_url}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {trip.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4">
                  <Badge variant="secondary" className="bg-emerald-600 text-white">
                    ${trip.price}
                  </Badge>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-2 text-gray-900">
                  {trip.title}
                </h3>
                
                <div className="flex items-center text-gray-600 mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{trip.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{trip.duration} days</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1" />
                    <span>Max {trip.max_guests}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {trip.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {trip.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {trendingTrips.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No trending destinations available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default TrendingDestinations;
