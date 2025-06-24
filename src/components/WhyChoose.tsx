
import { Heart, Users, Zap, Shield } from "lucide-react";

const features = [
  {
    icon: Heart,
    title: "Curated With Love",
    description: "Every trip is handcrafted to deliver the perfect blend of adventure, comfort, and spontaneity—with a strong focus on local culture and real connections."
  },
  {
    icon: Users,
    title: "Community Driven",
    description: "We filter like-minded travelers to build groups that feel like long-lost friends—because good company makes great journeys."
  },
  {
    icon: Zap,
    title: "Zero Hassle, All Vibes",
    description: "From bookings to bonfires, we've got everything covered—so you can just show up and vibe."
  },
  {
    icon: Shield,
    title: "Solo-Friendly & Safe",
    description: "Whether you're traveling solo or in a group, our friendly trip captains and verified stays ensure a safe, fun, and welcoming environment."
  }
];

const WhyChoose = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Why Choose
          </h2>
          <h2 className="text-5xl font-bold text-emerald-500 mb-6">
            UnPlanned Dairies
          </h2>
          <p className="text-lg text-gray-600 max-w-4xl mx-auto">
            For over 3 years, we've been redefining travel with unforgettable experiences that go beyond typical itineraries. At Unplanned Diaries, it's not just a trip—it's a vibe. We bring together wanderers, storytellers, and adventurers to create memories that last a lifetime.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-2xl mb-6 group-hover:bg-emerald-200 transition-colors">
                <feature.icon className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
