
import { useState } from "react";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-gray-900">Unplanned Diaries</h1>
          </div>
          
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <a href="#" className="text-gray-900 hover:text-emerald-600 transition-colors">Home</a>
              <a href="#" className="text-gray-900 hover:text-emerald-600 transition-colors">Destinations</a>
              <a href="#" className="text-gray-900 hover:text-emerald-600 transition-colors">Services</a>
              <a href="#" className="text-gray-900 hover:text-emerald-600 transition-colors">Tour Packages</a>
              <a href="#" className="text-gray-900 hover:text-emerald-600 transition-colors">Contact</a>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-full">
              Sign In
            </Button>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-900 hover:text-emerald-600"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <a href="#" className="block px-3 py-2 text-gray-900 hover:text-emerald-600">Home</a>
            <a href="#" className="block px-3 py-2 text-gray-900 hover:text-emerald-600">Destinations</a>
            <a href="#" className="block px-3 py-2 text-gray-900 hover:text-emerald-600">Services</a>
            <a href="#" className="block px-3 py-2 text-gray-900 hover:text-emerald-600">Tour Packages</a>
            <a href="#" className="block px-3 py-2 text-gray-900 hover:text-emerald-600">Contact</a>
            <div className="px-3 py-2">
              <Button className="bg-emerald-500 hover:bg-emerald-600 text-white w-full">Sign In</Button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
