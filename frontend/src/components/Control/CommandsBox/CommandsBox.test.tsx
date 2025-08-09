// CommandsBox.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import CommandsBox from "./CommandsBox";

// Mock the commands constant
vi.mock("../../../lib/consts", () => ({
  commands: ["start", "stop", "reset"],
}));

// Mock the CommandButton to simplify interaction testing
vi.mock("../CommandButton/CommandButton", () => ({
  default: ({
    command,
    sendCommand,
  }: {
    command: string;
    sendCommand: (msg: string) => void;
  }) => <button onClick={() => sendCommand(command)}>{command}</button>,
}));

describe("CommandsBox", () => {
  it("renders all command buttons", () => {
    const mockSendCommand = vi.fn();

    render(<CommandsBox sendCommand={mockSendCommand} />);

    // Ensure all commands are rendered
    expect(screen.getByText("start")).toBeInTheDocument();
    expect(screen.getByText("stop")).toBeInTheDocument();
    expect(screen.getByText("reset")).toBeInTheDocument();
  });

  it("calls sendCommand when a button is clicked", () => {
    const mockSendCommand = vi.fn();

    render(<CommandsBox sendCommand={mockSendCommand} />);

    fireEvent.click(screen.getByText("stop"));
    expect(mockSendCommand).toHaveBeenCalledWith("stop");
    expect(mockSendCommand).toHaveBeenCalledTimes(1);
  });
});
