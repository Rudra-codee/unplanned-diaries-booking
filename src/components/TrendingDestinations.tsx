
import { useTripsContext } from "@/contexts/TripsContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface TrendingDestinationsProps {
  onTripClick: (trip: any) => void;
}

const TrendingDestinations = ({ onTripClick }: TrendingDestinationsProps) => {
  const { trips, loading, error } = useTripsContext();
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter trips for trending section
  const trendingTrips = trips.filter(trip => trip.section === 'trending');

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + 3 >= trendingTrips.length ? 0 : prev + 3
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev - 3 < 0 ? Math.max(0, trendingTrips.length - 3) : prev - 3
    );
  };

  if (loading) {
    return (
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Trending <span className="relative">Destinations<span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></span></span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
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
      <section id="destinations" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Trending <span className="relative">Destinations<span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></span></span>
          </h2>
          <p className="text-red-600">Error loading destinations: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Trending <span className="relative">Destinations<span className="absolute bottom-0 left-0 w-full h-1 bg-yellow-400"></span></span>
          </h2>
        </div>

        <div className="relative">
          {/* Carousel Navigation */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 z-10 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 z-10 w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white hover:bg-gray-800 transition-colors"
            disabled={currentIndex + 3 >= trendingTrips.length}
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Cards Container */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-300 ease-in-out gap-8"
              style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
            >
              {trendingTrips.map((trip) => (
                <div
                  key={trip.id}
                  className="flex-none w-full md:w-1/2 lg:w-1/3"
                >
                  <Card 
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
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    
                    <CardContent className="p-6 text-center">
                      <h3 className="text-xl font-bold mb-3 text-gray-900">
                        {trip.title}
                      </h3>
                      
                      <div className="text-2xl font-bold text-gray-900 mb-2">
                        ₹ {trip.price}
                      </div>

                      <div className="flex items-center justify-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{trip.duration} Days Trip</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>

        {trendingTrips.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No trending destinations available at the moment.
          </div>
        )}

        {/* Pagination Dots */}
        <div className="flex justify-center mt-8 space-x-2">
          {Array.from({ length: Math.ceil(trendingTrips.length / 3) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * 3)}
              className={`w-3 h-3 rounded-full transition-colors ${
                Math.floor(currentIndex / 3) === index ? 'bg-gray-900' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;
