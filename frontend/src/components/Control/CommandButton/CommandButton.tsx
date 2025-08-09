import { useWebSocketStore } from "../../../store";
import { stateTransitions } from "../../../lib/consts";
import { Command } from "../../../lib/definitions";
import { capitalizeWords } from "../../../lib/utils";
import { useShallow } from "zustand/react/shallow";

interface CommandButtonProps {
  command: string;
  sendCommand: (message: string) => void;
}

const CommandButton = ({ command, sendCommand }: CommandButtonProps) => {
  const { error, isLoading, currentState, isFaultConfirmed } =
    useWebSocketStore(
      useShallow((state) => ({
        error: state.error,
        isLoading: state.isLoading,
        currentState: state.currentState,
        isFaultConfirmed: state.isFaultConfirmed,
      }))
    );

  const isDisabled =
    isLoading ||
    error ||
    isFaultConfirmed ||
    !stateTransitions[currentState].includes(command as Command);

  return (
    <button
      disabled={isDisabled}
      className="w-1/3"
      onClick={() => sendCommand(command)}
    >
      {capitalizeWords(command)}
    </button>
  );
};

export default CommandButton;
