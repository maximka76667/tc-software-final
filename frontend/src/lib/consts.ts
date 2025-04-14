import { VariantType } from "notistack";
import { Command, Metric, States } from "./definitions";

// Ping endpoint base url
export const API_BASE_URL = "http://localhost:3000";

// Notifications' types
export const statusHandlers: Record<
  number,
  { type: VariantType; duration?: number }
> = {
  200: { type: "success", duration: 1500 },
  201: { type: "info", duration: 1500 },
  300: { type: "warning" },
  500: { type: "error" },
};

// Number of elements in charts
export const NUMBER_GRAPHICS_ELEMENTS = 10;

// Ping pong consts
export const PING_INTERVAL = 1000;
export const PING_TIMEOUT = 500; // Timeout for sending fault command if pong doesn't arrive
export const FAULT_INTERVAL = 1000;

// Viewer consts
export const GRID_SIZE = 12;

// Control panel commands
export const commands: Command[] = [
  "precharge",
  "discharge",
  "start levitation",
  "stop levitation",
  // "start motor",
  // "stop motor",
];

// Control panel charts
export const telemetryMetrics: Metric[] = [
  { label: "Elevation", color: "#4CAF50" },
  // { label: "Velocity", color: "#F44336" },
  { label: "Voltage", color: "#FF9800" },
  { label: "Current", color: "#2196F3" },
  // { label: "Altura", color: "#000" },
];

// Possible transitions from state
export const stateTransitions: States = {
  initial: ["precharge"],
  precharging: [],
  precharged: ["discharge", "start levitation"],
  levitating: [],
  levitated: ["stop levitation"],
  levitation_stopping: [],
  discharging: [],
};

// Metric names
export const telemetryKeys = telemetryMetrics.reduce(
  (array, metric) => [...array, metric.label.toLowerCase()],
  [] as string[]
);
