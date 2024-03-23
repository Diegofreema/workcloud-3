import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type PartialUser = {
  id: string;
  name: string;
  email: string;
  streamToken?: string;
  avatar: string;
};
type UserType = {
  id: string;
  user: PartialUser | null;
  getUserId: (user: PartialUser) => void;
  removeId: () => void;
};

export const useData = create<UserType>((set) => ({
  user: null,
  id: SecureStore.getItem('id') || '',
  getUserId: (user: PartialUser) => {
    set({ user, id: user.id });
    SecureStore.setItem('id', user.id);
  },
  removeId: async () => {
    set({ user: null, id: '' });
  },
}));
