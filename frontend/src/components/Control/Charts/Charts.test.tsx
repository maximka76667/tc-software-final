// Charts.test.tsx
import { describe, it, expect, vi, beforeEach, Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Charts from "./Charts";
import { telemetryMetrics } from "../../../lib/consts";
import { useTelemetryStore } from "../../../store";

// Mock ChartWrapper to avoid heavy rendering
vi.mock("../ChartWrapper/ChartWrapper", () => ({
  default: ({ metric }: any) => <div data-testid={`chart-${metric.label}`} />,
}));

// Mock Zustand store
vi.mock("../../../store", () => ({
  useTelemetryStore: vi.fn(),
}));

// UseShallow returns identity so no need to mock from zustand/react/shallow
vi.mock("zustand/react/shallow", () => ({
  useShallow: (fn: any) => fn,
}));

describe("Charts component", () => {
  const toggleChart = vi.fn();
  const data = { speed: 10, rpm: 2000 };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders buttons for all telemetry metrics", () => {
    (useTelemetryStore as unknown as Mock).mockImplementation(() => ({
      activeCharts: [],
      toggleChart,
    }));

    render(<Charts data={data} />);

    telemetryMetrics.forEach((metric) => {
      expect(screen.getByText(metric.label)).toBeInTheDocument();
    });
  });

  it("applies opacity-40 to inactive charts", () => {
    (useTelemetryStore as unknown as Mock).mockImplementation(() => ({
      activeCharts: [],
      toggleChart,
    }));

    render(<Charts data={data} />);

    telemetryMetrics.forEach((metric) => {
      const btn = screen.getByText(metric.label).closest("button");
      expect(btn).toHaveClass("opacity-40");
    });
  });

  it("does not apply opacity-40 to active charts", () => {
    const activeCharts = [telemetryMetrics[0].label];
    (useTelemetryStore as unknown as Mock).mockImplementation(() => ({
      activeCharts,
      toggleChart,
    }));

    render(<Charts data={data} />);

    telemetryMetrics.forEach((metric) => {
      const btn = screen.getByText(metric.label).closest("button");
      if (activeCharts.includes(metric.label)) {
        expect(btn).not.toHaveClass("opacity-40");
      } else {
        expect(btn).toHaveClass("opacity-40");
      }
    });
  });

  it("calls toggleChart when button is clicked", () => {
    (useTelemetryStore as unknown as Mock).mockImplementation(() => ({
      activeCharts: [],
      toggleChart,
    }));

    render(<Charts data={data} />);

    const firstMetric = telemetryMetrics[0];
    const btn = screen.getByText(firstMetric.label).closest("button");
    fireEvent.click(btn!);

    expect(toggleChart).toHaveBeenCalledWith(firstMetric.label);
  });

  it("renders ChartWrapper only for active charts", () => {
    const activeCharts = [telemetryMetrics[0].label];
    (useTelemetryStore as unknown as Mock).mockImplementation(() => ({
      activeCharts,
      toggleChart,
    }));

    render(<Charts data={data} />);

    telemetryMetrics.forEach((metric) => {
      const chart = screen.queryByTestId(`chart-${metric.label}`);
      if (activeCharts.includes(metric.label)) {
        expect(chart).toBeInTheDocument();
      } else {
        expect(chart).toBeNull();
      }
    });
  });
});
