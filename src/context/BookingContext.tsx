import React, { createContext, useContext, useState, ReactNode } from 'react';
import { fetchApi } from '../utils/api';

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface Booking {
  id: string;
  studentId: string;
  student?: {
    id: string;
    name: string;
    email: string;
    rollNumber?: string;
  };
  facilityId: string;
  facility?: {
    id: string;
    name: string;
    type: string;
  };
  date: string;
  time: string;
  status: BookingStatus;
  createdAt: string;
}

interface BookingContextType {
  bookings: Booking[];
  loadBookings: (isAdmin: boolean) => Promise<void>;
  addBooking: (facilityId: string, date: string, time: string) => Promise<void>;
  approveBooking: (id: string) => Promise<void>;
  rejectBooking: (id: string) => Promise<void>;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const loadBookings = async (isAdmin: boolean) => {
    try {
      const endpoint = isAdmin ? '/bookings' : '/bookings/my-bookings';
      const res = await fetchApi(endpoint);
      setBookings(res.data);
    } catch (err) {
      console.error('Failed to load bookings', err);
    }
  };

  const addBooking = async (facilityId: string, date: string, time: string) => {
    try {
      const res = await fetchApi('/bookings', {
        method: 'POST',
        body: JSON.stringify({ facilityId, date, time })
      });
      // Add the new booking to the top of the list locally
      setBookings((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error('Failed to add booking', err);
      throw err;
    }
  };

  const updateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const res = await fetchApi(`/bookings/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: res.data.status } : b))
      );
    } catch (err) {
      console.error(`Failed to ${status} booking`, err);
    }
  };

  const approveBooking = (id: string) => updateBookingStatus(id, 'approved');
  const rejectBooking = (id: string) => updateBookingStatus(id, 'rejected');

  return (
    <BookingContext.Provider value={{ bookings, loadBookings, addBooking, approveBooking, rejectBooking }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => {
  const context = useContext(BookingContext);
  if (context === undefined) {
    throw new Error('useBookings must be used within a BookingProvider');
  }
  return context;
};
