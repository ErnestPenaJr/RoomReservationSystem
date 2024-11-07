import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, Room, Booking } from '../types';

interface Store {
  user: User | null;
  users: User[];
  rooms: Room[];
  bookings: Booking[];
  setUser: (user: User | null) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  deleteUser: (id: string) => void;
  approveUser: (id: string) => void;
  denyUser: (id: string, reason: string) => void;
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  addBooking: (booking: Booking) => void;
  updateBooking: (booking: Booking) => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      users: [
        {
          id: '1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          department: 'IT',
          lastLogin: new Date(),
          status: 'approved',
        },
      ],
      rooms: [
        {
          id: '1',
          name: 'Conference Room A',
          capacity: 20,
          imageUrl: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
          floor: 1,
          building: 'Main',
          amenities: ['Projector', 'Whiteboard', 'Video Conference'],
          status: 'available',
        },
        {
          id: '2',
          name: 'Meeting Room B',
          capacity: 8,
          imageUrl: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2',
          floor: 2,
          building: 'Main',
          amenities: ['TV Screen', 'Whiteboard'],
          status: 'available',
        },
      ],
      bookings: [],
      setUser: (user) => set({ user }),
      addUser: (user) => set((state) => ({ users: [...state.users, { ...user, status: user.status || 'pending' }] })),
      updateUser: (updatedUser) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === updatedUser.id ? updatedUser : user
          ),
          user: state.user?.id === updatedUser.id ? updatedUser : state.user,
        })),
      deleteUser: (id) =>
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
          user: state.user?.id === id ? null : state.user,
        })),
      approveUser: (id) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, status: 'approved' as const } : user
          ),
        })),
      denyUser: (id, reason) =>
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id
              ? { ...user, status: 'denied' as const, denialReason: reason }
              : user
          ),
        })),
      addRoom: (room) => set((state) => ({ rooms: [...state.rooms, room] })),
      updateRoom: (updatedRoom) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === updatedRoom.id ? updatedRoom : room
          ),
        })),
      deleteRoom: (id) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== id),
          bookings: state.bookings.filter((booking) => booking.roomId !== id),
        })),
      addBooking: (booking) =>
        set((state) => ({ bookings: [...state.bookings, booking] })),
      updateBooking: (booking) =>
        set((state) => ({
          bookings: state.bookings.map((b) => (b.id === booking.id ? booking : b)),
        })),
    }),
    {
      name: 'room-reserve-storage',
    }
  )
);