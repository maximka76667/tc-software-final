const API_BASE_URL = "http://localhost:3000";

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_: unknown) {
    return new Response(JSON.stringify({ error: "Failed to send command" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export const fetchKeepAlive = async (endpoint: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Ping failed");
    const json = await res.json();
    return json;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_: unknown) {
    return new Response(JSON.stringify({ error: "Failed to send command" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};

export { sendCommand };
