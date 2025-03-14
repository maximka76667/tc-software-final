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
