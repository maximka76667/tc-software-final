import { LineChart } from "@mui/x-charts";
import { memo, useEffect, useState } from "react";
import { addAndGetLastNElements, arrayUntil } from "../lib/utils";
import { NUMBER_GRAPHICS_ELEMENTS } from "../lib/consts";

interface ChartWrapper {
  metric: { label: string; color: string };
  data: { [key: string]: number };
}

const ChartWrapper = ({ metric, data }: ChartWrapper) => {
  const [lastData, setLastData] = useState<number[]>([]);

  useEffect(() => {
    if (!data) {
      return;
    }

    setLastData((prevData) =>
      addAndGetLastNElements(
        prevData,
        data[metric.label.toLowerCase()],
        NUMBER_GRAPHICS_ELEMENTS
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const sum = lastData.reduce((prev, value) => prev + value, 0);
  const avg = sum / lastData.length;

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
          data: lastData,
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
      height={175}
    />
  );
};

export default memo(ChartWrapper);
