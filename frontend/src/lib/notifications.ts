import { VariantType } from "notistack";

const statusHandlers: Record<number, { type: VariantType; duration?: number }> =
  {
    200: { type: "success", duration: 1500 },
    201: { type: "info", duration: 1500 },
    300: { type: "warning" },
    500: { type: "error" },
  };

const showResponse = async (
  res: Response,
  showSnackbar?: (
    message: string,
    variant: VariantType,
    autoHideDuration?: number
  ) => void
) => {
  const data = await res.json();

  const handler = statusHandlers[res.status];

  if (handler) {
    showSnackbar?.(data.message || data.error, handler.type, handler.duration);
  } else {
    console.warn("Unexpected status code:", res.status);
  }
};

export { showResponse };
