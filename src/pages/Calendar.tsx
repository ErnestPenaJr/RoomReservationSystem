import React, { useState } from 'react';
import { useStore } from '../store/useStore';
import { Calendar as CalendarIcon, Clock, Users, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { formatDate, formatTime, getDaysInMonth, getWeekDays } from '../lib/utils';
import { addDays, startOfWeek, endOfWeek, format, isSameDay, parseISO } from 'date-fns';

function Calendar() {
  const { rooms, bookings, user, addBooking } = useStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);
  const [selectedStartTime, setSelectedStartTime] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingTitle, setBookingTitle] = useState('');
  const [bookingDescription, setBookingDescription] = useState('');
  const [duration, setDuration] = useState(1);
  const [view, setView] = useState<'week' | 'day'>('week');

  // Get start and end of current week
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = getWeekDays(weekStart);

  // Generate time slots
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const durationOptions = Array.from({ length: 8 }, (_, i) => i + 1);

  const navigateWeek = (direction: 'prev' | 'next') => {
    const days = direction === 'prev' ? -7 : 7;
    setSelectedDate(addDays(selectedDate, days));
  };

  const getBookingsForDayAndTime = (date: Date, time: string, roomId: string) => {
    return bookings.filter((booking) => {
      if (booking.roomId !== roomId) return false;
      
      const bookingStart = new Date(booking.startTime);
      const bookingEnd = new Date(booking.endTime);
      const slotStart = new Date(date);
      const [hour] = time.split(':');
      slotStart.setHours(parseInt(hour), 0, 0, 0);
      const slotEnd = new Date(slotStart);
      slotEnd.setHours(slotStart.getHours() + 1);

      return (
        (slotStart >= bookingStart && slotStart < bookingEnd) ||
        (slotEnd > bookingStart && slotEnd <= bookingEnd) ||
        (slotStart <= bookingStart && slotEnd >= bookingEnd)
      );
    })[0]; // Return first matching booking
  };

  const handleBookRoom = () => {
    if (!selectedRoom || !selectedStartTime || !user) return;

    const startTime = new Date(selectedDate);
    const [hour] = selectedStartTime.split(':');
    startTime.setHours(parseInt(hour), 0, 0, 0);

    const endTime = new Date(startTime);
    endTime.setHours(startTime.getHours() + duration);

    const newBooking = {
      id: Math.random().toString(36).substr(2, 9),
      roomId: selectedRoom,
      userId: user.id,
      startTime: startTime.toISOString(),
      endTime: endTime.toISOString(),
      title: bookingTitle || 'Untitled Meeting',
      description: bookingDescription,
      status: 'pending' as const,
    };

    addBooking(newBooking);
    setShowBookingForm(false);
    setBookingTitle('');
    setBookingDescription('');
    setSelectedStartTime(null);
    setDuration(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Room Calendar</h1>
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigateWeek('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </span>
          <Button variant="secondary" onClick={() => navigateWeek('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">Available Rooms</h2>
            </CardHeader>
            <CardContent className="divide-y divide-gray-200">
              {rooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`w-full px-4 py-3 flex items-center hover:bg-gray-50 transition-colors ${
                    selectedRoom === room.id ? 'bg-primary-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <img
                      src={room.imageUrl}
                      alt={room.name}
                      className="h-10 w-10 rounded-lg object-cover"
                    />
                  </div>
                  <div className="ml-3 flex-1 text-left">
                    <p className="text-sm font-medium text-gray-900">{room.name}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{room.capacity}</span>
                    </div>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          {selectedRoom ? (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-lg font-medium text-gray-900">
                  {rooms.find((r) => r.id === selectedRoom)?.name}
                </h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-8 gap-px bg-gray-200">
                  {/* Time column */}
                  <div className="bg-white">
                    <div className="h-10"></div> {/* Header spacer */}
                    {timeSlots.map((time) => (
                      <div
                        key={time}
                        className="h-20 border-b border-gray-100 px-2 py-1"
                      >
                        <span className="text-xs text-gray-500">{time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Days columns */}
                  {weekDays.map((day, index) => (
                    <div key={index} className="bg-white">
                      <div className="h-10 border-b border-gray-200 px-2 py-1 text-center">
                        <div className="text-sm font-medium text-gray-900">
                          {format(day, 'EEE')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {format(day, 'MMM d')}
                        </div>
                      </div>
                      {timeSlots.map((time) => {
                        const booking = getBookingsForDayAndTime(day, time, selectedRoom);
                        const isBooked = !!booking;
                        return (
                          <div
                            key={`${day}-${time}`}
                            onClick={() => {
                              if (!isBooked) {
                                setSelectedDate(day);
                                setSelectedStartTime(time);
                                setShowBookingForm(true);
                              }
                            }}
                            className={`h-20 border-b border-gray-100 p-1 ${
                              isBooked
                                ? 'bg-primary-100'
                                : 'hover:bg-gray-50 cursor-pointer'
                            }`}
                          >
                            {booking && (
                              <div className="h-full w-full rounded bg-primary-200 p-1">
                                <div className="text-xs font-medium text-primary-900 truncate">
                                  {booking.title}
                                </div>
                                <div className="text-xs text-primary-700">
                                  {format(parseISO(booking.startTime), 'HH:mm')} -{' '}
                                  {format(parseISO(booking.endTime), 'HH:mm')}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">
                    No room selected
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Select a room from the list to view its schedule
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Booking Form Modal */}
      {showBookingForm && selectedRoom && selectedStartTime && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              New Booking: {rooms.find((r) => r.id === selectedRoom)?.name}
            </h3>
            <div className="space-y-4">
              <Input
                label="Meeting Title"
                value={bookingTitle}
                onChange={(e) => setBookingTitle(e.target.value)}
                placeholder="Enter meeting title"
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                >
                  {durationOptions.map((hours) => (
                    <option key={hours} value={hours}>
                      {hours} {hours === 1 ? 'hour' : 'hours'}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={bookingDescription}
                  onChange={(e) => setBookingDescription(e.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                  placeholder="Enter meeting description"
                />
              </div>
              <div className="flex justify-end space-x-3">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowBookingForm(false);
                    setSelectedStartTime(null);
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleBookRoom}>
                  <Plus className="h-4 w-4 mr-2" />
                  Book Room
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Calendar;