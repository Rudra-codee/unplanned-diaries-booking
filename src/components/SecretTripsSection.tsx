
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Crown, Clock, Users, MapPin } from 'lucide-react';

const SecretTripsSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-900 via-indigo-900 to-purple-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="h-8 w-8 text-yellow-400 mr-3" />
            <h2 className="text-4xl md:text-5xl font-bold text-white">Secret Trips</h2>
            <Crown className="h-8 w-8 text-yellow-400 ml-3" />
          </div>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto mb-8">
            Exclusive mystery adventures where the destination remains a secret until departure. 
            Premium experiences for those seeking the ultimate surprise journey.
          </p>
          
          {/* Coming Soon Badge */}
          <div className="inline-flex items-center bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-8 py-4 rounded-full text-xl font-bold shadow-lg">
            <Clock className="h-6 w-6 mr-2" />
            Coming Soon
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <MapPin className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Mystery Destinations</h3>
            <p className="text-purple-200">
              Carefully curated secret locations revealed only 24 hours before departure
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <Users className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Exclusive Groups</h3>
            <p className="text-purple-200">
              Limited to small groups for an intimate and personalized experience
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/30">
            <Crown className="h-8 w-8 text-yellow-400 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Premium Experience</h3>
            <p className="text-purple-200">
              All-inclusive luxury adventures with surprise activities and amenities
            </p>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <p className="text-purple-200 mb-6 text-lg">
            Be the first to know when our secret trips launch
          </p>
          <Button 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-full text-lg"
            disabled
          >
            Notify Me When Available
          </Button>
          <p className="text-sm text-purple-300 mt-4">
            Secret trips will feature live bidding and limited availability
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecretTripsSection;
