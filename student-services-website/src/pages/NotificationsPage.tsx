// src/pages/NotificationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { Badge } from '../components/common/Badge';
import { Notification } from '../entities/Notification';
import { Bell, Mail, MessageSquare, Check, Trash2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notificationService } = useServices();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'READ'>('ALL');

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const loadNotifications = () => {
    if (!user) return;

    setLoading(true);
    try {
      const allNotifications = notificationService.viewNotifications(user.userId);
      // Sort by date (newest first)
      allNotifications.sort((a, b) =>
        new Date(b.dateSent).getTime() - new Date(a.dateSent).getTime()
      );
      setNotifications(allNotifications);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (notificationID: string) => {
    try {
      notificationService.markAsRead(notificationID);
      setNotifications(prev =>
        prev.map(n =>
          n.notificationID === notificationID ? { ...n, isRead: true } : n
        )
      );
      toast.success('Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleMarkAllAsRead = () => {
    try {
      notifications
        .filter(n => !n.isRead)
        .forEach(n => notificationService.markAsRead(n.notificationID));

      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  const getNotificationIcon = (type?: 'EMAIL' | 'SMS' | 'SYSTEM') => {
    switch (type) {
      case 'EMAIL':
        return <Mail className="text-blue-600" size={24} />;
      case 'SMS':
        return <MessageSquare className="text-green-600" size={24} />;
      default:
        return <Bell className="text-purple-600" size={24} />;
    }
  };

  const getNotificationColor = (type?: 'EMAIL' | 'SMS' | 'SYSTEM') => {
    switch (type) {
      case 'EMAIL':
        return 'from-blue-50 to-blue-100';
      case 'SMS':
        return 'from-green-50 to-green-100';
      default:
        return 'from-purple-50 to-purple-100';
    }
  };

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'UNREAD') return !n.isRead;
    if (filter === 'READ') return n.isRead;
    return true;
  });

  const unreadCount = notifications.filter(n => !n.isRead).length;

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Notifications</h1>
            <p className="text-gray-600">
              {unreadCount > 0
                ? `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                : 'All caught up! No unread notifications'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
              <Check size={16} className="mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex space-x-3 mb-6">
        <Button
          variant={filter === 'ALL' ? 'primary' : 'outline'}
          onClick={() => setFilter('ALL')}
          size="sm"
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'UNREAD' ? 'primary' : 'outline'}
          onClick={() => setFilter('UNREAD')}
          size="sm"
        >
          Unread ({unreadCount})
        </Button>
        <Button
          variant={filter === 'READ' ? 'primary' : 'outline'}
          onClick={() => setFilter('READ')}
          size="sm"
        >
          Read ({notifications.length - unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card className="text-center py-12">
          <AlertCircle className="mx-auto mb-4 text-gray-400" size={48} />
          <p className="text-gray-600 text-lg">
            {filter === 'UNREAD' ? 'No unread notifications' :
              filter === 'READ' ? 'No read notifications' :
                'No notifications yet'}
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filteredNotifications.map((notification, idx) => (
            <Card
              key={notification.notificationID}
              className={`animate-slide-up ${!notification.isRead ? 'border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="flex items-start space-x-4">
                {/* Icon */}
                <div className={`bg-gradient-to-br ${getNotificationColor(notification.type)} p-3 rounded-lg`}>
                  {getNotificationIcon(notification.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">
                        {notification.type || 'SYSTEM'}
                      </Badge>
                      {!notification.isRead && (
                        <Badge variant="warning">New</Badge>
                      )}
                    </div>
                    <span className="text-sm text-gray-500">
                      {new Date(notification.dateSent).toLocaleDateString()} at{' '}
                      {new Date(notification.dateSent).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  <p className={`text-gray-800 ${!notification.isRead ? 'font-semibold' : ''}`}>
                    {notification.message}
                  </p>

                  {!notification.isRead && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.notificationID)}
                      className="mt-3"
                    >
                      <Check size={14} className="mr-1" />
                      Mark as Read
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
