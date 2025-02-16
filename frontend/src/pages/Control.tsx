import { memo } from "react";
import { LineChart } from "@mui/x-charts";
import { arrayUntil } from "../lib/utils";
import { Telemetry } from "../lib/definitions";
import { useTelemetryStore } from "../store";
import { useSnackbar, VariantType } from "notistack";
import { sendCommand } from "../lib/api";
import { showResponse } from "../lib/notifications";

interface ControlProps {
  data: Telemetry | null;
  error: boolean;
  isLoading: boolean;
  reconnect: () => void;
}

const Control = ({ data, isLoading, error, reconnect }: ControlProps) => {
  const { elevation, velocity, current, voltage } = useTelemetryStore();
  const { enqueueSnackbar } = useSnackbar();

  const showSnackbar = (
    message: string,
    variant: VariantType,
    autoHideDuration?: number
  ) => {
    if (autoHideDuration) {
      return enqueueSnackbar(message, {
        variant,
        autoHideDuration,
        anchorOrigin: { vertical: "bottom", horizontal: "right" },
      });
    }

    enqueueSnackbar(message, {
      variant,
      persist: true,
      anchorOrigin: { vertical: "bottom", horizontal: "right" },
    });
  };

  const handleSendCommand = async (command: string) => {
    const res = await sendCommand(command);
    showResponse(res, showSnackbar);
  };

  return (
    <div>
      {/* Status block */}
      <p>
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

      <div style={{ marginTop: "2rem" }}>
        <button onClick={() => handleSendCommand("start")}>Start</button>
        <button onClick={() => handleSendCommand("stop")}>Stop</button>
        <button onClick={() => handleSendCommand("turn-off")}>Turn off</button>
        <button onClick={() => handleSendCommand("turn-on")}>Turn on</button>
        <button onClick={() => handleSendCommand("error")}>Error</button>
      </div>
      {/* Elevation and Velocity */}
      <p>Elevation: {data?.elevation || "N/A"}</p>
      <p>Velocity: {data?.velocity || "N/A"}</p>

      <LineChart
        xAxis={[{ data: arrayUntil(10) }]}
        series={[
          {
            data: velocity,
            area: true,
            label: "Velocity",
          },
          {
            data: elevation,
            area: true,
            label: "Elevation",
          },
        ]}
        width={700}
        height={300}
      />
      {/* Voltage */}
      <p>Voltage: {data?.voltage || "N/A"}</p>
      <LineChart
        xAxis={[{ data: arrayUntil(10) }]}
        yAxis={[
          {
            colorMap: {
              type: "piecewise",
              thresholds: [200, 300],
              colors: ["#22BB22", "#ffd700", "#EC1F27"],
            },
          },
        ]}
        series={[
          {
            curve: "step",
            data: voltage,
            area: true,
            label: "Voltage",
            color: "grey",
          },
        ]}
        width={700}
        height={300}
      />
      {/* Current */}
      <p>Current: {data?.current || "N/A"}</p>
      <LineChart
        xAxis={[{ data: arrayUntil(10) }]}
        yAxis={[
          {
            colorMap: {
              type: "piecewise",
              thresholds: [50, 80],
              colors: ["#22BB22", "#ffd700", "#EC1F27"],
            },
          },
        ]}
        series={[
          {
            curve: "step",
            data: current,
            label: "Current",
            color: "#cacaca",
          },
        ]}
        width={700}
        height={300}
        sx={{
          "& .MuiLineElement-root": {
            strokeWidth: 8,
          },
        }}
      />
    </div>
  );
};

export default memo(Control);
