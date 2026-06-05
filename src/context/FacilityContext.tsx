import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { fetchApi } from '../utils/api';

export type FacilityType = 'gym' | 'court';
export type FacilityStatus = 'available' | 'maintenance';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  description: string;
}

interface FacilityContextType {
  facilities: Facility[];
  updateFacilityStatus: (id: string, status: FacilityStatus) => Promise<void>;
  loadFacilities: () => Promise<void>;
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export const FacilityProvider = ({ children }: { children: ReactNode }) => {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  const loadFacilities = async () => {
    try {
      const res = await fetchApi('/facilities');
      setFacilities(res.data);
    } catch (err) {
      console.error('Failed to load facilities', err);
    }
  };

  useEffect(() => {
    loadFacilities();
  }, []);

  const updateFacilityStatus = async (id: string, status: FacilityStatus) => {
    try {
      await fetchApi(`/facilities/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status })
      });
      setFacilities((prev) => 
        prev.map(f => f.id === id ? { ...f, status } : f)
      );
    } catch (err) {
      console.error('Failed to update facility status', err);
    }
  };

  return (
    <FacilityContext.Provider value={{ facilities, updateFacilityStatus, loadFacilities }}>
      {children}
    </FacilityContext.Provider>
  );
};

export const useFacilities = () => {
  const context = useContext(FacilityContext);
  if (context === undefined) {
    throw new Error('useFacilities must be used within a FacilityProvider');
  }
  return context;
};
