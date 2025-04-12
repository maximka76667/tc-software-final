import React, { memo } from "react";
import { commands } from "../../lib/consts";
import CommandButton from "./CommandButton";

interface CommandsBoxProps {
  sendCommand: (message: string) => void;
}

const CommandsBox = ({ sendCommand }: CommandsBoxProps) => {
  return (
    <div className="flex flex-wrap mt-8 w-full justify-center gap-2">
      {commands.map((command) => (
        <CommandButton
          key={command}
          command={command}
          sendCommand={sendCommand}
        />
      ))}
    </div>
  );
};

export default memo(CommandsBox);
