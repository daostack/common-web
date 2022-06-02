import React, {
  FC,
  useRef,
  useEffect,
  useCallback,
} from "react";
import {
  Chart,
  ChartData,
  ChartOptions,
  LineController,
  LineElement,
  LinearScale,
  CategoryScale,
  PointElement,
  Legend,
  Tooltip,
} from "chart.js";
import { ChartType } from "@/shared/constants";

interface ChartCanvasProps {
  type: ChartType;
  data: ChartData;
  options?: ChartOptions;
}

const ChartCanvas: FC<ChartCanvasProps> = (
  {
    data,
    type,
    options,
  }
) => {
  Chart.register(
    LineController,
    LineElement,
    LinearScale,
    CategoryScale,
    PointElement,
    Tooltip,
    Legend,
  );

  const chartRef = useRef<Chart | null>(null);

  const canvasCallback = useCallback((canvas: HTMLCanvasElement | null) => {
    if (!canvas)
      return;

    const ctx = canvas.getContext("2d");

    if (!ctx)
      return;

    chartRef.current = new Chart(ctx, {
      type,
      data,
      options,
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!chartRef.current)
      return;

    chartRef.current.data = data;
    chartRef.current.update();
    // eslint-disable-next-line
  }, [data, chartRef.current]);

  return <canvas ref={canvasCallback} />;
};

export default ChartCanvas;
