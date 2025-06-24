
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Play, MapPin } from "lucide-react";

const destinations = [
  {
    id: 1,
    location: "LOCATION, STATE",
    title: "The Journey Beyond Your Imaginary",
    description: "Discover thousands of beautiful places around the world with wonderful experiences you can imagine.",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cardImage1: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cardLocation1: "The Location Name",
    cardCountry1: "Country",
    cardImage2: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cardLocation2: "The Location",
    cardCountry2: "Country"
  },
  {
    id: 2,
    location: "SWITZERLAND",
    title: "Alpine Adventures Await",
    description: "Experience breathtaking mountain views and pristine lakes in the heart of the Swiss Alps.",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cardImage1: "https://images.unsplash.com/photo-1519904981063-b0cf448d479e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cardLocation1: "Matterhorn Valley",
    cardCountry1: "Switzerland",
    cardImage2: "https://images.unsplash.com/photo-1510672734144-2b4ba0c2de2b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cardLocation2: "Lake Geneva",
    cardCountry2: "Switzerland"
  },
  {
    id: 3,
    location: "HIMALAYAS, NEPAL",
    title: "Mountain Peaks Beyond Dreams",
    description: "Journey through the world's highest mountains and discover the beauty of the Himalayas.",
    image: "https://images.unsplash.com/photo-1544735716-392fe2489ffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    cardImage1: "https://images.unsplash.com/photo-1605540436563-5bca919ae766?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cardLocation1: "Everest Base Camp",
    cardCountry1: "Nepal",
    cardImage2: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    cardLocation2: "Annapurna Circuit",
    cardCountry2: "Nepal"
  }
];

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % destinations.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, []);

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
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${dest.image})` }}
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
      ))}
      
      <div className="relative z-10 flex items-center justify-between w-full max-w-7xl mx-auto px-4">
        {/* Left Content */}
        <div className="flex-1 text-white max-w-2xl">
          <div className="flex items-center mb-6">
            <MapPin className="w-5 h-5 mr-2" />
            <span className="text-lg font-medium tracking-wider">
              {destinations[currentSlide].location}
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            {destinations[currentSlide].title}
          </h1>
          
          <p className="text-xl mb-8 opacity-90 leading-relaxed">
            {destinations[currentSlide].description}
          </p>
          
          <div className="flex items-center space-x-6">
            <Button className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-3 rounded-none text-lg font-medium">
              Explore Now
            </Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 px-8 py-3 rounded-none text-lg font-medium flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <Play className="w-5 h-5 ml-1" />
              </div>
              Play the video
            </Button>
          </div>

          {/* Bottom Values */}
          <div className="flex items-center space-x-12 mt-16">
            <div>
              <h3 className="text-xl font-bold mb-2">Excellence</h3>
              <p className="text-sm opacity-80 max-w-xs">
                Striving for exceptional quality in every aspect of our service.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Sustainable</h3>
              <p className="text-sm opacity-80 max-w-xs">
                Promoting responsible travel practices for a greener future.
              </p>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex items-center space-x-4 mt-8">
            <span className="text-sm opacity-80">Follow us:</span>
            <a href="#" className="text-white hover:text-emerald-300 transition-colors">ig</a>
            <a href="#" className="text-white hover:text-emerald-300 transition-colors">fb</a>
            <a href="#" className="text-white hover:text-emerald-300 transition-colors">tw</a>
            <a href="#" className="text-white hover:text-emerald-300 transition-colors">in</a>
          </div>
        </div>
        
        {/* Right Side Cards */}
        <div className="hidden lg:flex flex-col space-y-4 relative">
          <div className="w-80 h-64 rounded-2xl overflow-hidden relative group cursor-pointer">
            <img
              src={destinations[currentSlide].cardImage1}
              alt={destinations[currentSlide].cardLocation1}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{destinations[currentSlide].cardLocation1}</span>
              </div>
              <span className="text-xs opacity-80">{destinations[currentSlide].cardCountry1}</span>
            </div>
          </div>
          
          <div className="w-80 h-64 rounded-2xl overflow-hidden relative group cursor-pointer">
            <img
              src={destinations[currentSlide].cardImage2}
              alt={destinations[currentSlide].cardLocation2}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-4 left-4 text-white">
              <div className="flex items-center mb-1">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm font-medium">{destinations[currentSlide].cardLocation2}</span>
              </div>
              <span className="text-xs opacity-80">{destinations[currentSlide].cardCountry2}</span>
            </div>
          </div>
          
          {/* Navigation Arrow */}
          <button
            onClick={nextSlide}
            className="absolute -right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors shadow-lg"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
      
      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-8 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-colors lg:hidden"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default HeroSection;
