import { useEffect, useState, useCallback, useRef } from "react";

interface useEventSourceProps<T> {
  url: string;
  onMessage: (data: T) => void;
  onError: () => void;
  onOpen: () => void;
  onStart: () => void;
  onClose: () => void;
}

function useEventSource<T>({
  url,
  onMessage,
  onError,
  onOpen,
  onStart,
  onClose,
}: useEventSourceProps<T>) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<boolean>(false);

  const eventSourceRef = useRef<EventSource | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setError(false);
    eventSourceRef.current = new EventSource(url);

    onStart();

    eventSourceRef.current.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
      onMessage(newData);
      setError(false);
    };

    eventSourceRef.current.onerror = () => {
      setError(true);
      onError();
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };

    eventSourceRef.current.onopen = () => {
      onOpen();
    };
  }, [onError, onMessage, onOpen, onStart, url]);

  useEffect(() => {
    connect();

    return () => {
      eventSourceRef.current?.close();
      onClose();
    };
  }, []);

  return { data, error, reconnect: connect };
}

export default useEventSource;
