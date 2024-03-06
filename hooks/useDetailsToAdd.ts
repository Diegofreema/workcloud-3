import { create } from 'zustand';

type Props = {
  id: string;
  role: string;
  getData: (role: string, id: string) => void;
};

export const useDetailsToAdd = create<Props>((set) => ({
  id: '',
  role: '',
  getData: (role: string, id: string) => set({ role: role, id: id }),
}));
