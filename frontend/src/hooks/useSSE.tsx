import { useEffect, useState, useCallback, useRef } from "react";
import { useTelemetryStore } from "../store";
import { closeSnackbar, useSnackbar } from "notistack";

function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<boolean>(false);

  const eventSourceRef = useRef<EventSource | null>(null);
  const { addElevation, addVelocity, addCurrent, addVoltage } =
    useTelemetryStore();
  const { enqueueSnackbar } = useSnackbar();

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setError(false);
    eventSourceRef.current = new EventSource(url);

    const connectingSnackbarKey = enqueueSnackbar("Connecting...", {
      variant: "info",
      persist: true,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });

    eventSourceRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
      addVelocity(newData.velocity);
      addVoltage(newData.voltage);
      addCurrent(newData.current);
      addElevation(newData.elevation);
      setError(false);
    };

    eventSourceRef.current.onerror = () => {
      setError(true);
      enqueueSnackbar("Error on connection!", {
        preventDuplicate: true,
        variant: "error",
        persist: true,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
      closeSnackbar(connectingSnackbarKey);
    };

    eventSourceRef.current.onopen = () => {
      enqueueSnackbar("Connected successfully!", {
        preventDuplicate: true,
        variant: "success",
        autoHideDuration: 3000,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
      closeSnackbar(connectingSnackbarKey);
    };
  }, [addCurrent, addElevation, addVelocity, addVoltage, url]);

  useEffect(() => {
    connect();

    return () => {
      eventSourceRef.current?.close();
      closeSnackbar();
    };
  }, []);

  return { data, error, reconnect: connect };
}

export default useData;
