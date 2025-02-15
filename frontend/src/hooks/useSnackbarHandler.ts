// components/SnackbarHandler.tsx
import { closeSnackbar, enqueueSnackbar, SnackbarKey } from "notistack";
import { useState } from "react";

// Custom hook responsible for showing notifications
// All notifications are showed in the right bottom corner of screen
export function useSnackbarHandler() {
  const [connectingSnackbarKey, setConnectingSnackbarKey] =
    useState<SnackbarKey>("");

  // Red persistent (being showed until close manually) notification
  const handleError = () => {
    enqueueSnackbar("Error on connection!", {
      variant: "error",
      persist: true,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
    closeSnackbar(connectingSnackbarKey);
  };

  // Success (green)
  const handleOpen = () => {
    enqueueSnackbar("Connected successfully!", {
      variant: "success",
      autoHideDuration: 3000,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
    closeSnackbar(connectingSnackbarKey);
  };

  // Warning (yellow)
  const handleStart = () => {
    const key = enqueueSnackbar("Connecting...", {
      variant: "info",
      persist: true,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
    setConnectingSnackbarKey(key);
  };

  const handleClose = () => {
    closeSnackbar();
  };

  return {
    handleError,
    handleOpen,
    handleStart,
    handleClose,
  };
}
