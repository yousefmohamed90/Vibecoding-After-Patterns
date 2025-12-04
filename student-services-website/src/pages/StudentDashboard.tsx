import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Home, Bus, Utensils, Users, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';

export const StudentDashboard: React.FC = () => {
  const { user } = useAuth();
  const { accommodationService, transportService, clubService, notificationService } = useServices();
  const [stats, setStats] = useState({
    accommodations: 0,
    transport: 0,
    clubs: 0,
    notifications: 0,
  });

  useEffect(() => {
    if (user) {
      try {
        const accommodations = accommodationService.getStudentBookings(user.userId);
        const transport = transportService.getStudentBookings(user.userId);
        const clubs = clubService.getStudentMemberships(user.userId);
        const notifications = notificationService.viewNotifications(user.userId);

        setStats({
          accommodations: accommodations.length,
          transport: transport.length,
          clubs: clubs.length,
          notifications: notifications.filter((n: any) => !n.isRead).length,
        });
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    }
  }, [user, accommodationService, transportService, clubService, notificationService]);

  const quickActions = [
    { icon: Home, title: 'Book Accommodation', link: '/accommodations', color: 'text-blue-600' },
    { icon: Bus, title: 'Book Transport', link: '/transport', color: 'text-green-600' },
    { icon: Utensils, title: 'Order Meal', link: '/meals', color: 'text-orange-600' },
    { icon: Users, title: 'Join Club', link: '/clubs', color: 'text-purple-600' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-800">Welcome back, {user?.email}!</h1>
        <p className="text-gray-600 mt-2">Here's your dashboard overview</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Accommodations</p>
              <p className="text-3xl font-bold text-gray-800">{stats.accommodations}</p>
            </div>
            <Home className="text-blue-600" size={40} />
          </div>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Transport Bookings</p>
              <p className="text-3xl font-bold text-gray-800">{stats.transport}</p>
            </div>
            <Bus className="text-green-600" size={40} />
          </div>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Club Memberships</p>
              <p className="text-3xl font-bold text-gray-800">{stats.clubs}</p>
            </div>
            <Users className="text-purple-600" size={40} />
          </div>
        </Card>

        <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Notifications</p>
              <p className="text-3xl font-bold text-gray-800">{stats.notifications}</p>
            </div>
            <Bell className="text-red-600" size={40} />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.link}>
              <Card className="hover:shadow-xl transition-shadow cursor-pointer animate-slide-up" style={{ animationDelay: `${idx * 50}ms` }}>
                <div className="text-center">
                  <action.icon className={`mx-auto mb-3 ${action.color}`} size={48} />
                  <p className="font-semibold">{action.title}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
