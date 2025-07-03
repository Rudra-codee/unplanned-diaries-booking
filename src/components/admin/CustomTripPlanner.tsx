
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, Clock, CheckCircle, XCircle, Users, Calendar, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface CustomTripRequest {
  id: string;
  location: string;
  start_date: string;
  end_date: string;
  number_of_guests: number;
  contact_number: string;
  contact_email: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function CustomTripPlanner() {
  const [requests, setRequests] = useState<CustomTripRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomTripRequests();
  }, []);

  const fetchCustomTripRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('custom_trip_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      console.error('Error fetching custom trip requests:', error);
      toast.error('Failed to load custom trip requests');
    } finally {
      setLoading(false);
    }
  };

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('custom_trip_requests')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) throw error;

      setRequests(prev => prev.map(req => 
        req.id === id ? { ...req, status } : req
      ));
      
      toast.success(`Request ${status} successfully`);
    } catch (error) {
      console.error('Error updating request status:', error);
      toast.error('Failed to update request status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'approved': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading custom trip requests...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Custom Trip Requests</h2>
          <p className="text-muted-foreground">Manage and respond to custom trip requests</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {requests.map((request) => (
          <Card key={request.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {request.location}
                  </CardTitle>
                  <CardDescription>
                    Requested on {new Date(request.created_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                <Badge className={getStatusColor(request.status)}>
                  <span className="flex items-center gap-1">
                    {getStatusIcon(request.status)}
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{request.number_of_guests} guests</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Contact:</span>
                  <span>{request.contact_number}</span>
                </div>
              </div>
              
              {request.contact_email && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Email: </span>
                  <span>{request.contact_email}</span>
                </div>
              )}

              {request.status === 'pending' && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    size="sm" 
                    onClick={() => updateRequestStatus(request.id, 'approved')}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Approve
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive"
                    onClick={() => updateRequestStatus(request.id, 'rejected')}
                  >
                    <XCircle className="h-4 w-4 mr-1" />
                    Reject
                  </Button>
                </div>
              )}

              {request.status === 'approved' && (
                <div className="flex gap-3 pt-4">
                  <Button 
                    size="sm" 
                    onClick={() => updateRequestStatus(request.id, 'completed')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Mark Completed
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {requests.length === 0 && (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No custom trip requests found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
