import { useEffect, useState, useCallback, useRef } from "react";

interface useWebSocketProps {
  url: string;
  onMessage: (statusCode: number, message: string) => void;
  // onTelemetryMessage: (data: T) => void;
  // onError: (message: string) => void;
  onConnectionError: () => void;
  onOpen: () => void;
  onStart: () => void;
  onClose: () => void;
}

function useWebSocket<T>({
  url,
  onMessage,
  // onTelemetryMessage,
  onConnectionError,
  // onError,
  onOpen,
  onStart,
  onClose,
}: useWebSocketProps) {
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
      const packet = JSON.parse(event.data);

      const { id, data } = packet;

      // if (!ok) {
      //   onError(newData.error);
      //   return;
      // }

      // if (type === "telemetry") {
      //   setData(newData);
      //   onTelemetryMessage(newData);
      // } else if (type === "simulation") {
      //   onSimulationChange(newData.isSimulationRunning);
      //   const { statusCode, message } = newData;
      //   onMessage(statusCode, message);
      // } else {
      //   const { statusCode, message } = newData;
      //   onMessage(statusCode, message);
      // }
      // setError(false);

      if (id === "data") {
        setData(data);
        // onTelemetryMessage(data);
      } else if (id === "info") {
        const { severity } = data;
        onMessage(201, severity);
      }
      // else if (type === "simulation") {
      //   onSimulationChange(newData.isSimulationRunning);
      //   const { statusCode, message } = newData;
      //   onMessage(statusCode, message);
      // }
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

    webSocketRef.current.onclose = () => {
      setError(true);
      setIsLoading(false);
      onClose();
    };
  }, [onClose, onConnectionError, onMessage, onOpen, onStart, url]);

  const sendCommand = (command: string) => {
    webSocketRef.current?.send(JSON.stringify({ id: command }));
  };

  useEffect(() => {
    connect();

    return () => {
      if (webSocketRef.current?.readyState === 1) {
        webSocketRef.current?.close();
        onClose();
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error, isLoading, reconnect: connect, sendCommand };
}

export default useWebSocket;
