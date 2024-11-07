export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  department: string;
  lastLogin: Date;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  floor: number;
  building: string;
  amenities: string[];
  description: string;
  imageUrl: string;
  hasVideoConference: boolean;
  status: 'available' | 'maintenance';
}

export interface Reservation {
  id: string;
  roomId: string;
  userId: string;
  start: Date;
  end: Date;
  status: 'pending' | 'approved' | 'rejected';
  purpose: string;
  attendees: number;
  recurring?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    until: Date;
  };
}