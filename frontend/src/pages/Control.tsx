import { memo } from "react";
import { Telemetry } from "../lib/definitions";
import Charts from "../components/Charts";
import { capitalizeWords } from "../lib/utils";

interface ControlProps {
  data: Telemetry | null;
  error: boolean;
  isLoading: boolean;
  reconnect: () => void;
  sendCommand: (message: string) => void;
}

const commands = [
  "precharge",
  "discharge",
  "start levitation",
  "stop levitation",
  "start motor",
  "stop motor",
];

const Control = ({
  data,
  isLoading,
  error,
  // reconnect,
  sendCommand,
}: ControlProps) => {
  console.log(error);
  return (
    <div className="flex w-full">
      <div className="w-3/5">
        <Charts data={data as unknown as { [key: string]: number }} />
      </div>

      <div className="w-2/5 sticky top-0 h-[500px] py-15">
        <p className="text-center">
          Status:{" "}
          {error ? (
            <span style={{ color: "red" }}>Offline</span>
          ) : isLoading ? (
            <span style={{ color: "grey" }}>Connecting...</span>
          ) : (
            <span style={{ color: "green" }}>Online</span>
          )}
        </p>

        {/* Reconnect block */}
        {error && (
          <div className="text-center m-2">
            <p>Connection lost. Try to reconnect</p>
            {/* <button onClick={() => reconnect()}>Retry</button> */}
          </div>
        )}

        <div className="flex flex-wrap mt-8 w-full justify-center gap-2">
          {commands.map((command) => (
            <button
              disabled={isLoading || error}
              className="w-1/3"
              onClick={() => sendCommand(command)}
            >
              {capitalizeWords(command)}
            </button>
          ))}
          {/* <button
            disabled={error}
            className="w-1/3"
            onClick={() => sendCommand("precharge")}
          >
            Precharge
          </button>
          <button
            disabled={error}
            className="w-1/3"
            onClick={() => sendCommand("discharge")}
          >
            Discharge
          </button>
          <button
            disabled={error}
            className="w-1/3"
            onClick={() => sendCommand("start levitation")}
          >
            Start Levitation
          </button>
          <button
            disabled={error}
            className="w-1/3"
            onClick={() => sendCommand("stop levitation")}
          >
            Stop Levitation
          </button>
          <button
            disabled={error}
            className="w-1/3"
            onClick={() => sendCommand("start motor")}
          >
            Start Motor
          </button>
          <button
            disabled={error}
            className="w-1/3"
            onClick={() => sendCommand("stop motor")}
          >
            Stop Motor
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default memo(Control);
