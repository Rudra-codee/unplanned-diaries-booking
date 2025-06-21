
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const destinations = [
  {
    id: 1,
    name: "Spiti Valley",
    subtitle: "Expedition",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-orange-400 to-red-500"
  },
  {
    id: 2,
    name: "Discover Ladakh",
    subtitle: "Adventure",
    image: "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-cyan-400 to-blue-500"
  },
  {
    id: 3,
    name: "Best of HIMACHAL",
    subtitle: "Mountains",
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-emerald-400 to-teal-500"
  },
  {
    id: 4,
    name: "Uttrakhand",
    subtitle: "Gems",
    image: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    gradient: "from-blue-500 to-purple-600"
  }
];

const TrendingDestinations = ({ onTripClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Trending <span className="relative">Destinations
              <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full"></div>
            </span>
          </h2>
        </div>
        
        <div className="relative">
          <div className="flex gap-6 overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIndex * 25}%)` }}>
              {destinations.map((destination) => (
                <div
                  key={destination.id}
                  className="flex-none w-1/4 min-w-[300px] cursor-pointer group"
                  onClick={() => onTripClick(destination)}
                >
                  <div className="relative h-80 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <div className={`absolute inset-0 bg-gradient-to-br ${destination.gradient} opacity-80`} />
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="absolute inset-0 w-full h-full object-cover mix-blend-overlay"
                    />
                    <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                      <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
                      <p className="text-lg opacity-90">{destination.subtitle}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-gray-900/20 hover:bg-gray-900/40 text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-gray-900/20 hover:bg-gray-900/40 text-white p-3 rounded-full transition-all z-10"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex justify-center mt-8 space-x-2">
          {destinations.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentIndex ? "bg-emerald-500" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingDestinations;
