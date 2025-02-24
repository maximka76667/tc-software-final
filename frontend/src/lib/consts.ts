import { VariantType } from "notistack";

const statusHandlers: Record<number, { type: VariantType; duration?: number }> =
  {
    200: { type: "success", duration: 1500 },
    201: { type: "info", duration: 1500 },
    300: { type: "warning" },
    500: { type: "error" },
  };

const NUMBER_GRAPHICS_ELEMENTS = 10;

export { statusHandlers, NUMBER_GRAPHICS_ELEMENTS };
