// Reconnect.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { useWebSocketStore } from "../../../store";
import Reconnect from "./Reconnect";

// Mock the store module
vi.mock("../../../store", () => ({
  useWebSocketStore: vi.fn(),
}));

describe("Reconnect", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders message when there is an error", () => {
    (
      useWebSocketStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation((selector: any) =>
      selector({
        error: true,
        isFaultConfirmed: false,
      })
    );

    render(<Reconnect />);
    expect(
      screen.getByText(/Connection lost\. Try to reconnect/i)
    ).toBeInTheDocument();
  });

  it("renders message when fault is confirmed", () => {
    (
      useWebSocketStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation((selector: any) =>
      selector({
        error: false,
        isFaultConfirmed: true,
      })
    );

    render(<Reconnect />);
    expect(
      screen.getByText(/Connection lost\. Try to reconnect/i)
    ).toBeInTheDocument();
  });

  it("renders nothing when no error or fault", () => {
    (
      useWebSocketStore as unknown as ReturnType<typeof vi.fn>
    ).mockImplementation((selector: any) =>
      selector({
        error: false,
        isFaultConfirmed: false,
      })
    );

    render(<Reconnect />);
    expect(
      screen.queryByText(/Connection lost\. Try to reconnect/i)
    ).not.toBeInTheDocument();
  });
});
