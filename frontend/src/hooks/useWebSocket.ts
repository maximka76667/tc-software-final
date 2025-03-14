import { useEffect, useState, useCallback, useRef } from "react";
import { FAULT_INTERVAL, PING_INTERVAL, PING_TIMEOUT } from "../lib/consts";

interface useWebSocketProps {
  url: string;
  onMessage: (statusCode: number, message: string) => void;
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
  onError,
  onOpen,
  onStart,
  onClose,
}: useWebSocketProps) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);

  // Ping pong states
  const [isFault, setIsFault] = useState(false);
  const pongTimeoutRef = useRef<Timeout | null>(null);

  // Starts sending fault command if timeout was exceeded
  const handlePongExceedsTimeout = (pingIntervalId: number) => {
    console.log("Pong not received, marking as fault...");
    clearInterval(pingIntervalId);
    setIsFault(true);
  };

  const setupTimeout = (pingIntervalId: number) => {
    // Set a timeout to check if pong is received
    pongTimeoutRef.current = setTimeout(
      () => handlePongExceedsTimeout(pingIntervalId),
      PING_TIMEOUT
    );
  };

  // Sends ping and setups timeout
  const establishSendingPings = (pingIntervalId: number) => {
    if (webSocketRef.current?.readyState === WebSocket.OPEN) {
      console.log("Sending ping...");
      sendCommand("ping");

      setupTimeout(pingIntervalId);
    }
  };

  const sendCommand = (command: string) => {
    webSocketRef.current?.send(JSON.stringify({ id: command }));
  };

  const connect = useCallback(() => {
    if (webSocketRef.current) {
      webSocketRef.current.close();
    }

    setIsLoading(true);
    setIsFault(false);
    setError(false);
    webSocketRef.current = new WebSocket(url);

    onStart();

    webSocketRef.current.onmessage = (event) => {
      const packet = JSON.parse(event.data);

      const { id, data } = packet;

      if (id === "data") {
        setData(data);
        // onTelemetryMessage(data);
      } else if (id === "info") {
        const { severity } = data;
        onMessage(201, severity);
      } else if (id === "pong") {
        // Clear pong timeout since we got a response
        if (pongTimeoutRef.current) {
          clearTimeout(pongTimeoutRef.current);
          pongTimeoutRef.current = null;
        }
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

      // Start sending pings
      const pingIntervalId = setInterval(
        () => establishSendingPings(pingIntervalId),
        PING_INTERVAL
      );

      return () => clearInterval(pingIntervalId);
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

  useEffect(() => {
    let intervalId: number;
    if (isFault) {
      onError("Ping wasn't received!");
      setError(true);
      intervalId = setInterval(() => sendCommand("fault"), FAULT_INTERVAL);
    } else {
      setError(false);
    }

    return () => clearInterval(intervalId);
  }, [isFault]);

  return { data, error, isLoading, reconnect: connect, sendCommand };
}

export default useWebSocket;
