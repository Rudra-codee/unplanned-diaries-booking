
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useTripsContext } from "@/contexts/TripsContext";

const MountainTreks = ({ onTripClick }) => {
  const { trips, loading, error } = useTripsContext();

  // Filter trips for mountain section
  const mountainTrips = trips.filter(trip => trip.section === 'mountain');

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Mountain <span className="text-emerald-500">Treks</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-64 bg-gray-300"></div>
                <div className="p-6">
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              </div>
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
            Explore Mountain <span className="text-emerald-500">Treks</span>
          </h2>
          <p className="text-red-600">Error loading mountain treks: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Explore Mountain <span className="text-emerald-500">Treks</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the majestic beauty of the Himalayas with our carefully curated mountain trekking experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mountainTrips.map((trek) => (
            <div
              key={trek.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => onTripClick({
                id: trek.id,
                title: trek.title,
                location: trek.location,
                price: trek.price,
                description: trek.description,
                image: trek.image_url,
                tags: trek.tags,
                duration: trek.duration,
                max_guests: trek.max_guests,
              })}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trek.image_url}
                  alt={trek.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">4.8</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{trek.title}</h3>
                  <p className="text-sm opacity-90">{trek.location}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{trek.duration} days</span>
                  <span className="text-2xl font-bold text-emerald-500">${trek.price}</span>
                </div>
                <p className="text-gray-700 mb-6 text-sm">{trek.description}</p>
                
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-full">
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>

        {mountainTrips.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No mountain treks available at the moment.
          </div>
        )}
      </div>
    </section>
  );
};

export default MountainTreks;
