import { memo } from "react";
import { Telemetry } from "../lib/definitions";
import ChartsBox from "../components/ChartsBox";

interface ControlProps {
  data: Telemetry | null;
  error: boolean;
  isLoading: boolean;
  reconnect: () => void;
  sendCommand: (message: string) => void;
}

const Control = ({
  data,
  isLoading,
  error,
  reconnect,
  sendCommand,
}: ControlProps) => {
  return (
    <div className="flex w-full">
      <div className="w-1/2">
        <ChartsBox data={data as unknown as { [key: string]: number }} />
      </div>

      <div className="w-1/2 sticky top-0 h-[500px] py-15">
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
          <div>
            <p>Connection lost. Try to reconnect</p>
            <button onClick={() => reconnect()}>Retry</button>
          </div>
        )}

        <div className="flex flex-wrap mt-8 w-full justify-center gap-3">
          {/* {isSimulationRunning ? (
          <button onClick={() => sendCommand("stop")}>Stop</button>
        ) : (
          <button onClick={() => sendCommand("start")}>Start</button>
        )} */}
          {/* <button
          style={{ backgroundColor: "#d20", color: "#fff" }}
          onClick={() => sendCommand("stop")}
        >
          Emergency Stop
        </button> */}
          <button className="w-1/3" onClick={() => sendCommand("precharge")}>
            Precharge
          </button>
          <button className="w-1/3" onClick={() => sendCommand("discharge")}>
            Discharge
          </button>
          <button
            className="w-1/3"
            onClick={() => sendCommand("start levitation")}
          >
            Start Levitation
          </button>
          <button
            className="w-1/3"
            onClick={() => sendCommand("stop levitation")}
          >
            Stop Levitation
          </button>
          <button className="w-1/3" onClick={() => sendCommand("start motor")}>
            Start Motor
          </button>
          <button className="w-1/3" onClick={() => sendCommand("stop motor")}>
            Stop Motor
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Control);
