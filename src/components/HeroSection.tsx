
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";

const destinations = [
  {
    id: 1,
    location: "Bali, Indonesia",
    title: "Enjoy Your Travel With Us",
    description: "Find your zen in this tropical paradise where ancient temples meet pristine beaches and lush rice terraces.",
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: 2,
    location: "Swiss Alps, Switzerland",
    title: "Mountain Adventures Await",
    description: "Experience breathtaking alpine views and world-class skiing in the heart of the Swiss Alps.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  },
  {
    id: 3,
    location: "Maldives",
    title: "Tropical Paradise Escape",
    description: "Dive into crystal-clear waters and relax in overwater bungalows surrounded by coral reefs.",
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % destinations.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + destinations.length) % destinations.length);
  };

  return (
    <div className="relative h-screen flex items-center justify-center overflow-hidden">
      {destinations.map((dest, index) => (
        <div
          key={dest.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${dest.image})` }}
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}
      
      <div className="relative z-10 text-center text-white px-4 max-w-4xl">
        <div className="flex items-center justify-center mb-4">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          <span className="text-lg font-medium">{destinations[currentSlide].location}</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          {destinations[currentSlide].title}
        </h1>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-2xl mx-auto">
          {destinations[currentSlide].description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold">
            Explore Now
          </Button>
          <Button variant="outline" className="border-white text-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full text-lg font-semibold flex items-center gap-2">
            <Play className="w-5 h-5" />
            Play the video
          </Button>
        </div>
        
        <div className="absolute right-8 top-1/2 transform -translate-y-1/2 hidden lg:block">
          <div className="space-y-4">
            {destinations.map((_, index) => (
              <div
                key={index}
                className={`w-20 h-14 rounded-lg cursor-pointer transition-all ${
                  index === currentSlide ? "ring-2 ring-white" : "opacity-60"
                }`}
                onClick={() => setCurrentSlide(index)}
              >
                <img
                  src={destinations[index].image}
                  alt={destinations[index].location}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentSlide ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSection;
