
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Left Column - Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Unplanned Diaries</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">
              We're not just a travel company - we're life transformers! Specializing in unplanned adventures that create unforgettable stories and change perspectives through authentic travel experiences.
            </p>
            <div className="space-y-4">
              <div className="flex items-center">
                <MapPin className="w-5 h-5 mr-3 text-emerald-400" />
                <span className="text-gray-300">Adventure Hub, New Delhi, India</span>
              </div>
              <div className="flex items-center">
                <Phone className="w-5 h-5 mr-3 text-emerald-400" />
                <span className="text-gray-300">+91 98765 43210</span>
              </div>
              <div className="flex items-center">
                <Mail className="w-5 h-5 mr-3 text-emerald-400" />
                <span className="text-gray-300">hello@unplanneddiaries.com</span>
              </div>
            </div>
          </div>
          
          {/* Middle Column - Adventures */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Adventures</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Himalayan Expeditions</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Tropical Escapes</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Cultural Journeys</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Adventure Tours</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Wellness Retreats</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Solo Traveler Specials</a></li>
            </ul>
          </div>
          
          {/* Right Column - Support */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Travel Consultation</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Emergency Support</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Travel Insurance</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Booking Support</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Travel Community</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Travel Resources</a></li>
            </ul>
          </div>
        </div>
        
        {/* Newsletter Section */}
        <div className="border-t border-gray-800 pt-12">
          <div className="text-center mb-8">
            <h4 className="text-3xl font-bold mb-4">Join the Adventure</h4>
            <p className="text-gray-400 mb-8 text-lg">
              Subscribe for exclusive travel stories, unplanned adventure tips, and special offers that transform lives!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400 px-6 py-3 rounded-lg"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-lg">
                Subscribe
              </Button>
            </div>
          </div>
          
          {/* Bottom Section */}
          <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-gray-800">
            <p className="text-gray-400 text-sm mb-4 sm:mb-0">
              © 2024 Unplanned Diaries. Transforming lives through travel. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">FB</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">IG</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">TW</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors font-medium">IN</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
