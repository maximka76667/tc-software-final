import { Fragment, memo, useState } from "react";
import ChartWrapper from "./ChartWrapper";

interface ChartsBoxProps {
  data: { [key: string]: number };
}

const telemetryMetrics = [
  { label: "Elevation", color: "#4CAF50" },
  { label: "Velocity", color: "#F44336" },
  { label: "Voltage", color: "#FF9800" },
  { label: "Current", color: "#2196F3" },
];

// Make all telemetrics active by default
const activeChartsDefault = telemetryMetrics.map(
  (telemetry) => telemetry.label
);

const Charts = ({ data }: ChartsBoxProps) => {
  const [activeCharts, setActiveCharts] =
    useState<string[]>(activeChartsDefault);

  const toggleChart = (metric: string) => {
    setActiveCharts((prev) =>
      prev.includes(metric)
        ? prev.filter((m) => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <>
      <div className="flex gap-2 justify-center mb-8">
        {telemetryMetrics.map((metric) => (
          <button
            key={metric.label}
            onClick={() => toggleChart(metric.label)}
            className={`flex items-center gap-3 px-4 py-2 border rounded ${
              activeCharts.includes(metric.label) ? `` : "opacity-40"
            }`}
          >
            <div
              className="w-[10px] h-[10px] rounded-xl"
              style={{ backgroundColor: metric.color }}
            />
            {metric.label}
          </button>
        ))}
      </div>
      <div className="flex flex-col">
        {telemetryMetrics.map((metric) => (
          <Fragment key={metric.label}>
            {
              <div
                className={`${
                  activeCharts.includes(metric.label) ? "flex" : "hidden"
                }`}
              >
                <ChartWrapper data={data} metric={metric} />
              </div>
            }
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default memo(Charts);
