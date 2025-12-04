import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServiceContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Bell, Trash2, Check } from 'lucide-react';
import { toast } from 'sonner';

export const NotificationsPage: React.FC = () => {
  const { user } = useAuth();
  const { notificationService } = useServices();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadNotifications = () => {
    setLoading(true);
    try {
      if (user) {
        const data = notificationService.viewNotifications(user.userId);
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      toast.error('Failed to load notifications');
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = (notificationId: string) => {
    try {
      notificationService.markAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.notificationID === notificationId ? { ...n, isRead: true } : n
      ));
      toast.success('✅ Marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = (notificationId: string) => {
    setNotifications(notifications.filter(n => n.notificationID !== notificationId));
    toast.success('✅ Notification deleted');
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <Bell className="text-blue-600" size={36} />
          Notifications
        </h1>
        <p className="text-gray-600 mt-2">
          You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">Loading notifications...</div>
      ) : notifications.length === 0 ? (
        <Card className="bg-gray-50 p-8 text-center">
          <Bell className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-600 text-lg">No notifications yet</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification: any) => (
            <Card
              key={notification.notificationID}
              className={`p-4 hover:shadow-md transition-shadow ${
                !notification.isRead ? 'border-l-4 border-blue-500 bg-blue-50' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      notification.type === 'EMAIL' ? 'bg-blue-100 text-blue-800' :
                      notification.type === 'SMS' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {notification.type}
                    </span>
                    {!notification.isRead && (
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-800 mb-2">{notification.message}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(notification.dateSent).toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2 ml-4">
                  {!notification.isRead && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleMarkAsRead(notification.notificationID)}
                    >
                      <Check size={16} />
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(notification.notificationID)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
