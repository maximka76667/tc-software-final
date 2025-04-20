import { useCallback, useEffect, useRef, useState } from "react";
import { FAULT_INTERVAL, PING_INTERVAL, PING_TIMEOUT } from "../lib/consts";
import { fetchKeepAlive } from "../lib/api";
import { useWebSocketStore } from "../store";

interface useKeepAliveProps {
  sendCommand: (command: string) => void;
}

const useKeepAlive = ({ sendCommand }: useKeepAliveProps) => {
  const { isFaultConfirmed, setIsFaultConfirmed } = useWebSocketStore();

  const [isFault, setIsFault] = useState(false);
  const [isPingFailed, setIsPingFailed] = useState(false);

  const pongTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const faultIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Called when pong is not received in time
  const handlePongTimeout = useCallback(() => {
    console.warn("Pong not received in time. Triggering fault.");
    if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
    setIsFault(true);
    setIsPingFailed(true);
  }, []);

  const sendPing = useCallback(async () => {
    if (pongTimeoutRef.current) clearTimeout(pongTimeoutRef.current);

    pongTimeoutRef.current = setTimeout(handlePongTimeout, PING_TIMEOUT);

    try {
      const start = performance.now();
      const res = await fetchKeepAlive("ping");

      const end = performance.now();
      console.log(`Ping recieved in ${(end - start).toFixed(1)} ms`);

      if (res?.pong) {
        clearTimeout(pongTimeoutRef.current!);
        pongTimeoutRef.current = null;
      } else {
        console.warn("Ping response invalid. Marking as fault.");
        setIsFault(true);
        setIsPingFailed(true);
      }
    } catch (error) {
      console.error("Ping failed:", error);
      setIsFault(true);
      setIsPingFailed(true);
    }
  }, []);

  useEffect(() => {
    pingIntervalRef.current = setInterval(sendPing, PING_INTERVAL);
    return () => {
      if (pingIntervalRef.current) clearInterval(pingIntervalRef.current);
      if (pongTimeoutRef.current) clearTimeout(pongTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (isFault && !isFaultConfirmed) {
      faultIntervalRef.current = setInterval(() => {
        sendCommand("fault");
      }, FAULT_INTERVAL);
    }

    if ((isFaultConfirmed || isPingFailed) && faultIntervalRef.current) {
      clearInterval(faultIntervalRef.current);
      faultIntervalRef.current = null;

      if (!isFaultConfirmed) {
        setIsFaultConfirmed(true);
      }
    }

    return () => {
      if (faultIntervalRef.current) clearInterval(faultIntervalRef.current);
    };
  }, [isFault, isFaultConfirmed, isPingFailed]);

  return { isFault };
};

export default useKeepAlive;
