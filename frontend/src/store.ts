import { create } from "zustand";
import { addAndGetLastNElements } from "./lib/utils";

type IntervalIdStore = {
  intervalId: number | null;
  setIntervalId: (intervalId: number | null) => void;
};

export const useIntervalIdStore = create<IntervalIdStore>()((set) => ({
  intervalId: null,
  setIntervalId: (intervalId) => set({ intervalId }),
}));

// Define the state type
type TelemetryState = {
  velocity: (number | null)[];
  voltage: (number | null)[];
  current: (number | null)[];
  elevation: (number | null)[];

  addVelocity: (value: number | null) => void;
  addVoltage: (value: number | null) => void;
  addCurrent: (value: number | null) => void;
  addElevation: (value: number | null) => void;
  resetData: () => void;

  isSimulationRunning: boolean;
  setIsSimulationRunning: (value: boolean) => void;
};

// Create the store
export const useTelemetryStore = create<TelemetryState>((set) => ({
  velocity: [],
  voltage: [],
  current: [],
  elevation: [],
  addVelocity: (value) =>
    set((state) => ({
      velocity: addAndGetLastNElements(state.velocity, value, 10),
    })),
  addVoltage: (value) =>
    set((state) => ({
      voltage: addAndGetLastNElements(state.voltage, value, 10),
    })),
  addCurrent: (value) =>
    set((state) => ({
      current: addAndGetLastNElements(state.current, value, 10),
    })),
  addElevation: (value) =>
    set((state) => ({
      elevation: addAndGetLastNElements(state.elevation, value, 10),
    })),
  resetData: () =>
    set({ velocity: [], voltage: [], current: [], elevation: [] }),
  isSimulationRunning: false,
  setIsSimulationRunning: (value) => set({ isSimulationRunning: value }),
}));
