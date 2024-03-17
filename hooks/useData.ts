import { Person } from '@/constants/types';
import { create } from 'zustand';

type UserType = {
  userData: Person | null;
  getUserData: (data: Person) => void;
};

export const useData = create<UserType>((set) => ({
  userData: null,
  getUserData: (data: Person) => {
    set({ userData: data });
  },
}));
