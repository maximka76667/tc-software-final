import { LineChart } from "@mui/x-charts";
import { memo, useEffect, useState } from "react";
import { addAndGetLastNElements, arrayUntil } from "../lib/utils";
import { NUMBER_GRAPHICS_ELEMENTS } from "../lib/consts";

interface ChartWrapper {
  metric: { label: string; color: string };
  // metricData: number;
  data: { [key: string]: number };
}

const ChartWrapper = ({ metric, data }: ChartWrapper) => {
  const [lastData, setLastData] = useState<number[]>([]);

  useEffect(() => {
    setLastData((prevData) =>
      addAndGetLastNElements(
        prevData,
        data[metric.label.toLowerCase()],
        NUMBER_GRAPHICS_ELEMENTS
      )
    );
  }, [data]);

  const sum = lastData.reduce((prev, value) => prev + value, 0);
  const avg = sum / lastData.length;

  return (
    <LineChart
      xAxis={[{ data: arrayUntil(NUMBER_GRAPHICS_ELEMENTS) }]}
      sx={{
        "& .MuiLineElement-series-auto-generated-id-1": {
          strokeDasharray: "10 5",
          strokeWidth: 4,
        },
        "& .MuiAreaElement-series-Germany": {
          fill: "url('#myGradient')",
        },
      }}
      series={[
        {
          data: lastData,
          area: true,
          label: metric.label,
          color: metric.color,
        },
        {
          data: new Array(NUMBER_GRAPHICS_ELEMENTS).fill(avg),
          label: "Average",
        },
      ]}
      width={700}
      height={300}
    />
  );
};

export default memo(ChartWrapper);
