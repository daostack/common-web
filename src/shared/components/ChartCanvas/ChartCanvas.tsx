import React, {
  FC,
  useEffect,
  useState,
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

  const [chartCanvas, setChartCanvas] = useState<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!chartCanvas)
      return;

    const ctx = chartCanvas.getContext("2d");

    if (!ctx)
      return;

    new Chart(
      ctx,
      {
        type,
        data,
        options,
      }
    );
  }, [chartCanvas, type, data, options]);

  return <canvas ref={setChartCanvas} />;
};

export default ChartCanvas;
