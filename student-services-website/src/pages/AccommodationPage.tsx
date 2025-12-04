import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { SearchContext } from '../patterns/strategy/SearchContext';
import { PriceStrategy } from '../patterns/strategy/PriceStrategy';
import { LocationStrategy } from '../patterns/strategy/LocationStrategy';
import { Accommodation } from '../entities/Accommodation';
import { MapPin, Users, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const AccommodationPage: React.FC = () => {
  const { user } = useAuth();
  const { controller, accommodationService } = useServices();
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [filteredAccommodations, setFilteredAccommodations] = useState<Accommodation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchStrategy, setSearchStrategy] = useState<'price' | 'location'>('price');
  const [searchCriteria, setSearchCriteria] = useState('');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  const searchContext = new SearchContext();

  useEffect(() => {
    loadAccommodations();
  }, []);

  const loadAccommodations = () => {
    setLoading(true);
    try {
      const data = accommodationService.getAvailableAccommodations();
      setAccommodations(data);
      setFilteredAccommodations(data);
    } catch (error) {
      toast.error('Failed to load accommodations');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchCriteria) {
      setFilteredAccommodations(accommodations);
      return;
    }

    console.log(`🔍 Searching with ${searchStrategy} strategy`);

    // Set strategy based on selection (Strategy Pattern)
    if (searchStrategy === 'price') {
      searchContext.setStrategy(new PriceStrategy());
    } else {
      searchContext.setStrategy(new LocationStrategy());
    }

    // Execute search
    const results = searchContext.executeSearch(searchCriteria, accommodations);
    setFilteredAccommodations(results);
    toast.success(`Found ${results.length} results`);
  };

  const handleBook = async (accommodationID: string, accommodationName: string) => {
    if (!user) {
      toast.error('Please login to book accommodation');
      return;
    }

    setBookingLoading(accommodationID);
    try {
      // Controller delegates to service (Facade Pattern)
      await controller.handleAccommodationRequest(user.userId, accommodationID);
      toast.success(`Successfully booked ${accommodationName}!`);
      loadAccommodations(); // Refresh list
    } catch (error) {
      toast.error((error as Error).message || 'Booking failed');
    } finally {
      setBookingLoading(null);
    }
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
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Available Accommodations</h1>
        <p className="text-gray-600">Find your perfect student housing</p>
      </div>

      {/* Search Section - Strategy Pattern UI */}
      <Card className="mb-8 animate-slide-up">
        <h2 className="text-xl font-semibold mb-4">Search (Strategy Pattern Demo)</h2>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Strategy Selection */}
          <div className="flex-1">
            <label className="label">Search By:</label>
            <select
              className="input"
              value={searchStrategy}
              onChange={(e) => setSearchStrategy(e.target.value as 'price' | 'location')}
            >
              <option value="price">Price Range</option>
              <option value="location">Location</option>
            </select>
          </div>

          {/* Search Input */}
          <div className="flex-1">
            <label className="label">
              {searchStrategy === 'price' ? 'Price Range (e.g., 100-200)' : 'Location'}
            </label>
            <input
              type="text"
              className="input"
              placeholder={searchStrategy === 'price' ? '100-200' : 'North Campus'}
              value={searchCriteria}
              onChange={(e) => setSearchCriteria(e.target.value)}
            />
          </div>

          {/* Search Button */}
          <div className="flex items-end">
            <Button onClick={handleSearch} className="w-full md:w-auto">
              Search
            </Button>
          </div>

          {/* Reset Button */}
          <div className="flex items-end">
            <Button
              variant="outline"
              onClick={() => {
                setSearchCriteria('');
                setFilteredAccommodations(accommodations);
              }}
              className="w-full md:w-auto"
            >
              Reset
            </Button>
          </div>
        </div>

        <p className="text-sm text-gray-500 mt-2">
          💡 This demonstrates the Strategy Pattern - you can switch between different search algorithms dynamically!
        </p>
      </Card>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredAccommodations.length}</span> of{' '}
          <span className="font-semibold">{accommodations.length}</span> accommodations
        </p>
      </div>

      {/* Accommodations Grid */}
      {filteredAccommodations.length === 0 ? (
        <Card className="text-center py-12">
          <p className="text-gray-600 text-lg">No accommodations found matching your criteria</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAccommodations.map((accommodation, idx) => (
            <Card
              key={accommodation.accommodationID}
              className="flex flex-col animate-slide-up"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Accommodation Image Placeholder */}
              <div className="bg-gradient-to-br from-blue- to-blue- h-48 rounded-t-lg -m-6 mb-4 flex items-center justify-center">
                <MapPin size={64} className="text-white opacity-50" />
              </div>

              {/* Accommodation Details */}
              <h3 className="text-xl font-bold text-gray-800 mb-2">{accommodation.name}</h3>

              <div className="flex items-center text-gray-600 mb-2">
                <MapPin size={16} className="mr-2" />
                <span>{accommodation.location}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-2">
                <Users size={16} className="mr-2" />
                <span>Capacity: {accommodation.capacity}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <DollarSign size={16} className="mr-2" />
                <span className="text-lg font-semibold text-blue-">
                  ${accommodation.pricePerNight}/night
                </span>
              </div>

              {accommodation.description && (
                <p className="text-gray-600 text-sm mb-4">{accommodation.description}</p>
              )}

              {accommodation.amenities && accommodation.amenities.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {accommodation.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="bg-blue- text-blue- text-xs px-2 py-1 rounded"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-auto">
                <Button
                  onClick={() => handleBook(accommodation.accommodationID, accommodation.name)}
                  className="w-full"
                  isLoading={bookingLoading === accommodation.accommodationID}
                  disabled={bookingLoading !== null}
                >
                  Book Now
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
