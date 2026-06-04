import React, { createContext, useContext, useState, ReactNode } from 'react';

export type FacilityType = 'gym' | 'court';
export type FacilityStatus = 'available' | 'maintenance';

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  status: FacilityStatus;
  description: string;
}

const INITIAL_FACILITIES: Facility[] = [
  { 
    id: 'gym-main', 
    name: 'Main Campus Gym', 
    type: 'gym', 
    status: 'available',
    description: 'Fully equipped fitness center with cardio and weight zones.'
  },
  { 
    id: 'court-1', 
    name: 'Pro Court Alpha', 
    type: 'court', 
    status: 'available',
    description: 'Professional grade synthetic matting. Best for competitive matches.'
  },
  { 
    id: 'court-2', 
    name: 'Standard Court Beta', 
    type: 'court', 
    status: 'available',
    description: 'Wooden sprung floor. Great for casual play and training.'
  },
  { 
    id: 'court-3', 
    name: 'Court Gamma', 
    type: 'court', 
    status: 'maintenance',
    description: 'Currently undergoing floor polishing and net replacement.'
  },
];

interface FacilityContextType {
  facilities: Facility[];
  updateFacilityStatus: (id: string, status: FacilityStatus) => void;
}

const FacilityContext = createContext<FacilityContextType | undefined>(undefined);

export const FacilityProvider = ({ children }: { children: ReactNode }) => {
  const [facilities, setFacilities] = useState<Facility[]>(INITIAL_FACILITIES);

  const updateFacilityStatus = (id: string, status: FacilityStatus) => {
    setFacilities((prev) => 
      prev.map(f => f.id === id ? { ...f, status } : f)
    );
  };

  return (
    <FacilityContext.Provider value={{ facilities, updateFacilityStatus }}>
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
