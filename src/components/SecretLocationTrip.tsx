
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

interface SecretTrip {
  id: string;
  title: string;
  description: string;
  max_guests: number;
  available_seats: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface Bid {
  id: string;
  bid_amount: number;
  user_name: string;
  created_at: string;
}

const SecretLocationTrip = () => {
  const { user } = useAuth();
  const [secretTrip, setSecretTrip] = useState<SecretTrip | null>(null);
  const [bids, setBids] = useState<Bid[]>([]);
  const [bidAmount, setBidAmount] = useState('');
  const [timeLeft, setTimeLeft] = useState('');
  const [highestBid, setHighestBid] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecretTrip();
    
    // Set up real-time subscriptions
    const tripsChannel = supabase
      .channel('secret-trips-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'secret_trips'
      }, () => {
        fetchSecretTrip();
      })
      .subscribe();

    const bidsChannel = supabase
      .channel('bids-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bids'
      }, () => {
        if (secretTrip) {
          fetchBids(secretTrip.id);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(tripsChannel);
      supabase.removeChannel(bidsChannel);
    };
  }, []);

  useEffect(() => {
    if (secretTrip) {
      fetchBids(secretTrip.id);
      updateTimer();
      const timer = setInterval(updateTimer, 1000);
      return () => clearInterval(timer);
    }
  }, [secretTrip]);

  const fetchSecretTrip = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_active_secret_trip');

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching secret trip:', error);
        return;
      }

      if (data && data.length > 0) {
        setSecretTrip(data[0] as SecretTrip);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBids = async (tripId: string) => {
    try {
      const { data, error } = await supabase
        .rpc('get_trip_bids', { trip_id: tripId });

      if (error) {
        console.error('Error fetching bids:', error);
        return;
      }

      setBids((data || []) as Bid[]);
      setHighestBid(data && data.length > 0 ? data[0].bid_amount : 0);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const updateTimer = () => {
    if (!secretTrip) return;
    
    const now = new Date().getTime();
    const endTime = new Date(secretTrip.end_date).getTime();
    const distance = endTime - now;

    if (distance > 0) {
      const hours = Math.floor(distance / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`);
    } else {
      setTimeLeft('00:00');
    }
  };

  const handlePlaceBid = async () => {
    if (!user) {
      toast.error('Please sign in to place a bid');
      return;
    }

    if (!bidAmount || isNaN(Number(bidAmount))) {
      toast.error('Please enter a valid bid amount');
      return;
    }

    const amount = Number(bidAmount);
    if (amount <= highestBid) {
      toast.error(`Bid must be higher than current highest bid of ₹${highestBid}`);
      return;
    }

    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', user.id)
        .single();

      const { error } = await supabase
        .rpc('place_bid', {
          trip_id: secretTrip!.id,
          user_id: user.id,
          bid_amount: amount,
          user_name: profile?.full_name || 'Anonymous',
          user_email: profile?.email || user.email || ''
        });

      if (error) {
        toast.error('Failed to place bid');
        return;
      }

      toast.success('Bid placed successfully!');
      setBidAmount('');
    } catch (error) {
      console.error('Error placing bid:', error);
      toast.error('An error occurred while placing bid');
    }
  };

  if (loading) {
    return (
      <div className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <div className="animate-pulse">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!secretTrip) {
    return null;
  }

  const seatsLeft = secretTrip.available_seats;
  const seatsProgress = ((secretTrip.max_guests - seatsLeft) / secretTrip.max_guests) * 100;

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-900 via-emerald-800 to-emerald-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block bg-yellow-500 text-black px-6 py-2 rounded-full font-semibold mb-6">
            👑 Mystery Adventure
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Secret Location Trip</h2>
          <p className="text-lg text-emerald-100 max-w-3xl mx-auto">
            Location unknown, fun guaranteed! Join our exclusive mystery adventure where the destination is a surprise until you arrive.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Bidding */}
          <div className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-700/30">
            <h3 className="text-2xl font-bold mb-6 text-center">Live Bidding</h3>
            
            {/* Timer */}
            <div className="bg-red-500 text-white px-4 py-2 rounded-full text-center font-bold mb-6 inline-block">
              ⏰ {timeLeft}
            </div>

            {/* Trip Details */}
            <div className="mb-6">
              <p className="text-yellow-400 font-semibold text-lg">Next Trip: 2nd Friday</p>
              <p className="text-emerald-200">Every 2nd & 4th Friday</p>
            </div>

            {/* Available Seats */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Available Seats</span>
                <span className="text-orange-400 font-bold">{seatsLeft}/{secretTrip.max_guests} left</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-orange-500 to-red-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${seatsProgress}%` }}
                ></div>
              </div>
            </div>

            {/* Bid Input */}
            <div className="mb-6">
              <label className="block font-semibold mb-3">Your Bid Amount</label>
              <Input
                type="number"
                value={bidAmount}
                onChange={(e) => setBidAmount(e.target.value)}
                placeholder="Enter your bid"
                className="bg-emerald-700/30 border-emerald-600 text-white placeholder:text-emerald-300 mb-2"
              />
              <p className="text-sm text-emerald-300">Current highest bid: ₹{highestBid}</p>
            </div>

            {/* Place Bid Button */}
            <Button
              onClick={handlePlaceBid}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-3 rounded-full text-lg mb-6"
            >
              ⚡ Place Bid
            </Button>

            {/* Last 3 Bids */}
            <div>
              <p className="font-semibold mb-3">Last 3 bids:</p>
              <div className="space-y-2">
                {bids.slice(0, 3).map((bid, index) => (
                  <div key={bid.id} className="flex justify-between items-center">
                    <span className="text-emerald-300">
                      {bid.user_name.replace(/(?<=.{4})./g, '*')}
                    </span>
                    <span className="text-yellow-400 font-bold">₹{bid.bid_amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - What We Can Tell You */}
          <div className="space-y-6">
            <div className="bg-emerald-800/30 backdrop-blur-sm rounded-2xl p-8 border border-emerald-700/30">
              <h3 className="text-2xl font-bold mb-6">What We Can Tell You...</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span>Breathtaking natural scenery</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                  <span>Instagram-worthy photo spots</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-orange-400 rounded-full"></div>
                  <span>Local cuisine experience</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                  <span>8-hour adventure</span>
                </div>
              </div>
            </div>

            {/* Mystery Images */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-600/50 rounded-xl h-32 flex items-center justify-center">
                <span className="text-6xl">?</span>
              </div>
              <div className="bg-gray-800/50 rounded-xl h-32 flex items-center justify-center">
                <span className="text-6xl">?</span>
              </div>
            </div>

            {/* Guarantee */}
            <div className="bg-green-600/20 border border-green-500/30 rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-2">
                <span className="text-2xl">💯</span>
                <span className="font-bold text-lg">Guarantee</span>
              </div>
              <p className="text-green-200">100% satisfaction. Location revealed 24 hours before departure.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SecretLocationTrip;
