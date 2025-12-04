import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Bus, Clock, DollarSign, Users } from 'lucide-react';
import { toast } from 'sonner';

export const TransportPage: React.FC = () => {
  const { user } = useAuth();
  const { transportService } = useServices();
  const [transports, setTransports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userBookings, setUserBookings] = useState<string[]>([]);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    loadTransport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTransport = () => {
    setLoading(true);
    try {
      const data = transportService.getAvailableTransport();
      setTransports(Array.isArray(data) ? data : []);
      
      if (user) {
        const bookings = transportService.getStudentBookings(user.userId);
        setUserBookings(bookings.map((b: any) => b.resourceID));
      }
    } catch (error) {
      toast.error('Failed to load transport');
      setTransports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookTransport = async (transportId: string) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setBookingLoading(transportId);
    try {
      await transportService.bookTransport(user.userId, transportId);
      toast.success('✅ Transport booked successfully!');
      loadTransport();
    } catch (error) {
      toast.error('Failed to book transport');
    } finally {
      setBookingLoading(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <Bus className="text-green-600" size={36} />
          Transportation
        </h1>
        <p className="text-gray-600 mt-2">Book reliable transportation services</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading transportation options...</div>
      ) : transports.length === 0 ? (
        <Card className="bg-gray-50 p-8 text-center">
          <p className="text-gray-600 text-lg">No transportation available</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transports.map((transport: any) => {
            const isBooked = userBookings.includes(transport.transportID);
            return (
              <Card key={transport.transportID} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Bus className="text-green-600" size={24} />
                    <h3 className="text-2xl font-bold">{transport.type}</h3>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    transport.seatsAvailable > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {transport.seatsAvailable} seats
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{transport.schedule}</p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock size={18} />
                    <span>Schedule: {transport.schedule}</span>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 font-semibold">
                    <DollarSign size={18} />
                    <span>${transport.pricePerSeat || 5.00}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Users size={18} />
                    <span>{transport.seatsAvailable} seats available</span>
                  </div>
                </div>
                <Button
                  className="w-full"
                  variant={isBooked ? 'outline' : 'primary'}
                  onClick={() => handleBookTransport(transport.transportID)}
                  disabled={bookingLoading === transport.transportID || transport.seatsAvailable === 0}
                >
                  {bookingLoading === transport.transportID ? 'Booking...' : isBooked ? 'Booked' : 'Book Transport'}
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransportPage;
