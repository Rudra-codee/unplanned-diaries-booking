
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Crown, Clock, Users, MapPin } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const SecretTripsSection = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSubscribing(true);
    try {
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email }]);

      if (error) {
        if (error.code === '23505') { // Unique constraint violation
          toast.error('You are already subscribed!');
        } else {
          toast.error('Failed to subscribe. Please try again.');
        }
        return;
      }

      toast.success('Successfully subscribed! You\'ll be notified when secret trips launch.');
      setEmail('');
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubscribing(false);
    }
  };

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
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-4">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-white/10 border-purple-500/30 text-white placeholder-purple-300 px-6 py-3 rounded-lg"
              required
            />
            <Button 
              type="submit"
              disabled={isSubscribing}
              className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-lg text-lg"
            >
              {isSubscribing ? 'Subscribing...' : 'Notify Me'}
            </Button>
          </form>
          <p className="text-sm text-purple-300">
            Secret trips will feature live bidding and limited availability
          </p>
        </div>
      </div>
    </section>
  );
};

export default SecretTripsSection;
