import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input } from '../components/common/Input';
import { User, Mail, Lock, LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!password) newErrors.password = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      toast.success('✅ Password changed successfully!');
      setPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsEditing(false);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('✅ Logged out successfully');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="bg-red-50 p-8 text-center">
          <p className="text-red-600">Please log in to view your profile</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-2">
          <User className="text-blue-600" size={36} />
          My Profile
        </h1>
        <p className="text-gray-600 mt-2">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-2xl font-bold mb-6">Profile Information</h2>
          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User ID</label>
              <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-300">
                {user.userId}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                <Mail size={16} />
                Email Address
              </label>
              <p className="px-3 py-2 bg-gray-50 rounded-lg text-gray-700 border border-gray-300">
                {user.email}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <span className="inline-block px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gray-50">
          <h3 className="font-bold text-gray-800 mb-4">Account</h3>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              <strong>Member Since:</strong> {new Date().toLocaleDateString()}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Status:</strong> <span className="text-green-600">Active</span>
            </p>
          </div>
        </Card>
      </div>

      {isEditing && (
        <Card className="mt-8 p-6">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <Lock className="text-orange-600" size={28} />
            Change Password
          </h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <Input
              label="Current Password"
              type="password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              error={errors.password}
            />
            <Input
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
              error={errors.newPassword}
            />
            <Input
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              error={errors.confirmPassword}
            />
            <div className="flex gap-4">
              <Button type="submit">Change Password</Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {!isEditing && (
        <div className="mt-8 flex gap-4">
          <Button onClick={() => setIsEditing(true)}>
            Change Password
          </Button>
          <Button variant="outline" className="text-red-600" onClick={handleLogout}>
            <LogOut className="inline mr-2" size={18} />
            Logout
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
