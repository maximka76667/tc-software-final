import { VariantType } from "notistack";

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

// Ping pong consts
export const NUMBER_GRAPHICS_ELEMENTS = 10;

export const PING_INTERVAL = 1000;
export const PING_TIMEOUT = 500; // Timeout for sending fault command if pong doesn't arrive
export const FAULT_INTERVAL = 1000;

// Viewer consts
export const GRID_SIZE = 12;

// Control panel commands
export const commands = [
  "precharge",
  "discharge",
  "start levitation",
  "stop levitation",
  // "start motor",
  // "stop motor",
];

// Control panel charts
export const telemetryMetrics = [
  { label: "Elevation", color: "#4CAF50" },
  // { label: "Velocity", color: "#F44336" },
  { label: "Voltage", color: "#FF9800" },
  { label: "Current", color: "#2196F3" },
];
