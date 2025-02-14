const API_BASE_URL = "http://localhost:3001/api";

// POST /command
// Sends a command to a server to be executed
// Returns Response Promise to be handled later
const sendCommand = async (command: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/command`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        command,
      }),
    });

    return res;
  } catch (_: unknown) {
    return new Response(JSON.stringify({ error: "Failed to send command" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { sendCommand };
