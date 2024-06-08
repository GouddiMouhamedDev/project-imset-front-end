import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';

import { useTheme } from "next-themes";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

const ChartOne: React.FC = () => {
  const { theme } = useTheme();
  const [state, setState] = useState({
    series: [
      {
        name: "Product One",
        data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45, 22, 36, 25, 55, 36, 33, 56, 14, 47, 30, 64, 47, 15, 44, 27, 28, 29, 30],
      },
      {
        name: "Product Two",
        data: [30, 25, 36, 30, 45, 35, 64, 52, 25, 36, 39, 51, 12, 25, 15, 14, 33, 15, 56, 14, 47, 20, 50, 23, 10, 44, 27, 28, 25, 40],
      },
    ],
  });

  useEffect(() => {
    // Fix pour Next.js SSR : assurez-vous que ReactApexChart est chargé du côté client
    const apexChartScript = document.createElement("script");
    apexChartScript.src = "https://cdn.jsdelivr.net/npm/apexcharts";
    document.body.appendChild(apexChartScript);
    return () => {
      document.body.removeChild(apexChartScript);
    };
  }, []);

  const options: any = {
    tooltip: {
      enabled: true,
      theme: theme === "system" ? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light') : theme,
    },
    legend: {
      show: false,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: true,
        color: "#623CEA14",
        top: 10,
        blur: 4,
        left: 0,
        opacity: 0.1,
      },
      toolbar: {
        show: true,
      },
    },
    responsive: [
      {
        breakpoint: 1024,
        options: {
          chart: {
            height: 300,
          },
        },
      },
      {
        breakpoint: 1366,
        options: {
          chart: {
            height: 350,
          },
        },
      },
    ],
    stroke: {
      width: [2, 2],
      curve: "straight",
    },
    grid: {
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    markers: {
      size: 4,
      colors: "#fff",
      strokeColors: ["#3056D3", "#80CAEE"],
      strokeWidth: 3,
      strokeOpacity: 0.9,
      strokeDashArray: 0,
      fillOpacity: 1,
      discrete: [],
      hover: {
        size: undefined,
        sizeOffset: 5,
      },
    },
    xaxis: {
      type: "category",
      categories: [
        "01/05", "02/05", "03/05", "04/05", "05/05", "06/05", "07/05", "08/05", "09/05", "10/05",
        "11/05", "12/05", "13/05", "14/05", "15/05", "16/05", "17/05", "18/05", "19/05", "20/05",
        "21/05", "22/05", "23/05", "24/05", "25/05", "26/05", "27/05", "28/05", "29/05", "30/05"
      ],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      title: {
        style: {
          fontSize: "0px",
        },
      },
      min: 0,
      max: 100,
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke px-5 pb-5 pt-7.5 shadow-default sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-primary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-primary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-primary">Revenue</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
          <div className="flex min-w-47.5">
            <span className="mr-2 mt-1 flex h-4 w-full max-w-4 items-center justify-center rounded-full border border-secondary">
              <span className="block h-2.5 w-full max-w-2.5 rounded-full bg-secondary"></span>
            </span>
            <div className="w-full">
              <p className="font-semibold text-secondary">Total Sales</p>
              <p className="text-sm font-medium">12.04.2022 - 12.05.2022</p>
            </div>
          </div>
        </div>
        <div className="flex w-full max-w-45 justify-end">
          <div className="inline-flex items-center rounded-md  p-1.5 ">
            <button className="rounded px-3 py-1 text-xs font-medium shadow-card hover:shadow-card">
              Day
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium hover:shadow-card">
              Week
            </button>
            <button className="rounded px-3 py-1 text-xs font-medium hover:shadow-card">
              Month
            </button>
          </div>
        </div>
      </div>

      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={state.series}
            type="area"
            height={350}
            width={"100%"}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartOne;
