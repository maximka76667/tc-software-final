import { useEffect, useRef, useState } from "react";
import { FAULT_INTERVAL, PING_INTERVAL, PING_TIMEOUT } from "../lib/consts";
import { fetchKeepAlive } from "../lib/api";
import { useWebSocketStore } from "../store";

interface useKeepAliveProps {
  sendCommand: (command: string) => void;
}

const useKeepAlive = ({ sendCommand }: useKeepAliveProps) => {
  const { isFaultConfirmed, setIsFaultConfirmed } = useWebSocketStore();

  // Ping pong states
  const [isFault, setIsFault] = useState(false);
  const pongTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isPingFailed, setIsPingFailed] = useState(false);

  // Starts sending fault command if timeout was exceeded
  const handlePongExceedsTimeout = (pingIntervalId: NodeJS.Timeout) => {
    console.log("Pong not received, marking as fault...");
    clearInterval(pingIntervalId);
    setIsFault(true);
  };

  const setupTimeout = (pingIntervalId: NodeJS.Timeout) => {
    // Set a timeout to check if pong is received
    pongTimeoutRef.current = setTimeout(
      () => handlePongExceedsTimeout(pingIntervalId),
      PING_TIMEOUT
    );
  };

  // Sends ping and setups timeout
  const establishSendingPings = async (pingIntervalId: NodeJS.Timeout) => {
    try {
      setupTimeout(pingIntervalId);
      // console.log("Sending ping...");

      const start = Date.now();

      const res = await fetchKeepAlive("ping");

      const end = Date.now();
      console.log(`Elapsed: ${end - start} ms`);

      if (res?.pong) {
        // console.log("Pong received!");
        if (pongTimeoutRef.current) {
          clearTimeout(pongTimeoutRef.current);
          pongTimeoutRef.current = null;
        }
      } else {
        console.log("Ping is false");
        setIsFault(true);
        setIsPingFailed(true);
      }
    } catch (e) {
      console.error("Ping failed:", e);
      setIsFault(true);
      setIsPingFailed(true);
    }
  };

  useEffect(() => {
    // Start sending pings
    const pingIntervalId = setInterval(
      () => establishSendingPings(pingIntervalId),
      PING_INTERVAL
    );
    return () => clearInterval(pingIntervalId);
  }, []);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isFault && !isFaultConfirmed) {
      intervalId = setInterval(() => {
        sendCommand("fault");
      }, FAULT_INTERVAL);

      if (isFaultConfirmed || isPingFailed) {
        clearInterval(intervalId);
        if (!isFaultConfirmed) {
          setIsFaultConfirmed(true);
        }
      }
    }

    return () => clearInterval(intervalId);
  }, [isFault, isFaultConfirmed, isPingFailed]);

  return { isFault };
};

export default useKeepAlive;
