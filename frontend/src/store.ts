// import { create } from "zustand";
// import { addAndGetLastNElements } from "./lib/utils";

// type IntervalIdStore = {
//   intervalId: number | null;
//   setIntervalId: (intervalId: number | null) => void;
// };

// export const useIntervalIdStore = create<IntervalIdStore>()((set) => ({
//   intervalId: null,
//   setIntervalId: (intervalId) => set({ intervalId }),
// }));

// // Define the state type
// type TelemetryState = {
//   velocity: (number | null)[];
//   voltage: (number | null)[];
//   current: (number | null)[];
//   elevation: (number | null)[];

//   addVelocity: (value: number | null) => void;
//   addVoltage: (value: number | null) => void;
//   addCurrent: (value: number | null) => void;
//   addElevation: (value: number | null) => void;
//   resetData: () => void;
// };

// // Create the store for telemetry
// // Velocity, voltage, current and elevation are arrays of last n values of this parameter
// // send through WebSocket
// // add functions add new value and limit array by some maximum value
// // isSimulationRunning responds for server's active state of sending packets with telemetry
// export const useTelemetryStore = create<TelemetryState>((set) => ({
//   velocity: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   voltage: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   current: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   elevation: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   addVelocity: (value) =>
//     set((state) => ({
//       velocity: addAndGetLastNElements(state.velocity, value, 10),
//     })),
//   addVoltage: (value) =>
//     set((state) => ({
//       voltage: addAndGetLastNElements(state.voltage, value, 10),
//     })),
//   addCurrent: (value) =>
//     set((state) => ({
//       current: addAndGetLastNElements(state.current, value, 10),
//     })),
//   addElevation: (value) =>
//     set((state) => ({
//       elevation: addAndGetLastNElements(state.elevation, value, 10),
//     })),
//   resetData: () =>
//     set({ velocity: [], voltage: [], current: [], elevation: [] }),
// }));
