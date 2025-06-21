
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

const packages = [
  {
    id: 1,
    name: "Swiss Alpine Adventure",
    location: "Switzerland",
    duration: "7 days",
    price: "$2499",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Mountain",
    description: "Experience the breathtaking beauty of Swiss Alps with guided hiking and luxury accommodations."
  },
  {
    id: 2,
    name: "Tropical Paradise Escape",
    location: "Maldives",
    duration: "5 days",
    price: "$3299",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Beach",
    description: "Relax in overwater bungalows and explore crystal-clear waters in this tropical paradise."
  },
  {
    id: 3,
    name: "Northern Lights Quest",
    location: "Iceland",
    duration: "6 days",
    price: "$1899",
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Adventure",
    description: "Chase the aurora borealis while exploring glaciers, geysers, and volcanic landscapes."
  },
  {
    id: 4,
    name: "African Safari Experience",
    location: "Kenya",
    duration: "8 days",
    price: "$2799",
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1472396961693-142e6e269027?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Wildlife",
    description: "Witness the great migration and encounter the Big Five in their natural habitat."
  },
  {
    id: 5,
    name: "Forest Retreat",
    location: "Canada",
    duration: "4 days",
    price: "$1599",
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Nature",
    description: "Disconnect from the world in pristine wilderness with hiking, canoeing, and wildlife spotting."
  },
  {
    id: 6,
    name: "Mediterranean Cruise",
    location: "Greece",
    duration: "10 days",
    price: "$2199",
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1458668383970-8ddd3927deed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
    category: "Cruise",
    description: "Sail through ancient history while enjoying modern luxury on this Mediterranean journey."
  }
];

const categories = ["All", "Mountain", "Beach", "Adventure", "Wildlife", "Nature", "Cruise"];

const TourPackages = ({ onTripClick }) => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredPackages = activeCategory === "All" 
    ? packages 
    : packages.filter(pkg => pkg.category === activeCategory);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Amazing <span className="text-emerald-500">Tour Packages</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Carefully curated experiences that blend adventure, comfort, and unforgettable memories.
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full ${
                  activeCategory === category
                    ? "bg-emerald-500 hover:bg-emerald-600 text-white"
                    : "text-gray-700 border-gray-300 hover:border-emerald-500 hover:text-emerald-600"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => onTripClick(pkg)}
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={pkg.image}
                  alt={pkg.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {pkg.category}
                  </span>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 px-2 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-semibold">{pkg.rating}</span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name}</h3>
                <p className="text-gray-600 mb-2">{pkg.location}</p>
                <p className="text-gray-600 mb-4">{pkg.duration}</p>
                <p className="text-gray-700 mb-4 text-sm">{pkg.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-emerald-500">{pkg.price}</div>
                  <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full">
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TourPackages;
