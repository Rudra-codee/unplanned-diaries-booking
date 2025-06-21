
import { useState, useEffect } from "react";

const stats = [
  { number: 150, suffix: "+", label: "Destinations" },
  { number: 50, suffix: "K+", label: "Happy Travelers" },
  { number: 4.9, suffix: "★", label: "Average Rating" },
  { number: 12, suffix: "", label: "Years Experience" }
];

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById("stats-section");
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats-section" className="py-20 bg-emerald-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-6xl font-bold text-emerald-600 mb-2">
                {isVisible ? (
                  <CountUp
                    end={stat.number}
                    duration={2}
                    suffix={stat.suffix}
                  />
                ) : (
                  `0${stat.suffix}`
                )}
              </div>
              <div className="text-lg font-medium text-gray-700">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const CountUp = ({ end, duration, suffix }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const increment = end / (duration * 60);
    const timer = setInterval(() => {
      setCount(prev => {
        if (prev >= end) {
          clearInterval(timer);
          return end;
        }
        return Math.min(prev + increment, end);
      });
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [end, duration]);

  return `${Math.floor(count)}${suffix}`;
};

export default StatsSection;
