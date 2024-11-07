import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Calendar, LogOut, LayoutDashboard, Settings } from 'lucide-react';
import { useStore } from '../store/useStore';
import Button from './ui/Button';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useStore();

  const handleLogout = () => {
    setUser(null);
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <img
                src="/mdanderson-logo.png"
                alt="MD Anderson Cancer Center"
                className="h-8"
              />
              <div className="ml-4 flex items-center">
                <Calendar className="h-6 w-6 text-primary-600" />
                <span className="ml-2 text-lg font-medium text-gray-900">
                  Room Reservation
                </span>
              </div>
            </Link>

            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              <Link
                to="/dashboard"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive('/dashboard')
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
              <Link
                to="/calendar"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive('/calendar')
                    ? 'text-primary-600 border-b-2 border-primary-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Calendar
              </Link>
              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    isActive('/admin')
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Admin
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <span className="text-gray-700 mr-4">{user?.name}</span>
            <Button variant="secondary" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;