import { useEffect, useRef, useState } from "react";
import { FAULT_INTERVAL, PING_INTERVAL, PING_TIMEOUT } from "../lib/consts";
import { fetchKeepAlive } from "../lib/api";

interface useKeepAliveProps {
  sendCommand: (command: string) => void;
  isFaultConfirmed: boolean;
}

const useKeepAlive = ({ sendCommand, isFaultConfirmed }: useKeepAliveProps) => {
  // Ping pong states
  const [isFault, setIsFault] = useState(false);
  const pongTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
      console.log("Sending ping...");

      const res = await fetchKeepAlive("ping");

      if (res?.pong) {
        console.log("Pong received!");
        if (pongTimeoutRef.current) {
          clearTimeout(pongTimeoutRef.current);
          pongTimeoutRef.current = null;
        }
      } else {
        console.log("Ping is false");
      }
    } catch (e) {
      console.error("Ping failed:", e);
    }
  };

  // Clear pong timeout since we got a response
  if (pongTimeoutRef.current) {
    clearTimeout(pongTimeoutRef.current);
    pongTimeoutRef.current = null;
  }

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

      if (isFaultConfirmed) {
        clearInterval(intervalId);
      }
    }

    return () => clearInterval(intervalId);
  }, [isFault, isFaultConfirmed]);

  return { isFault };
};

export default useKeepAlive;
