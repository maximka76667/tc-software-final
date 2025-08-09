import { lazy, memo, Suspense } from "react";
import { useWebSocketStore } from "../store";

import { useShallow } from "zustand/react/shallow";
import SuspenseLoading from "../components/SuspenseLoading";

// Lazy load the components
const Charts = lazy(() => import("../components/Control/Charts/Charts"));
const MessagesBox = lazy(
  () => import("../components/Control/MessagesBox/MessagesBox")
);
const StatusBox = lazy(
  () => import("../components/Control/StatusBox/StatusBox")
);
const Reconnect = lazy(
  () => import("../components/Control/Reconnect/Reconnect")
);
const CommandsBox = lazy(
  () => import("../components/Control/CommandsBox/CommandsBox")
);
const CurrentState = lazy(
  () => import("../components/Control/CurrentState/CurrentState")
);

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
        <Suspense fallback={<SuspenseLoading />}>
          <StatusBox />
        </Suspense>

        {/* Reconnect block */}
        <Reconnect />

        {/* Command block */}
        <CommandsBox sendCommand={sendCommand} />

        {/* Current state block */}
        <CurrentState />

        {/* Messages */}
        <MessagesBox />
      </div>
    </div>
  );
};

export default memo(Control);
