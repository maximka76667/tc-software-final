import { Fragment, memo, useState } from "react";
import ChartWrapper from "./ChartWrapper";

interface ChartsBoxProps {
  data: { [key: string]: number };
}

const telemetryMetrics = [
  { label: "Elevation", color: "#83f383" },
  { label: "Velocity", color: "#f55533" },
  { label: "Voltage", color: "#501155" },
  { label: "Current", color: "#008822" },
];

// Make all telemetrics active by default
const activeChartsDefault = telemetryMetrics.map(
  (telemetry) => telemetry.label
);

const ChartsBox = ({ data }: ChartsBoxProps) => {
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
      <div className="flex gap-1 justify-center mb-8">
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
            {data && (
              <div
                className={`${
                  activeCharts.includes(metric.label) ? "flex" : "hidden"
                }`}
              >
                <ChartWrapper data={data} metric={metric} />
              </div>
            )}
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default memo(ChartsBox);
