
import { useTripsContext } from "@/contexts/TripsContext";
import { Button } from "@/components/ui/button";

const TourPackages = ({ onTripClick }) => {
  const { trips, loading, error } = useTripsContext();

  // Filter trips for tour packages section
  const packageTrips = trips.filter(trip => trip.section === 'trending').slice(0, 3);

  if (loading) {
    return (
      <section id="packages" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">
              Discover Amazing
            </h2>
            <h2 className="text-5xl font-bold text-emerald-500 mb-4">
              Tour Packages
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Carefully curated experiences that blend adventure, comfort, and unforgettable memories.
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

  return (
    <section id="packages" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing
          </h2>
          <h2 className="text-5xl font-bold text-emerald-500 mb-6">
            Tour Packages
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Carefully curated experiences that blend adventure, comfort, and unforgettable memories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {packageTrips.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => onTripClick({
                id: pkg.id,
                title: pkg.title,
                location: pkg.location,
                price: pkg.price,
                description: pkg.description,
                image: pkg.image_url,
                tags: pkg.tags,
                duration: pkg.duration,
                max_guests: pkg.max_guests,
              })}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.image_url}
                  alt={pkg.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{pkg.title}</h3>
                <p className="text-gray-600 mb-4">{pkg.duration} days</p>
                <p className="text-gray-700 mb-6 text-sm leading-relaxed">{pkg.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-emerald-500">₹ {pkg.price}</div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Can't find the perfect Package? We offer custom itineraries tailored to your adventure level.
          </p>
          <Button className="bg-gray-900 hover:bg-gray-800 text-white px-8 py-3 rounded-lg text-lg">
            📅 Plan Custom Trip
          </Button>
        </div>
      </div>
    </section>
  );
};

export default TourPackages;
