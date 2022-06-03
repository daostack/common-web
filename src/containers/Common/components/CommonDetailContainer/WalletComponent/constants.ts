import { ChartOptions } from "chart.js";

export enum WalletMenuItems {
  All = "All",
  PayIn = "Pay-In",
  PayOut = "Pay-Out",
}

export const BRIEF_MONTH_NAMES = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

export const TRANSACTIONS_PERIOD_MONTHS_AMOUNT = 6;

export const CommonWalletChartOptions: ChartOptions = {
  elements: {
    point: {
      pointStyle: "circle",
    }
  },
  plugins: {
    tooltip: {
      enabled: true,
      position: "nearest",
      usePointStyle: true,
    },
    legend: {
      display: true,
      position: "right",
      labels: {
        color: "rgb(179, 186, 195)",
        usePointStyle: true,
        font: {
          size: 12,
        },
        boxWidth: 7,
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        color: "rgb(179, 186, 195)",
        font: {
          size: 10
        }
      }
    },
    x: {
      ticks: {
        color: "rgb(179, 186, 195)",
        font: {
          size: 10
        }
      }
    }
  },
  interaction: {
    mode: 'index',
  },
};
