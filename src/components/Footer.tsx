
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-6">Unplanned Diaries</h3>
            <p className="text-gray-400 mb-6">
              We're not just a travel company - we're life transformers! Specializing in unplanned adventures that create unforgettable stories and change perspectives through authentic travel experiences.
            </p>
            <div className="space-y-3">
              <div className="flex items-center text-emerald-400">
                <MapPin className="w-5 h-5 mr-3" />
                <span>Adventure Hub, New Delhi, India</span>
              </div>
              <div className="flex items-center text-emerald-400">
                <Phone className="w-5 h-5 mr-3" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center text-emerald-400">
                <Mail className="w-5 h-5 mr-3" />
                <span>hello@unplanneddiaries.com</span>
              </div>
            </div>
          </div>
          
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
          
          <div>
            <h4 className="text-lg font-semibold mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Custom Itineraries</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Group Adventures</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Solo Travel Planning</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Photography Tours</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Backpacking Guides</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">Local Experiences</a></li>
            </ul>
          </div>
          
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
        
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold mb-4">Join the Adventure</h4>
            <p className="text-gray-400 mb-6">
              Subscribe for exclusive travel stories, unplanned adventure tips, and special offers that transform lives!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="flex-1 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8">
                Subscribe
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 Unplanned Diaries. Transforming lives through travel. All rights reserved.
            </p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">FB</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">IG</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">TW</a>
              <a href="#" className="text-gray-400 hover:text-emerald-400 transition-colors">IN</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
