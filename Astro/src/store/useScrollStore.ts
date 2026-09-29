import { create } from 'zustand';

interface ScrollState {
  scrollY: number;
  setScrollY: (y: number) => void;
}

export const useScrollStore = create<ScrollState>((set) => ({
  scrollY: 0,
  setScrollY: (y) => set({ scrollY: y }),
}));
