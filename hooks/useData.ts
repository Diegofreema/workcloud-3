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
  getId: () => void;
  removeId: () => void;
};

export const useData = create<UserType>((set) => ({
  user: null,
  id: SecureStore.getItem('id') || '',
  getUserId: (user: PartialUser) => {
    set({ user, id: user.id });
    SecureStore.setItem('id', user.id);
    const stringifyUser = JSON.stringify(user);
    SecureStore.setItem('user', stringifyUser);
  },
  removeId: async () => {
    set({ user: null, id: '' });
    await SecureStore.deleteItemAsync('id');
  },
  getId: () => {
    set((state) => ({ ...state, id: SecureStore.getItem('id') || '' }));
  },
}));
