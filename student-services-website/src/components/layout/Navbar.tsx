import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../common/Button'

export const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const location = useLocation()

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
          📚 Student Services
        </Link>

        <div className="flex items-center space-x-4">
          {isAuthenticated && user ? (
            <>
              <span className="text-gray-700">Welcome, {user.email}</span>
              <Link to="/dashboard">
                <Button size="sm" variant={location.pathname === '/dashboard' ? 'primary' : 'outline'}>
                  Dashboard
                </Button>
              </Link>
              <Link to="/accommodations">
                <Button size="sm" variant={location.pathname === '/accommodations' ? 'primary' : 'outline'}>
                  Accommodations
                </Button>
              </Link>
              <Button size="sm" variant="outline" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button size="sm" variant={location.pathname === '/login' ? 'primary' : 'outline'}>
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm" variant={location.pathname === '/register' ? 'primary' : 'outline'}>
                  Register
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
export default Navbar
