// Utility function: returns a random number between min and max
export function getRandomInRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

// Sends a random data packet to the backend with specified ranges:
// Elevation: 0–30, Velocity: 0–30, Voltage: 0–400, Current: 0–100.
export async function sendRandomData() {
  const payload = {
    elevation: parseFloat(getRandomInRange(0, 30).toFixed(2)),
    velocity: parseFloat(getRandomInRange(0, 30).toFixed(2)),
    voltage: parseFloat(getRandomInRange(0, 400).toFixed(2)),
    current: parseFloat(getRandomInRange(0, 100).toFixed(2)),
  };

  try {
    await fetch("http://localhost:3001/api/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    // No UI update here—the SSE on the control page will handle new data.
  } catch (error) {
    console.error("Error sending random data:", error);
  }
}
