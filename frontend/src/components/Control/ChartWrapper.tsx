import { LineChart } from "@mui/x-charts";
import { memo } from "react";
import { arrayUntil } from "../../lib/utils";
import { NUMBER_GRAPHICS_ELEMENTS } from "../../lib/consts";
import { useTelemetryStore } from "../../store";
import { Telemetry } from "../../lib/definitions";
import { useShallow } from "zustand/react/shallow";

interface ChartWrapper {
  metric: { label: string; color: string };
  data: { [key: string]: number };
}

const ChartWrapper = ({ metric }: ChartWrapper) => {
  const arrayMetricData = useTelemetryStore(
    useShallow(
      (state) =>
        state.arrayTelemetryData[metric.label.toLowerCase() as keyof Telemetry]
    )
  );

  const sum = arrayMetricData.reduce((prev, value) => prev + value, 0);
  const avg = sum / arrayMetricData.length;

  return (
    <LineChart
      xAxis={[{ data: arrayUntil(NUMBER_GRAPHICS_ELEMENTS) }]}
      // Dash styled line for average value
      sx={{
        "& .MuiLineElement-series-auto-generated-id-1": {
          strokeDasharray: "10 5",
          strokeWidth: 4,
        },
      }}
      series={[
        {
          data: arrayMetricData,
          area: true,
          label: metric.label,
          color: metric.color,
        },
        {
          data: new Array(NUMBER_GRAPHICS_ELEMENTS).fill(avg),
          label: "Average",
          color: "#515151",
        },
      ]}
      width={850}
      height={200}
    />
  );
};

export default memo(ChartWrapper);
