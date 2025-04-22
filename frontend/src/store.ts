import { create } from "zustand";
import {
  Angles,
  ArrayData,
  Message,
  Metric,
  State,
  Telemetry,
} from "./lib/definitions";
import { formatDateTime } from "./lib/utils";
import {
  NUMBER_GRAPHICS_ELEMENTS,
  telemetryKeys,
  telemetryMetrics,
} from "./lib/consts";

interface WebSocketStore<T> {
  data: T | null;
  setData: (data: T) => void;

  error: boolean;
  setError: (error: boolean) => void;

  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  isFaultConfirmed: boolean;
  setIsFaultConfirmed: (confirmed: boolean) => void;

  currentState: State;
  setCurrentState: (state: State) => void;

  messages: Message[];
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  clearMessages: () => void;

  angles: Angles;
  setAngles: (angles: Angles) => void;
}

export const useWebSocketStore = create<WebSocketStore<Telemetry>>((set) => ({
  data: null,
  setData: (data) => set({ data }),

  error: false,
  setError: (error) => set({ error }),

  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),

  isFaultConfirmed: false,
  setIsFaultConfirmed: (confirmed) => set({ isFaultConfirmed: confirmed }),

  currentState: "initial",
  setCurrentState: (state: State) => set({ currentState: state }),

  messages: [
    {
      message: "Application ready",
      severity: 1,
      time: formatDateTime(new Date()),
    },
  ],
  setMessages: (messages: Message[]) => set({ messages }),
  addMessage: (message: { message: string; severity?: number }) =>
    set((state) => ({
      messages: [
        ...state.messages,
        {
          message: message.message,
          severity: message.severity ?? 5,
          time: formatDateTime(new Date()),
        },
      ],
    })),
  clearMessages: () => set({ messages: [] }),

  angles: [0, 0, 0],
  setAngles: (angles: Angles) => set({ angles }),
}));

function generateDefaultArrayTelemetryData() {
  const keys = telemetryKeys;

  return keys.reduce((acc, key) => {
    acc[key as keyof Telemetry] = new Array(NUMBER_GRAPHICS_ELEMENTS).fill(0);

    return acc;
  }, {} as ArrayData<Telemetry>);
}

interface TelemetryStore {
  arrayTelemetryData: ArrayData<Telemetry>;
  //   setArrayTelemetryData: (data: { [key in keyof Telemetry]: number[] }) => void;
  addArrayTelemetryData: (data: Telemetry) => void;
  telemetryMetrics: Metric[];
  setTelemetryMetrics: (metrics: Metric[]) => void;

  activeCharts: string[];
  toggleChart: (metric: string) => void;
}

export const useTelemetryStore = create<TelemetryStore>((set) => ({
  arrayTelemetryData: generateDefaultArrayTelemetryData(),

  // Pass through possible keys in telemetry data and add new value into store
  addArrayTelemetryData: (data) => {
    set((state) => {
      const arrayData = state.arrayTelemetryData;
      const keys = Object.keys(state.arrayTelemetryData) as (keyof Telemetry)[];

      return {
        arrayTelemetryData: keys.reduce((acc, key) => {
          acc[key as keyof Telemetry] = [
            ...arrayData[key],
            data[key] ?? 0,
          ].slice(-NUMBER_GRAPHICS_ELEMENTS);

          return acc;
        }, {} as ArrayData<Telemetry>),
      };
    });
  },

  telemetryMetrics: [],
  setTelemetryMetrics: (telemetryMetrics: Metric[]) =>
    set({ telemetryMetrics }),

  activeCharts: telemetryMetrics.map((telemetry) => telemetry.label),

  toggleChart: (metric: string) =>
    set((state) => {
      return {
        activeCharts: state.activeCharts.includes(metric)
          ? state.activeCharts.filter((m) => m !== metric)
          : [...state.activeCharts, metric],
      };
    }),
}));
