// CurrentState.test.tsx
import { render, screen } from "@testing-library/react";
import { Mock, vi } from "vitest";
import CurrentState from "./CurrentState";
import { useWebSocketStore } from "../../../store";
import { capitalizeWords } from "../../../lib/utils";

// Mock the Zustand store
vi.mock("../../../store", () => ({
  useWebSocketStore: vi.fn(),
}));

// Mock the capitalizeWords util
vi.mock("../../../lib/utils", () => ({
  capitalizeWords: vi.fn((str) => str),
}));

describe("CurrentState", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the current state from the store", () => {
    // Arrange — mock Zustand state
    (useWebSocketStore as unknown as Mock).mockImplementation((selector) =>
      selector({ currentState: "idle" })
    );

    // Also mock capitalizeWords to confirm it is called
    (capitalizeWords as Mock).mockImplementation((str) => `CAP:${str}`);

    // Act
    render(<CurrentState />);

    // Assert
    expect(capitalizeWords).toHaveBeenCalledWith("idle");
    expect(screen.getByText(/Current state:/i)).toBeInTheDocument();
    expect(screen.getByText("CAP:idle")).toBeInTheDocument();
  });

  it("renders capitalized state when capitalizeWords transforms it", () => {
    (useWebSocketStore as unknown as Mock).mockImplementation((selector) =>
      selector({ currentState: "running fast" })
    );

    (capitalizeWords as Mock).mockImplementation(() => "Running Fast");

    render(<CurrentState />);

    expect(screen.getByText("Running Fast")).toBeInTheDocument();
  });
});
