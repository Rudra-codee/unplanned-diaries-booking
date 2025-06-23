
import { useTripsContext } from "@/contexts/TripsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Users, Star } from "lucide-react";

interface UpcomingTripsProps {
  onTripClick?: (trip: any) => void;
}

const UpcomingTrips = ({ onTripClick }: UpcomingTripsProps) => {
  const { trips, loading, error } = useTripsContext();

  // Filter trips for upcoming section
  const upcomingTrips = trips.filter(trip => trip.section === 'upcoming');

  console.log('All trips:', trips);
  console.log('Upcoming trips filtered:', upcomingTrips);

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Upcoming <span className="text-emerald-500">Trips</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover amazing destinations and create unforgettable memories with our carefully curated travel experiences
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming <span className="text-emerald-500">Trips</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Discover amazing destinations and create unforgettable memories with our carefully curated travel experiences
          </p>
          <p className="text-red-600">Error loading upcoming trips: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Upcoming <span className="text-emerald-500">Trips</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover amazing destinations and create unforgettable memories with our carefully curated travel experiences
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingTrips.map((trip) => (
            <Card 
              key={trip.id}
              className="overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2"
              onClick={() => onTripClick && onTripClick({
                id: trip.id,
                title: trip.title,
                location: trip.location,
                price: trip.price,
                description: trip.description,
                image: trip.image_url,
                tags: trip.tags,
                duration: trip.duration,
                max_guests: trip.max_guests,
              })}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trip.image_url || '/placeholder.svg'}
                  alt={trip.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="bg-white/90 text-gray-800">
                    {trip.type}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">4.8</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{trip.title}</h3>
                  <p className="text-sm opacity-90">{trip.location}</p>
                </div>
              </div>
              
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock className="h-4 w-4 mr-1" />
                    <span className="text-sm">{trip.duration} days</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-4 w-4 mr-1" />
                    <span className="text-sm">Max {trip.max_guests}</span>
                  </div>
                </div>

                <p className="text-gray-700 mb-4 text-sm line-clamp-3">
                  {trip.description}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-emerald-500">${trip.price}</span>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full">
                    Book Now
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1 mt-4">
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

        {upcomingTrips.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-lg">No upcoming trips available at the moment.</p>
            <p className="text-sm mt-2">Check back soon for exciting new adventures!</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default UpcomingTrips;
