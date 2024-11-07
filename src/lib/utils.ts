import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { addDays, format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date): string {
  return format(date, 'EEEE, MMMM d, yyyy');
}

export function formatTime(date: Date): string {
  return format(date, 'h:mm a');
}

export function getDaysInMonth(date: Date): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  return Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
}

export function getWeekDays(startDate: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
}