import { useEffect, useState, useCallback, useRef } from "react";

interface useWebSocketProps {
  url: string;
  onMessage: (message: string, severity?: number) => void;
  // onTelemetryMessage: (data: T) => void;
  onError: (message: string) => void;
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

  const [isFaultConfirmed, setIsFaultConfirmed] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);

  const sendCommand = (command: string) => {
    webSocketRef.current?.send(JSON.stringify({ id: command }));
  };

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

      if (id === "data") {
        setData(data);
        // onTelemetryMessage(data);
      } else if (id === "message") {
        const { message, severity = 5 } = data;
        onMessage(message, severity);
      } else if (id === "fault confirmed") {
        setIsFaultConfirmed(true);
      }
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

  return {
    data,
    error,
    isLoading,
    reconnect: connect,
    sendCommand,
    isFaultConfirmed,
  };
}

export default useWebSocket;
