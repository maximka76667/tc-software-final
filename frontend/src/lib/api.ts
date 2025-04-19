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
    return await res.json();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (_: unknown) {
    return { error: "Failed to send command" };
  }
};
