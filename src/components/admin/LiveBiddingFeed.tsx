
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface Bid {
  id: string;
  bid_amount: number;
  user_name: string;
  user_email: string;
  created_at: string;
  secret_trip_id: string;
}

interface SecretTrip {
  id: string;
  title: string;
  end_date: string;
  max_guests: number;
  available_seats: number;
}

const LiveBiddingFeed = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [secretTrips, setSecretTrips] = useState<SecretTrip[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'highest' | 'lowest' | 'newest'>('highest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSecretTrips();
    fetchBids();

    // Set up real-time subscription for bids
    const bidsChannel = supabase
      .channel('admin-bids-feed')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bids'
      }, (payload) => {
        console.log('New bid received:', payload);
        
        if (payload.eventType === 'INSERT') {
          setBids(prev => [payload.new as Bid, ...prev]);
          // Show notification for new bid
          toast.success(`New bid placed: ₹${payload.new.bid_amount} by ${payload.new.user_name}`);
        } else if (payload.eventType === 'UPDATE') {
          setBids(prev => prev.map(bid => 
            bid.id === payload.new.id ? payload.new as Bid : bid
          ));
          toast.info(`Bid updated: ₹${payload.new.bid_amount} by ${payload.new.user_name}`);
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(bidsChannel);
    };
  }, []);

  const fetchSecretTrips = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_all_secret_trips');

      if (error) {
        console.error('Error fetching secret trips:', error);
        return;
      }

      setSecretTrips((data || []) as SecretTrip[]);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const fetchBids = async () => {
    try {
      const { data, error } = await supabase
        .rpc('get_all_bids');

      if (error) {
        console.error('Error fetching bids:', error);
        return;
      }

      setBids((data || []) as Bid[]);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedBids = () => {
    let filtered = bids;
    
    if (selectedTrip !== 'all') {
      filtered = bids.filter(bid => bid.secret_trip_id === selectedTrip);
    }

    return filtered.sort((a, b) => {
      switch (sortOrder) {
        case 'highest':
          return b.bid_amount - a.bid_amount;
        case 'lowest':
          return a.bid_amount - b.bid_amount;
        case 'newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Bidding Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">Loading...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Live Bidding Feed</CardTitle>
          <Badge variant="secondary">
            {filteredAndSortedBids().length} Total Bids
          </Badge>
        </div>
        
        <div className="flex gap-4 mt-4">
          <Select value={selectedTrip} onValueChange={setSelectedTrip}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by trip" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Trips</SelectItem>
              {secretTrips.map(trip => (
                <SelectItem key={trip.id} value={trip.id}>
                  {trip.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortOrder} onValueChange={(value: 'highest' | 'lowest' | 'newest') => setSortOrder(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="highest">Highest to Lowest</SelectItem>
              <SelectItem value="lowest">Lowest to Highest</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {filteredAndSortedBids().map((bid) => (
            <div key={bid.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
              <div>
                <div className="font-semibold">{bid.user_name}</div>
                <div className="text-sm text-gray-600">{bid.user_email}</div>
                <div className="text-xs text-gray-500">
                  {new Date(bid.created_at).toLocaleString()}
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  ₹{bid.bid_amount}
                </div>
                <Badge variant="outline" className="text-xs">
                  {secretTrips.find(trip => trip.id === bid.secret_trip_id)?.title || 'Unknown Trip'}
                </Badge>
              </div>
            </div>
          ))}
          
          {filteredAndSortedBids().length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No bids found for the selected criteria.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveBiddingFeed;
