// src/pages/TransportPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { SearchContext } from '../patterns/strategy/SearchContext';
import { PriceStrategy } from '../patterns/strategy/PriceStrategy';
import { NameStrategy } from '../patterns/strategy/NameStrategy';
import { BookingContext } from '../patterns/state/BookingContext';
import { PendingState } from '../patterns/state/PendingState';
import { Transport } from '../entities/Transport';
import { Booking } from '../entities/Booking';
import { Bus, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const TransportPage: React.FC = () => {
  const { user } = useAuth();
  const { controller, transportService } = useServices();
  const [transports, setTransports] = useState<Transport[]>([]);
  const [filteredTransports, setFilteredTransports] = useState<Transport[]>([]);
  const [myBookings, setMyBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);
  const [searchStrategy, setSearchStrategy] = useState<'price' | 'name'>('price');
  const [searchCriteria, setSearchCriteria] = useState('');
  const [showBookings, setShowBookings] = useState(false);
  const [selectedTransport, setSelectedTransport] = useState<Transport | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const searchContext = new SearchContext();

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = () => {
    setLoading(true);
    try {
      const allTransport = transportService.getAvailableTransport();
      setTransports(allTransport);
      setFilteredTransports(allTransport);

      if (user) {
        const bookings = transportService.getStudentBookings(user.userId);
        setMyBookings(bookings);
      }
    } catch (error) {
      toast.error('Failed to load transport data');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchCriteria) {
      setFilteredTransports(transports);
      return;
    }

    console.log(`🔍 Transport Search: Using ${searchStrategy} strategy`);

    if (searchStrategy === 'price') {
      searchContext.setStrategy(new PriceStrategy());
    } else {
      searchContext.setStrategy(new NameStrategy());
    }

    const results = searchContext.executeSearch(searchCriteria, transports);
    setFilteredTransports(results);
    toast.success(`Found ${results.length} transport options`);
  };

  const handleBookTransport = (transport: Transport) => {
    if (!user) {
      toast.error('Please login to book transport');
      return;
    }

    if (transport.seatsAvailable <= 0) {
      toast.error('No seats available on this transport');
      return;
    }

    setSelectedTransport(transport);
    setShowBookingModal(true);
  };

  const confirmBooking = async () => {
    if (!selectedTransport || !user) return;

    setBookingLoading(selectedTransport.transportID);
    setShowBookingModal(false);

    try {
      // Create booking context with State Pattern
      const bookingContext = new BookingContext(new PendingState());
      console.log(`📋 Booking State: ${bookingContext.printStatus()}`);

      // Controller delegates to service
      await controller.handleTransportRequest(user.userId, selectedTransport.transportID);

      // Transition to confirmed state
      bookingContext.requestNext();
      console.log(`📋 Booking State Updated: ${bookingContext.printStatus()}`);

      toast.success(
        `Successfully booked ${selectedTransport.type}! 
        Status: ${bookingContext.printStatus()}`
      );

      loadData(); // Refresh data
    } catch (error) {
      toast.error((error as Error).message || 'Booking failed');
    } finally {
      setBookingLoading(null);
      setSelectedTransport(null);
    }
  };

  const handleCancelBooking = async (bookingID: string, transportType: string) => {
    if (!user) return;

    if (!window.confirm(`Are you sure you want to cancel ${transportType} booking?`)) {
      return;
    }

    try {
      transportService.cancelBooking(user.userId, bookingID);
      toast.success('Booking cancelled successfully');
      loadData();
    } catch (error) {
      toast.error((error as Error).message || 'Cancellation failed');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'default'> = {
      PENDING: 'warning',
      CONFIRMED: 'success',
      CANCELLED: 'danger',
    };
    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Transport Services</h1>
        <p className="text-gray-600">Book reliable transportation for your daily commute</p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <Button
          variant={!showBookings ? 'primary' : 'outline'}
          onClick={() => setShowBookings(false)}
        >
          Available Transport
        </Button>
        <Button
          variant={showBookings ? 'primary' : 'outline'}
          onClick={() => setShowBookings(true)}
        >
          My Bookings ({myBookings.length})
        </Button>
      </div>

      {!showBookings ? (
        <>
          {/* Search Section */}
          <Card className="mb-8 animate-slide-up">
            <h2 className="text-xl font-semibold mb-4">Search Transport</h2>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="label">Search By:</label>
                <select
                  className="input"
                  value={searchStrategy}
                  onChange={(e) => setSearchStrategy(e.target.value as 'price' | 'name')}
                >
                  <option value="price">Price Range</option>
                  <option value="name">Transport Type</option>
                </select>
              </div>

              <div className="flex-1">
                <label className="label">
                  {searchStrategy === 'price' ? 'Price Range (e.g., 3-10)' : 'Type (e.g., Bus)'}
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder={searchStrategy === 'price' ? '3-10' : 'Bus'}
                  value={searchCriteria}
                  onChange={(e) => setSearchCriteria(e.target.value)}
                />
              </div>

              <div className="flex items-end gap-2">
                <Button onClick={handleSearch}>Search</Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchCriteria('');
                    setFilteredTransports(transports);
                  }}
                >
                  Reset
                </Button>
              </div>
            </div>
          </Card>

          {/* Transport Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTransports.map((transport, idx) => (
              <Card
                key={transport.transportID}
                className="flex flex-col animate-slide-up"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {/* Icon */}
                <div className="bg-gradient-to-br from-green-400 to-green-600 h-32 rounded-t-lg -m-6 mb-4 flex items-center justify-center">
                  <Bus size={64} className="text-white" />
                </div>

                {/* Details */}
                <h3 className="text-xl font-bold text-gray-800 mb-2">{transport.type}</h3>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-gray-600">
                    <Clock size={16} className="mr-2" />
                    <span className="text-sm">{transport.schedule}</span>
                  </div>

                  {transport.route && (
                    <div className="flex items-center text-gray-600">
                      <MapPin size={16} className="mr-2" />
                      <span className="text-sm">{transport.route}</span>
                    </div>
                  )}

                  <div className="flex items-center text-gray-600">
                    <Users size={16} className="mr-2" />
                    <span className="text-sm font-medium">
                      {transport.seatsAvailable > 0 ? (
                        <span className="text-green-600">{transport.seatsAvailable} seats available</span>
                      ) : (
                        <span className="text-red-600">Fully booked</span>
                      )}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-green-600">
                    ${transport.pricePerSeat}
                  </span>
                  <span className="text-sm text-gray-600">per seat</span>
                </div>

                <Button
                  onClick={() => handleBookTransport(transport)}
                  className="w-full"
                  disabled={transport.seatsAvailable <= 0 || bookingLoading !== null}
                  isLoading={bookingLoading === transport.transportID}
                >
                  {transport.seatsAvailable > 0 ? 'Book Seat' : 'Fully Booked'}
                </Button>
              </Card>
            ))}
          </div>
        </>
      ) : (
        /* My Bookings Section */
        <div className="space-y-4">
          {myBookings.length === 0 ? (
            <Card className="text-center py-12">
              <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600 text-lg">No transport bookings yet</p>
              <Button
                className="mt-4"
                onClick={() => setShowBookings(false)}
              >
                Book Transport
              </Button>
            </Card>
          ) : (
            myBookings.map((booking, idx) => {
              const transport = transports.find(t => t.transportID === booking.resourceID);
              return (
                <Card
                  key={booking.bookingID}
                  className="animate-slide-up"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Bus className="text-green-600" size={24} />
                        <h3 className="text-xl font-bold">{transport?.type || 'Transport'}</h3>
                        {getStatusBadge(booking.status)}
                      </div>

                      <div className="space-y-1 text-sm text-gray-600 ml-9">
                        {transport?.schedule && (
                          <p>📅 Schedule: {transport.schedule}</p>
                        )}
                        {transport?.route && (
                          <p>🗺️ Route: {transport.route}</p>
                        )}
                        <p>💰 Amount: ${booking.totalAmount}</p>
                        <p>📆 Booked: {new Date(booking.bookingDate).toLocaleDateString()}</p>
                      </div>
                    </div>

                    {booking.status !== 'CANCELLED' && (
                      <div className="mt-4 md:mt-0">
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleCancelBooking(booking.bookingID, transport?.type || 'transport')}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}

      {/* Booking Confirmation Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedTransport(null);
        }}
        title="Confirm Transport Booking"
      >
        {selectedTransport && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">{selectedTransport.type}</h4>
              <div className="space-y-1 text-sm text-gray-600">
                <p>📅 {selectedTransport.schedule}</p>
                {selectedTransport.route && <p>🗺️ {selectedTransport.route}</p>}
                <p>💺 {selectedTransport.seatsAvailable} seats available</p>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total Amount:</span>
                <span className="text-green-600">${selectedTransport.pricePerSeat}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={confirmBooking}
                className="flex-1"
              >
                Confirm Booking
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowBookingModal(false);
                  setSelectedTransport(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};
