import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getMockUserProfile } from '../services/firebase';

interface UserProfile {
  id: string;
  name: string;
  age: number;
  weight: number;
  healthMode: string;
  goals: string;
}

interface UserContextType {
  profile: UserProfile | null;
  setHealthMode: (mode: string) => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching user from Firebase
    const loadUser = async () => {
      setIsLoading(true);
      const mockUser = getMockUserProfile();
      setProfile(mockUser);
      setIsLoading(false);
    };
    loadUser();
  }, []);

  const setHealthMode = (mode: string) => {
    setProfile(prev => prev ? { ...prev, healthMode: mode } : null);
  };

  return (
    <UserContext.Provider value={{ profile, setHealthMode, isLoading }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
