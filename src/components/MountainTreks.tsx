
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const treks = [
  {
    id: 1,
    name: "Kedarkantha Trek",
    location: "Uttarakhand",
    duration: "6 days",
    price: "$299",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "One of the most rewarding winter treks offering panoramic views of major Himalayan peaks."
  },
  {
    id: 2,
    name: "Har Ki Dun Trek",
    location: "Uttarakhand",
    duration: "7 days",
    price: "$399",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "A cradle-shaped hanging valley also known as the 'Valley of Gods' in Garhwal Himalayas."
  },
  {
    id: 3,
    name: "Sandakphu Trek",
    location: "West Bengal",
    duration: "5 days",
    price: "$349",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    description: "Famous for the sunrise view over the world's highest peaks including Everest and Kanchenjunga."
  }
];

const MountainTreks = ({ onTripClick }) => {
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
          {treks.map((trek) => (
            <div
              key={trek.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => onTripClick(trek)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={trek.image}
                  alt={trek.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{trek.rating}</span>
                </div>
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold mb-1">{trek.name}</h3>
                  <p className="text-sm opacity-90">{trek.location}</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-gray-600">{trek.duration}</span>
                  <span className="text-2xl font-bold text-emerald-500">{trek.price}</span>
                </div>
                <p className="text-gray-700 mb-6 text-sm">{trek.description}</p>
                
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-full">
                  Book Now
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MountainTreks;
