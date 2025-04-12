import { memo } from "react";
import Charts from "../components/Control/Charts";
import MessagesBox from "../components/Control/MessagesBox";
import StatusBox from "../components/Control/StatusBox";
import { useWebSocketStore } from "../store";
import Reconnect from "../components/Control/Reconnect";
import CommandsBox from "../components/Control/CommandsBox";
import CurrentState from "../components/Control/CurrentState";
import { useShallow } from "zustand/react/shallow";

interface ControlProps {
  reconnect: () => void;
  sendCommand: (message: string) => void;
}

const Control = ({
  // reconnect,
  sendCommand,
}: ControlProps) => {
  const { data } = useWebSocketStore(
    useShallow((state) => ({ data: state.data }))
  );

  return (
    <div className="flex w-full">
      <div className="w-3/5">
        <Charts data={data as unknown as { [key: string]: number }} />
      </div>

      <div className="w-2/5 sticky top-0 py-15 h-[800px]">
        {/* WebSocket connection status */}
        <StatusBox />

        {/* Reconnect block */}
        <Reconnect />

        {/* Command block */}
        <CommandsBox sendCommand={sendCommand} />

        {/* Current state block */}
        <CurrentState />

        <MessagesBox />
      </div>
    </div>
  );
};

export default memo(Control);
