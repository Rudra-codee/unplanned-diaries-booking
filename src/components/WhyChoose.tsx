
import { Award, Leaf, Heart, Globe } from "lucide-react";

const features = [
  {
    icon: Award,
    title: "Excellence",
    description: "We deliver exceptional travel experiences with meticulous attention to detail, ensuring every moment of your journey exceeds expectations."
  },
  {
    icon: Leaf,
    title: "Sustainable",
    description: "Committed to responsible tourism that preserves natural beauty and supports local communities for future generations."
  },
  {
    icon: Heart,
    title: "Passionate",
    description: "Our love for travel drives us to create meaningful connections between travelers and the extraordinary places they visit."
  },
  {
    icon: Globe,
    title: "Global",
    description: "With destinations spanning all continents, we bring the world closer to you through authentic and immersive experiences."
  }
];

const WhyChoose = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose <span className="text-emerald-500">Wanderlust</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over a decade, we've been crafting extraordinary travel experiences that transform the way you see the world. Our commitment goes beyond just booking trips—we create lifelong memories.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6 group-hover:bg-emerald-200 transition-colors">
                <feature.icon className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChoose;
