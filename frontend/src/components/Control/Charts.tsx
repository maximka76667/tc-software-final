import { Fragment, memo } from "react";
import ChartWrapper from "./ChartWrapper";
import { telemetryMetrics } from "../../lib/consts";
import { useTelemetryStore } from "../../store";
import { useShallow } from "zustand/react/shallow";

interface ChartsBoxProps {
  data: { [key: string]: number };
}

// Make all telemetrics active by default

const Charts = ({ data }: ChartsBoxProps) => {
  const { activeCharts, toggleChart } = useTelemetryStore(
    useShallow((state) => ({
      activeCharts: state.activeCharts,
      toggleChart: state.toggleChart,
    }))
  );

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
            <div
              className={`${
                activeCharts.includes(metric.label) ? "flex" : "hidden"
              }`}
            >
              <ChartWrapper data={data} metric={metric} />
            </div>
          </Fragment>
        ))}
      </div>
    </>
  );
};

export default memo(Charts);
