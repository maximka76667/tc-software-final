import { memo } from "react";
import { LineChart } from "@mui/x-charts";
import { arrayUntil } from "../lib/utils";
import { Telemetry } from "../lib/definitions";
import { useTelemetryStore } from "../store";

interface ControlProps {
  data: Telemetry | null;
  error: string | null;
}

const Control = ({ data, error }: ControlProps) => {
  const { elevation, velocity, current, voltage } = useTelemetryStore();
  console.log("Render");
  return (
    <div>
      {/* Elevation and Velocity */}
      <p>Elevation: {data?.elevation || "N/A"}</p>
      <p>Velocity: {data?.velocity || "N/A"}</p>

      <p>{error}</p>
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
