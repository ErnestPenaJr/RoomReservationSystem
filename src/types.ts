export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  department: string;
  lastLogin: Date;
  status: 'pending' | 'approved' | 'denied';
  denialReason?: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  imageUrl: string;
  floor: number;
  building: string;
  amenities: string[];
  status: 'available' | 'maintenance';
}

export interface Booking {
  id: string;
  roomId: string;
  userId: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'rejected';
  title: string;
  description?: string;
}