
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Users, Calendar, Gauge } from "lucide-react";
import { useTripsContext } from "@/contexts/TripsContext";

const MountainTreks = ({ onTripClick }) => {
  const { trips, loading, error } = useTripsContext();

  // Filter trips for mountain section
  const mountainTrips = trips.filter(trip => trip.section === 'mountain').slice(0, 3);

  const getDifficultyColor = (index) => {
    const difficulties = ['orange', 'green', 'red'];
    const labels = ['Moderate', 'Easy', 'Challenging'];
    return { color: difficulties[index % 3], label: labels[index % 3] };
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Epic Trekking Adventures
            </h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Discover breathtaking mountain trails and embark on unforgettable journeys through nature's most spectacular landscapes.
            </p>
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
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Epic Trekking Adventures
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
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Epic Trekking Adventures
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            Discover breathtaking mountain trails and embark on unforgettable journeys through nature's most spectacular landscapes.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mountainTrips.map((trek, index) => {
            const difficulty = getDifficultyColor(index);
            return (
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
                  {/* Difficulty Badge */}
                  <div className="absolute top-4 left-4">
                    <Badge 
                      className={`${
                        difficulty.color === 'orange' ? 'bg-orange-500' :
                        difficulty.color === 'green' ? 'bg-green-500' : 'bg-red-500'
                      } text-white px-3 py-1 text-sm font-medium`}
                    >
                      🔺 {difficulty.label}
                    </Badge>
                  </div>
                  {/* Days Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-gray-700 text-white px-3 py-1 text-sm font-medium">
                      {trek.duration} Days
                    </Badge>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{trek.title}</h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">{trek.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="text-sm">{trek.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Gauge className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="text-sm">38 km round trip</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="text-sm">Max {trek.max_guests} people</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-emerald-500" />
                      <span className="text-sm">Jul-Sep</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-3xl font-bold text-emerald-500">₹{trek.price}</span>
                      <span className="text-gray-500 text-sm ml-1">/person</span>
                    </div>
                    <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg">
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
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
