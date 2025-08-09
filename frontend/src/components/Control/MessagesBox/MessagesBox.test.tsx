import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import MessagesBox from "./MessagesBox";
import { useWebSocketStore } from "../../../store";

// Mock zustand store
vi.mock("../../../store", () => {
  return {
    useWebSocketStore: vi.fn(),
  };
});

describe("MessagesBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Mock messages data
    (useWebSocketStore as unknown as Mock).mockImplementation(() => ({
      messages: [
        { message: "First message", severity: "info", time: "12:00" },
        { message: "Second message", severity: "error", time: "12:01" },
      ],
    }));

    // Mock scrollHeight and scrollTop on the div
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 500,
    });

    Object.defineProperty(HTMLElement.prototype, "scrollTop", {
      configurable: true,
      writable: true,
      value: 0,
    });
  });

  it("renders messages and scrolls to bottom", () => {
    render(<MessagesBox />);

    expect(screen.getByText("[12:00]")).toBeInTheDocument();
    expect(screen.getByText("First message")).toBeInTheDocument();
    expect(screen.getByText("Second message")).toBeInTheDocument();

    // After render, scrollTop should be updated to scrollHeight
    const container =
      screen.getByRole("region", { hidden: true }) ||
      screen.getByText("[12:00]").parentElement?.parentElement;
    expect(container?.scrollTop).toBe(500);
  });
});
