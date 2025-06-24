
import { Star } from "lucide-react";

const stats = [
  { number: "150+", label: "Trips Hosted" },
  { number: "1000+", label: "Happy Travelers" },
  { number: "4.8", label: "Google Rating", icon: Star },
  { number: "2+", label: "Years Experience" }
];

const StatsSection = () => {
  return (
    <section className="py-16 relative">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80)' 
        }}
      />
      <div className="absolute inset-0 bg-black/40" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Stats Container */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <span className="text-4xl md:text-5xl font-bold text-emerald-500">
                    {stat.number}
                  </span>
                  {stat.icon && (
                    <stat.icon className="w-8 h-8 text-emerald-500 ml-2 fill-current" />
                  )}
                </div>
                <p className="text-gray-700 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Section */}
        <div className="bg-gray-900/90 backdrop-blur-sm rounded-3xl p-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Our Mission</h2>
          <p className="text-white/90 text-lg leading-relaxed max-w-5xl mx-auto">
            "To make travel feel personal, spontaneous, and unforgettable—by building a community that thrives on good vibes, great stories, and once-in-a-lifetime adventures. Whether it's the mountains or the music, we make sure your journey feels just right."
          </p>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
