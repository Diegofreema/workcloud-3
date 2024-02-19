import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
interface DarkModeState {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const useDarkMode = create<DarkModeState>((set) => ({
  darkMode: false,

  toggleDarkMode: async () => {
    set((state) => {
      const newDarkMode = !state.darkMode;

      return { darkMode: newDarkMode };
    });
  },
}));
