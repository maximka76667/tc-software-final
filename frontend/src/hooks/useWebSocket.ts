import { useEffect, useCallback, useRef } from "react";
import { Message, State, Telemetry } from "../lib/definitions";
import { useTelemetryStore, useWebSocketStore } from "../store";
import { useShallow } from "zustand/shallow";

interface useWebSocketProps {
  url: string;
  onMessage: (message: Message) => void;
  onTelemetryExtras: (state: State, angles: [number, number, number]) => void;
  onError: (message: string) => void;
  onConnectionError: () => void;
  onOpen: () => void;
  onStart: () => void;
  onClose: () => void;
}

function useWebSocket({
  url,
  onMessage,
  onTelemetryExtras,
  onConnectionError,
  // onError,
  onOpen,
  onStart,
  onClose,
}: useWebSocketProps) {
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
  } = useWebSocketStore(
    useShallow((state) => ({
      data: state.data,
      error: state.error,
      setError: state.setError,
      isLoading: state.isLoading,
      setIsLoading: state.setIsLoading,
      isFaultConfirmed: state.isFaultConfirmed,
      setIsFaultConfirmed: state.setIsFaultConfirmed,
    }))
  );

  const addArrayTelemetryData = useTelemetryStore(
    (state) => state.addArrayTelemetryData
  );

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
        onTelemetryExtras(
          packet["current_state"] as State,
          packet["angles"] as [number, number, number]
        );
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
