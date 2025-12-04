import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Utensils, Clock, DollarSign } from 'lucide-react';
import { toast } from 'sonner';

export const MealsPage: React.FC = () => {
  const { user } = useAuth();
  const { mealService } = useServices();
  const [meals, setMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMealType, setSelectedMealType] = useState<'BREAKFAST' | 'LUNCH' | 'DINNER'>('LUNCH');
  const [bookingLoading, setBookingLoading] = useState<string | null>(null);

  useEffect(() => {
    loadMeals();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMealType]);

  const loadMeals = () => {
    setLoading(true);
    try {
      const data = mealService.getAvailableMeals(selectedMealType);
      setMeals(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load meals');
      setMeals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookMeal = async (mealId: string) => {
    if (!user) {
      toast.error('Please log in first');
      return;
    }

    setBookingLoading(mealId);
    try {
      await mealService.selectMeal(user.userId, selectedMealType);
      toast.success('✅ Meal booked successfully!');
      loadMeals();
    } catch (error) {
      toast.error('Failed to book meal');
    } finally {
      setBookingLoading(null);
    }
  };

  const mealTypes: Array<'BREAKFAST' | 'LUNCH' | 'DINNER'> = ['BREAKFAST', 'LUNCH', 'DINNER'];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <Utensils className="text-orange-600" size={36} />
          Order Meals
        </h1>
        <p className="text-gray-600 mt-2">Select and book your meals</p>
      </div>

      <div className="flex gap-4 mb-8">
        {mealTypes.map((type) => (
          <Button
            key={type}
            variant={selectedMealType === type ? 'primary' : 'outline'}
            onClick={() => setSelectedMealType(type)}
          >
            {type}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">Loading meals...</div>
      ) : meals.length === 0 ? (
        <Card className="bg-gray-50 p-8 text-center">
          <p className="text-gray-600 text-lg">No meals available for this time</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {meals.map((meal: any) => (
            <Card key={meal.mealID} className="hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Utensils className="text-orange-600" size={20} />
                <h3 className="text-xl font-bold">{meal.name}</h3>
              </div>
              <p className="text-gray-600 mb-4">{meal.description}</p>
              <div className="flex justify-between items-center mb-4">
                <span className="flex items-center gap-2 text-green-600">
                  <DollarSign size={18} />
                  ${meal.price || 5.99}
                </span>
              </div>
              <Button
                className="w-full"
                onClick={() => handleBookMeal(meal.mealID)}
                disabled={bookingLoading === meal.mealID}
              >
                {bookingLoading === meal.mealID ? 'Booking...' : 'Book Meal'}
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MealsPage;
