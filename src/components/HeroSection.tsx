
import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, MapPin, Play } from 'lucide-react';

const destinations = [
  {
    id: 1,
    location: "Swiss Alps, Switzerland",
    title: "Your Next Adventure Awaits!",
    description: "We're not a travel agency. We're the ones who are here to transform lives through travel! It's good for health, you know like, yoga?",
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    highlights: [
      { label: "Excellence", description: "Striving for exceptional quality in every aspect of our service." },
      { label: "Sustainable", description: "Promoting responsible travel practices for a greener future." }
    ]
  },
  {
    id: 2,
    location: "Santorini, Greece",
    title: "Transform Your Life Through Travel",
    description: "Experience the breathtaking beauty of white-washed buildings overlooking azure waters in this iconic Greek island.",
    image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    highlights: [
      { label: "Cultural", description: "Immerse yourself in rich history and local traditions." },
      { label: "Luxury", description: "Premium accommodations with world-class amenities." }
    ]
  },
  {
    id: 3,
    location: "Bali, Indonesia",
    title: "Enjoy Your Travel With Us",
    description: "Find your zen in this tropical paradise where ancient temples meet pristine beaches and lush rice terraces.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80",
    highlights: [
      { label: "Adventure", description: "Thrilling activities from volcano hiking to water sports." },
      { label: "Wellness", description: "Rejuvenate your mind, body and soul in nature's embrace." }
    ]
  }
];

const HeroSection = () => {
  const [currentDestination, setCurrentDestination] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      nextDestination();
    }, 8000);

    return () => clearInterval(interval);
  }, [currentDestination]);

  const nextDestination = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDestination((prev) => (prev + 1) % destinations.length);
      setIsTransitioning(false);
    }, 300);
  };

  const prevDestination = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDestination((prev) => (prev - 1 + destinations.length) % destinations.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToDestination = (index: number) => {
    if (isTransitioning || index === currentDestination) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentDestination(index);
      setIsTransitioning(false);
    }, 300);
  };

  const handleExploreClick = () => {
    document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' });
    console.log('Explore Now clicked');
  };

  const handlePlayVideo = () => {
    // Open a video modal or redirect to video
    alert('Video functionality would be implemented here - opening travel video!');
    console.log('Play video clicked');
  };

  const current = destinations[currentDestination];

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden pt-16 lg:pt-20">
      {/* Background Images with Smooth Transition */}
      {destinations.map((destination, index) => (
        <div
          key={destination.id}
          className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-in-out ${
            index === currentDestination 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
          style={{
            backgroundImage: `url(${destination.image})`,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Main Content */}
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-2 gap-8 items-center">
          {/* Left Content */}
          <div className={`space-y-4 sm:space-y-6 max-w-none transition-all duration-700 ${isTransitioning ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
            <div className="flex items-center space-x-2 text-white/80">
              <MapPin size={16} className="flex-shrink-0" />
              <span className="text-xs sm:text-sm uppercase tracking-wider truncate">{current.location}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight break-words">
              {current.title}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed max-w-lg">
              {current.description}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button 
                onClick={handleExploreClick}
                className="bg-white text-gray-900 px-6 py-3 rounded-full font-semibold hover:bg-white/90 transition-all duration-300 transform hover:scale-105 text-center text-sm sm:text-base"
              >
                Explore Now
              </button>
              <button 
                onClick={handlePlayVideo}
                className="flex items-center justify-center space-x-3 text-white hover:text-white/80 transition-colors min-w-0"
              >
                <div className="w-10 h-10 sm:w-12 sm:h-12 border-2 border-white rounded-full flex items-center justify-center hover:bg-white/10 transition-all duration-300 flex-shrink-0">
                  <Play size={14} fill="white" />
                </div>
                <span className="font-medium text-sm sm:text-base truncate">Play the video</span>
              </button>
            </div>
          </div>

          {/* Right Content - Destination Cards - Hidden on mobile and tablet */}
          <div className="hidden xl:flex justify-end">
            <div className="relative max-w-sm">
              {/* Main Destination Card */}
              <div className={`w-72 h-80 rounded-2xl overflow-hidden bg-cover bg-center transition-all duration-700 ${isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}
                   style={{ backgroundImage: `url(${current.image})` }}>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin size={14} />
                    <span className="text-sm">{current.location.split(',')[0]}</span>
                  </div>
                  <h3 className="text-lg font-semibold">{current.location.split(',')[1]}</h3>
                </div>
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={prevDestination}
                className="absolute left-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextDestination}
                className="absolute right-[-20px] top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300"
              >
                <ChevronRight size={20} />
              </button>

              {/* Thumbnail Navigation */}
              <div className="absolute right-[-60px] top-1/2 transform -translate-y-1/2 flex flex-col space-y-3">
                {destinations.map((dest, index) => (
                  <button
                    key={dest.id}
                    onClick={() => goToDestination(index)}
                    className={`w-12 h-16 rounded-lg overflow-hidden transition-all duration-300 ${
                      index === currentDestination 
                        ? 'ring-2 ring-white scale-110' 
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.location}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(`Failed to load image: ${dest.image}`);
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Content */}
      <div className="absolute bottom-4 sm:bottom-8 left-4 sm:left-8 right-4 sm:right-8 z-10 overflow-hidden">
        <div className="w-full max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
            {/* Highlights */}
            {current.highlights.map((highlight, index) => (
              <div 
                key={highlight.label}
                className={`bg-white/10 backdrop-blur-md rounded-lg p-3 sm:p-4 text-white transition-all duration-700 min-w-0 ${
                  isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <h4 className="font-semibold mb-2 text-sm sm:text-base truncate">{highlight.label}</h4>
                <p className="text-xs sm:text-sm text-white/80 line-clamp-2">{highlight.description}</p>
              </div>
            ))}

            {/* Social Links */}
            <div className="hidden lg:flex items-center justify-end space-x-3">
              {[
                { name: 'ig', url: 'https://instagram.com/unplanneddiaries' },
                { name: 'fb', url: 'https://facebook.com/unplanneddiaries' },
                { name: 'tw', url: 'https://twitter.com/unplanneddiaries' },
                { name: 'in', url: 'https://linkedin.com/company/unplanneddiaries' }
              ].map((social) => (
                <a 
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white/70 hover:text-white hover:bg-white/20 transition-all duration-300 text-xs font-medium flex-shrink-0"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Destination Indicators */}
      <div className="absolute bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 z-10 flex space-x-2">
        {destinations.map((_, index) => (
          <button
            key={index}
            onClick={() => goToDestination(index)}
            className={`w-6 sm:w-8 h-1 rounded-full transition-all duration-300 ${
              index === currentDestination 
                ? 'bg-white' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
