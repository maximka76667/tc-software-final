// components/SnackbarHandler.tsx
import {
  closeSnackbar,
  enqueueSnackbar,
  OptionsObject,
  SnackbarKey,
} from "notistack";
import { useState } from "react";
import { statusHandlers } from "../lib/consts";

// Custom hook responsible for showing notifications
// All notifications are showed in the right bottom corner of screen
export function useSnackbarHandler() {
  const [connectingSnackbarKey, setConnectingSnackbarKey] =
    useState<SnackbarKey>("");

  const showSnackbar = (message: string, options?: OptionsObject) => {
    enqueueSnackbar(message, {
      ...options,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
  };

  // Red persistent (being showed until close manually) notification
  const handleConnectionError = () => {
    showSnackbar("Error on connection!", {
      variant: "error",
      autoHideDuration: 10000,
    });
    closeSnackbar(connectingSnackbarKey);
  };

  const handleError = (errorMessage: string) => {
    showSnackbar(errorMessage, {
      variant: "error",
      autoHideDuration: 10000,
    });
  };

  // Success (green)
  const handleOpen = () => {
    showSnackbar("Connected successfully!", {
      variant: "success",
      autoHideDuration: 3000,
    });
    closeSnackbar(connectingSnackbarKey);
  };

  // Warning (yellow)
  const handleStart = () => {
    const key = enqueueSnackbar("Connecting...", {
      variant: "info",
      autoHideDuration: 10000,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
    setConnectingSnackbarKey(key);
  };

  const showMessage = (statusCode: number, message: string) => {
    const { type, duration } = statusHandlers[statusCode];
    enqueueSnackbar(message, {
      variant: type,
      autoHideDuration: duration || 2000,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
  };

  const handleClose = () => {
    closeSnackbar();
  };

  return {
    handleError,
    handleConnectionError,
    handleOpen,
    handleStart,
    handleClose,
    showMessage,
  };
}
