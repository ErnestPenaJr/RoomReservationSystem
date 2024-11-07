import { create } from 'zustand';
import type { Booking } from '../types';

interface BookingsState {
  bookings: Booking[];
  setBookings: (bookings: Booking[]) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  deleteBooking: (id: string) => void;
}

export const useBookings = create<BookingsState>((set) => ({
  bookings: [],
  setBookings: (bookings) => set({ bookings }),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
  updateBooking: (id, updates) =>
    set((state) => ({
      bookings: state.bookings.map((booking) =>
        booking.id === id ? { ...booking, ...updates } : booking
      ),
    })),
  deleteBooking: (id) =>
    set((state) => ({
      bookings: state.bookings.filter((booking) => booking.id !== id),
    })),
}));