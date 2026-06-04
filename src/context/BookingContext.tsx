import React, { createContext, useContext, useState, ReactNode } from 'react';

export type BookingStatus = 'pending' | 'approved' | 'rejected';

export interface Booking {
  id: string;
  studentId: string;
  studentName: string;
  facility: string; // e.g., 'Campus Gym', 'Court 1'
  date: string;
  time: string;
  status: BookingStatus;
  createdAt: number;
}

interface BookingContextType {
  bookings: Booking[];
  addBooking: (booking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => void;
  approveBooking: (id: string) => void;
  rejectBooking: (id: string) => void;
}

const BookingContext = createContext<BookingContextType | undefined>(undefined);

export const BookingProvider = ({ children }: { children: ReactNode }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const addBooking = (newBooking: Omit<Booking, 'id' | 'status' | 'createdAt'>) => {
    const booking: Booking = {
      ...newBooking,
      id: Math.random().toString(36).substring(7),
      status: 'pending',
      createdAt: Date.now(),
    };
    setBookings((prev) => [booking, ...prev]);
  };

  const approveBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'approved' } : b))
    );
  };

  const rejectBooking = (id: string) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'rejected' } : b))
    );
  };

  return (
    <BookingContext.Provider value={{ bookings, addBooking, approveBooking, rejectBooking }}>
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
