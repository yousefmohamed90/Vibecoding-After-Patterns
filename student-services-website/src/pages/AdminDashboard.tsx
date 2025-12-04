import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { BarChart3, Users, CreditCard, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { accommodationService, transportService, mealService, clubService } = useServices();
  const [stats, setStats] = useState({
    totalAccommodations: 0,
    totalTransport: 0,
    totalMeals: 0,
    totalClubs: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadStats = () => {
    setLoading(true);
    try {
      const accommodations = accommodationService.getAvailableAccommodations();
      const transports = transportService.getAvailableTransport();
      const meals = mealService.getAvailableMeals();
      const clubs = clubService.getAvailableClubs();

      const totalRevenue = 
        (Array.isArray(accommodations) ? accommodations.length : 0) * 50 +
        (Array.isArray(transports) ? transports.length : 0) * 10 +
        (Array.isArray(meals) ? meals.length : 0) * 6 +
        (Array.isArray(clubs) ? clubs.length : 0) * 20;

      setStats({
        totalAccommodations: Array.isArray(accommodations) ? accommodations.length : 0,
        totalTransport: Array.isArray(transports) ? transports.length : 0,
        totalMeals: Array.isArray(meals) ? meals.length : 0,
        totalClubs: Array.isArray(clubs) ? clubs.length : 0,
        totalRevenue,
      });
    } catch (error) {
      toast.error('Failed to load admin stats');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { icon: Users, title: 'Accommodations', value: stats.totalAccommodations, color: 'text-blue-600' },
    { icon: TrendingUp, title: 'Transport', value: stats.totalTransport, color: 'text-green-600' },
    { icon: BarChart3, title: 'Meals', value: stats.totalMeals, color: 'text-orange-600' },
    { icon: Users, title: 'Clubs', value: stats.totalClubs, color: 'text-purple-600' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.email}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading dashboard...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((card, idx) => (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">{card.title}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                  </div>
                  <card.icon className={`${card.color}`} size={40} />
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <CreditCard className="text-green-600" size={28} />
              Total Revenue
            </h2>
            <p className="text-4xl font-bold text-green-600">${stats.totalRevenue.toFixed(2)}</p>
          </Card>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
