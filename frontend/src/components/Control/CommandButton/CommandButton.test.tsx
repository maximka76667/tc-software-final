import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import CommandButton from "./CommandButton";
const { useWebSocketStore } = await import("../../../store");

// Mock Zustand store
vi.mock("../../../store", () => ({
  useWebSocketStore: vi.fn(),
}));

// Mock utils
vi.mock("../../../lib/utils", () => ({
  capitalizeWords: (str: string) =>
    str
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" "),
}));

// Mock stateTransitions
vi.mock("../../../lib/consts", () => ({
  stateTransitions: {
    initial: ["precharge"],
    precharging: [],
    precharged: ["discharge", "start levitation"],
    levitating: [],
    levitated: ["stop levitation"],
    levitation_stopping: [],
    discharging: [],
  },
}));

describe("CommandButton", () => {
  const renderButton = (storeValues: any, command = "precharge") => {
    (useWebSocketStore as any).mockImplementation((selector: any) =>
      selector(storeValues)
    );

    const sendCommand = vi.fn();
    render(<CommandButton command={command} sendCommand={sendCommand} />);
    return sendCommand;
  };

  it("should enable button when command is allowed in current state", () => {
    renderButton({
      error: false,
      isLoading: false,
      currentState: "initial",
      isFaultConfirmed: false,
    });

    const button = screen.getByRole("button", { name: "Precharge" });
    expect(button).toBeEnabled();
  });

  it("should disable button when isLoading is true", () => {
    renderButton({
      error: false,
      isLoading: true,
      currentState: "initial",
      isFaultConfirmed: false,
    });

    const button = screen.getByRole("button", { name: "Precharge" });
    expect(button).toBeDisabled();
  });

  it("should disable button when error is true", () => {
    renderButton({
      error: true,
      isLoading: false,
      currentState: "initial",
      isFaultConfirmed: false,
    });

    const button = screen.getByRole("button", { name: "Precharge" });
    expect(button).toBeDisabled();
  });

  it("should disable button when isFaultConfirmed is true", () => {
    renderButton({
      error: false,
      isLoading: false,
      currentState: "initial",
      isFaultConfirmed: true,
    });

    const button = screen.getByRole("button", { name: "Precharge" });
    expect(button).toBeDisabled();
  });

  it("should disable button when command is not allowed in current state", () => {
    renderButton(
      {
        error: false,
        isLoading: false,
        currentState: "precharged",
        isFaultConfirmed: false,
      },
      "precharge"
    );

    const button = screen.getByRole("button", { name: "Precharge" });
    expect(button).toBeDisabled();
  });

  it("should call sendCommand when button is clicked", () => {
    const sendCommand = renderButton({
      error: false,
      isLoading: false,
      currentState: "initial",
      isFaultConfirmed: false,
    });

    const button = screen.getByRole("button", { name: "Precharge" });
    fireEvent.click(button);
    expect(sendCommand).toHaveBeenCalledWith("precharge");
  });
});
