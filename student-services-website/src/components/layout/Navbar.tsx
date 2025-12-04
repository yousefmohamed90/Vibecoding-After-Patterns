import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogOut, User, Home } from 'lucide-react';
import { Button } from '../common/Button';

export const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <Home className="text-blue-600" size={24} />
            <span className="text-xl font-bold text-gray-800">Student Services</span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Dashboard
                </Link>
                <Link to="/accommodations" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Accommodations
                </Link>
                <Link to="/transport" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Transport
                </Link>
                <Link to="/meals" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Meals
                </Link>
                <Link to="/clubs" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Clubs
                </Link>
                <Link to="/profile" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors">
                  <User size={18} />
                  <span>{user?.email}</span>
                </Link>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center space-x-1"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary" size="sm">Register</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
