import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Calendar, Users, Clock, Plus } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { formatDate, formatTime } from '../lib/utils';

function Dashboard() {
  const navigate = useNavigate();
  const { rooms, bookings, user } = useStore();

  const userBookings = bookings.filter(
    (booking) => booking.userId === user?.id && new Date(booking.startTime) >= new Date()
  );

  const availableRooms = rooms.filter((room) => room.status === 'available');

  const handleNewBooking = () => {
    navigate('/calendar');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
        <Button onClick={handleNewBooking}>
          <Plus className="h-4 w-4 mr-2" />
          New Booking
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-primary-600" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Upcoming Bookings</h2>
                <p className="text-3xl font-bold text-primary-600">{userBookings.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Available Rooms</h2>
                <p className="text-3xl font-bold text-green-600">{availableRooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h2 className="text-lg font-semibold text-gray-900">Total Rooms</h2>
                <p className="text-3xl font-bold text-blue-600">{rooms.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold text-gray-900">Your Upcoming Bookings</h2>
        </CardHeader>
        <CardContent>
          {userBookings.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {userBookings.map((booking) => {
                const room = rooms.find((r) => r.id === booking.roomId);
                return (
                  <div key={booking.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">{booking.title}</h3>
                      <p className="text-sm text-gray-500">{room?.name}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(new Date(booking.startTime))} at{' '}
                      {formatTime(new Date(booking.startTime))}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-6">
              <Calendar className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming bookings</h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating a new booking
              </p>
              <div className="mt-6">
                <Button onClick={handleNewBooking}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Booking
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default Dashboard;