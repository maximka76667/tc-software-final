import { useEffect, useState, useCallback, useRef } from "react";

interface useWebSocketProps<T> {
  url: string;
  onMessage: (statusCode: number, message: string) => void;
  onTelemetryMessage: (data: T) => void;
  onError: (message: string) => void;
  onConnectionError: () => void;
  onSimulationChange: (isSimulationRunning: boolean) => void;
  onOpen: () => void;
  onStart: () => void;
  onClose: () => void;
}

function useWebSocket<T>({
  url,
  onMessage,
  onTelemetryMessage,
  onConnectionError,
  onError,
  onOpen,
  onStart,
  onClose,
  onSimulationChange,
}: useWebSocketProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);

  const connect = useCallback(() => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    setIsLoading(true);
    setError(false);
    webSocketRef.current = new WebSocket(url);

    onStart();

    webSocketRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);

      const { ok, type } = newData;

      if (!ok) {
        onError(newData.error);
        return;
      }

      if (type === "telemetry") {
        setData(newData);
        onTelemetryMessage(newData);
      } else if (type === "simulation") {
        onSimulationChange(newData.isSimulationRunning);
      } else {
        const { statusCode, message } = newData;
        onMessage(statusCode, message);
      }
      setError(false);
    };

    webSocketRef.current.onerror = () => {
      setError(true);
      setIsLoading(false);
      onConnectionError();
      webSocketRef.current?.close();
      webSocketRef.current = null;
    };

    webSocketRef.current.onopen = () => {
      setIsLoading(false);
      onOpen();
    };
  }, [onError, onMessage, onOpen, onStart, url]);

  const sendCommand = (command: string) => {
    webSocketRef.current?.send(JSON.stringify({ command }));
  };

  useEffect(() => {
    connect();

    return () => {
      if (webSocketRef.current?.readyState === 1) {
        webSocketRef.current?.close();
        onClose();
      }
    };
  }, []);

  return { data, error, isLoading, reconnect: connect, sendCommand };
}

export default useWebSocket;
