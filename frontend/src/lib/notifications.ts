import { VariantType } from "notistack";
import { statusHandlers } from "./consts";

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
