import { useEffect, useCallback, useRef } from "react";
import { Message, State, Telemetry } from "../lib/definitions";
import { useTelemetryStore, useWebSocketStore } from "../store";

interface useWebSocketProps {
  url: string;
  onMessage: (message: Message) => void;
  onTelemetryData: (state: State) => void;
  onError: (message: string) => void;
  onConnectionError: () => void;
  onOpen: () => void;
  onStart: () => void;
  onClose: () => void;
}

function useWebSocket({
  url,
  onMessage,
  onTelemetryData,
  onConnectionError,
  // onError,
  onOpen,
  onStart,
  onClose,
}: useWebSocketProps) {
  // const [data, setData] = useState<T | null>(null);
  // const [error, setError] = useState<boolean>(false);
  // const [isLoading, setIsLoading] = useState(false);

  // const [isFaultConfirmed, setIsFaultConfirmed] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);

  const {
    data,
    // setData,
    error,
    setError,
    isLoading,
    setIsLoading,
    isFaultConfirmed,
    setIsFaultConfirmed,
  } = useWebSocketStore();

  const { addArrayTelemetryData } = useTelemetryStore();

  const sendCommand = useCallback((command: string) => {
    webSocketRef.current?.send(JSON.stringify({ id: command }));
  }, []);

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
        addArrayTelemetryData(data as Telemetry);
        onTelemetryData(packet["current_state"] as State);
      } else if (id === "message") {
        const { message, severity } = data;
        onMessage({ message, severity } as Message);
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
