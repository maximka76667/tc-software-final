import { useEffect, useState } from "react";
import useIntervalIdStore from "../store";

function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { intervalId } = useIntervalIdStore();

  useEffect(() => {
    if (intervalId) {
      const eventSource = new EventSource(url);

      // Handle incoming data
      eventSource.onmessage = (event) => {
        const newData = JSON.parse(event.data);
        setData(newData);
      };

      // Handle errors
      eventSource.onerror = () => {
        setError("Connection lost. Trying to reconnect...");
        eventSource.close();
      };

      // Cleanup when component unmounts
      return () => eventSource.close();
    } else {
      fetch("http://localhost:3001/api/data", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => res.json())
        .then((data) => setData(data))
        .catch((error) => setError(error));
    }
  }, [url]);

  return { data, error };
}

export default useData;
