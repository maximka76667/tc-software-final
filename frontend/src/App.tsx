import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [error, setError] = useState("");
  const [data, setData] = useState<{
    elevation: number;
    velocity: number;
    voltage: number;
    current: number;
  } | null>(null);

  useEffect(() => {
    // Establish an SSE connection to receive sensor data.
    const eventSource = new EventSource("http://localhost:3000/api/stream");
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setData(data);
    };

    // Handle errors
    eventSource.onerror = () => {
      setError("Connection lost. Trying to reconnect...");
      eventSource.close();
    };

    // Cleanup when component unmounts
    return () => eventSource.close();
  });

  return (
    <div>
      <p>{data?.elevation || "N/A"}</p>
      <p>{data?.velocity || "N/A"}</p>
      <p>{data?.voltage || "N/A"}</p>
      <p>{data?.current || "N/A"}</p>
      <p>{error}</p>
    </div>
  );
}

export default App;
