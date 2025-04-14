import { API_BASE_URL } from "./consts";

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
