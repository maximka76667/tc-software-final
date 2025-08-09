import { render, screen } from "@testing-library/react";
import { describe, it, vi, beforeEach, expect, Mock } from "vitest";
import { useWebSocketStore } from "../../../store";
import StatusBox from "./StatusBox";

vi.mock("../../../store", () => ({
  useWebSocketStore: vi.fn(),
}));

describe("StatusBox", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders Offline when error is true", () => {
    (useWebSocketStore as unknown as Mock).mockReturnValue({
      error: true,
      isLoading: false,
      isFaultConfirmed: false,
    });

    render(<StatusBox />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
    expect(screen.getByText("Offline")).toHaveClass("text-red-700");
  });

  it("renders Offline when fault is confirmed", () => {
    (useWebSocketStore as unknown as Mock).mockReturnValue({
      error: false,
      isLoading: false,
      isFaultConfirmed: true,
    });

    render(<StatusBox />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });

  it("renders Connecting... when loading", () => {
    (useWebSocketStore as unknown as Mock).mockReturnValue({
      error: false,
      isLoading: true,
      isFaultConfirmed: false,
    });

    render(<StatusBox />);
    expect(screen.getByText("Connecting...")).toBeInTheDocument();
  });

  it("renders Online when no errors and not loading", () => {
    (useWebSocketStore as unknown as Mock).mockReturnValue({
      error: false,
      isLoading: false,
      isFaultConfirmed: false,
    });

    render(<StatusBox />);
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("Online")).toHaveClass("text-green-700");
  });

  it("renders Offline when all states are true", () => {
    (useWebSocketStore as unknown as Mock).mockReturnValue({
      error: true,
      isLoading: true,
      isFaultConfirmed: true,
    });

    render(<StatusBox />);
    expect(screen.getByText("Offline")).toBeInTheDocument();
  });
});
