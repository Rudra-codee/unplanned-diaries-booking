
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Send, Users, Trash2, Loader2 } from 'lucide-react';

interface Subscriber {
  id: string;
  email: string;
  created_at: string;
}

interface Broadcast {
  id: string;
  message: string;
  created_at: string;
}

const SubscriberManagement = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [loading, setLoading] = useState(true);
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch subscribers
      const { data: subscribersData, error: subscribersError } = await supabase
        .from('subscribers')
        .select('*')
        .order('created_at', { ascending: false });

      if (subscribersError) {
        console.error('Error fetching subscribers:', subscribersError);
        toast.error('Failed to load subscribers');
      } else {
        setSubscribers(subscribersData || []);
      }

      // Fetch broadcasts
      const { data: broadcastsData, error: broadcastsError } = await supabase
        .from('broadcasts')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (broadcastsError) {
        console.error('Error fetching broadcasts:', broadcastsError);
        toast.error('Failed to load broadcasts');
      } else {
        setBroadcasts(broadcastsData || []);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while loading data');
    } finally {
      setLoading(false);
    }
  };

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!broadcastMessage.trim()) {
      toast.error('Please enter a message');
      return;
    }

    setIsSending(true);
    try {
      const { error } = await supabase
        .from('broadcasts')
        .insert([{ message: broadcastMessage }]);

      if (error) {
        console.error('Error sending broadcast:', error);
        toast.error('Failed to send broadcast');
        return;
      }

      toast.success('Broadcast sent successfully!');
      setBroadcastMessage('');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while sending broadcast');
    } finally {
      setIsSending(false);
    }
  };

  const handleDeleteSubscriber = async (subscriberId: string) => {
    if (!confirm('Are you sure you want to remove this subscriber?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('subscribers')
        .delete()
        .eq('id', subscriberId);

      if (error) {
        console.error('Error deleting subscriber:', error);
        toast.error('Failed to remove subscriber');
        return;
      }

      toast.success('Subscriber removed successfully');
      fetchData(); // Refresh data
    } catch (error) {
      console.error('Error:', error);
      toast.error('An error occurred while removing subscriber');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Secret Trip Subscribers ({subscribers.length})
          </CardTitle>
          <CardDescription>
            Manage users who subscribed for secret trip notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {subscribers.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No subscribers yet</p>
            ) : (
              subscribers.map((subscriber) => (
                <div key={subscriber.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{subscriber.email}</p>
                    <p className="text-sm text-gray-500">
                      Subscribed: {new Date(subscriber.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteSubscriber(subscriber.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Send Broadcast */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Send className="h-5 w-5" />
              Send Notification
            </CardTitle>
            <CardDescription>
              Send updates to all secret trip subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <Textarea
                placeholder="Enter your message to subscribers..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                rows={4}
                required
              />
              <Button type="submit" disabled={isSending} className="w-full">
                {isSending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send to {subscribers.length} Subscriber{subscribers.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Recent Broadcasts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Broadcasts</CardTitle>
            <CardDescription>
              Latest messages sent to subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {broadcasts.length === 0 ? (
                <p className="text-center text-gray-500 py-4">No broadcasts sent yet</p>
              ) : (
                broadcasts.map((broadcast) => (
                  <div key={broadcast.id} className="p-3 border rounded-lg">
                    <p className="text-sm">{broadcast.message}</p>
                    <p className="text-xs text-gray-500 mt-2">
                      Sent: {new Date(broadcast.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriberManagement;
