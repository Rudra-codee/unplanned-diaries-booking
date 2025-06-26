
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, MapPin, Calendar, Users } from "lucide-react";
import { toast } from "sonner";

interface TripQuery {
  id: string;
  email: string;
  destination: string;
  check_in: string;
  check_out: string;
  guests: string;
  created_at: string;
}

const TripQueries = () => {
  const [queries, setQueries] = useState<TripQuery[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQueries = async () => {
    try {
      const { data, error } = await supabase
        .from('queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching queries:', error);
        toast.error("Failed to load trip queries");
      } else {
        setQueries(data || []);
      }
    } catch (error) {
      console.error('Error fetching queries:', error);
      toast.error("Failed to load trip queries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueries();

    // Set up real-time subscription
    const channel = supabase
      .channel('queries-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'queries'
        },
        (payload) => {
          console.log('New trip query received:', payload);
          setQueries(prev => [payload.new as TripQuery, ...prev]);
          toast.success("New trip query received!");
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getDestinationName = (destination: string) => {
    const destinations: { [key: string]: string } = {
      'bali': 'Bali, Indonesia',
      'switzerland': 'Swiss Alps',
      'maldives': 'Maldives',
      'iceland': 'Iceland',
      'kenya': 'Kenya',
      'canada': 'Canada'
    };
    return destinations[destination] || destination;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Trip Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Trip Queries ({queries.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {queries.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No trip queries yet. When customers submit trip requests, they'll appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Customer</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Travel Dates</TableHead>
                  <TableHead>Guests</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {queries.map((query) => (
                  <TableRow key={query.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{query.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span>{getDestinationName(query.destination)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">
                          {formatDate(query.check_in)} - {formatDate(query.check_out)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-purple-500" />
                        <Badge variant="secondary">{query.guests}</Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">
                        {formatDate(query.created_at)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TripQueries;
