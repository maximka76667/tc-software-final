import { create } from "zustand";

type IntervalIdStore = {
  intervalId: number | null;
  setIntervalId: (intervalId: number | null) => void;
};

const useIntervalIdStore = create<IntervalIdStore>()((set) => ({
  intervalId: null,
  setIntervalId: (intervalId) => set({ intervalId }),
}));

export default useIntervalIdStore;
