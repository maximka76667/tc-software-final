// ChartWrapper.test.tsx
import { render, screen } from "@testing-library/react";
import ChartWrapper from "./ChartWrapper";
import { Mock, vi } from "vitest";
import { useTelemetryStore } from "../../../store";
import { NUMBER_GRAPHICS_ELEMENTS } from "../../../lib/consts";

// Mock Zustand store
vi.mock("../../../store", () => ({
  useTelemetryStore: vi.fn(),
}));

// Mock MUI LineChart to make assertions easier
vi.mock("@mui/x-charts", () => ({
  LineChart: (props: any) => {
    // Store props for later inspection in tests
    return (
      <div data-testid="line-chart" data-props={JSON.stringify(props)}>
        Mock LineChart
      </div>
    );
  },
}));

describe("ChartWrapper", () => {
  const metric = { label: "Speed", color: "#ff0000" };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders chart with given metric data", () => {
    const fakeData = [10, 20, 30, 40];
    (useTelemetryStore as unknown as Mock).mockImplementation(() => fakeData);

    render(<ChartWrapper metric={metric} data={{}} />);

    const chart = screen.getByTestId("line-chart");
    const props = JSON.parse(chart.getAttribute("data-props")!);

    // First series = actual metric data
    expect(props.series[0].data).toEqual(fakeData);
    expect(props.series[0].label).toBe("Speed");
    expect(props.series[0].color).toBe("#ff0000");

    // Second series = average line
    const avg = (10 + 20 + 30 + 40) / 4;
    expect(props.series[1].data).toEqual(
      new Array(NUMBER_GRAPHICS_ELEMENTS).fill(avg)
    );
    expect(props.series[1].label).toBe("Average");
    expect(props.series[1].color).toBe("#515151");
  });

  it("handles empty metric data gracefully", () => {
    const fakeData: number[] = [];
    (useTelemetryStore as unknown as Mock).mockImplementation(() => fakeData);

    render(<ChartWrapper metric={metric} data={{}} />);

    const chart = screen.getByTestId("line-chart");
    const props = JSON.parse(chart.getAttribute("data-props")!);

    expect(props.series[0].data).toEqual([]);
    expect(props.series[1].data).toEqual(
      new Array(NUMBER_GRAPHICS_ELEMENTS).fill(null)
    );
  });
});
