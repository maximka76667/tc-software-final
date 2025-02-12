const API_BASE_URL = "http://localhost:3001/api";

// POST /command
// Sends a command to a server to be executed
// Returns Response Promise to be handled later
const sendCommand = async (command: string) => {
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
};

export { sendCommand };
