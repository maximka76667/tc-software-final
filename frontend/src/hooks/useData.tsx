import { useEffect, useState } from "react";
import { useTelemetryStore } from "../store";

function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { addElevation, addVelocity, addCurrent, addVoltage } =
    useTelemetryStore();

  useEffect(() => {
    const eventSource = new EventSource(url);

    // Handle incoming data
    eventSource.onmessage = (event) => {
      const newData = JSON.parse(event.data);
      setData(newData);
      addVelocity(newData.velocity);
      addVoltage(newData.voltage);
      addCurrent(newData.current);
      addElevation(newData.elevation);
    };

    // Handle errors
    eventSource.onerror = () => {
      setError("Connection lost. Trying to reconnect...");
      eventSource.close();
    };

    // Cleanup when component unmounts
    return () => eventSource.close();
  }, [addCurrent, addElevation, addVelocity, addVoltage, url]);

  return {
    data,
    error,
  };
}

export default useData;
