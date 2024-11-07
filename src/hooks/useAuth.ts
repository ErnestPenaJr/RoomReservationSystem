import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      login: async (email: string, password: string) => {
        // Mock login - in production, this would be an API call
        if (email === 'admin@example.com' && password === 'password') {
          const user: User = {
            id: '1',
            name: 'Admin User',
            email: 'admin@example.com',
            role: 'admin',
            department: 'IT',
            lastLogin: new Date(),
          };
          set({ user, isAuthenticated: true });
        } else {
          throw new Error('Invalid credentials');
        }
      },
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);