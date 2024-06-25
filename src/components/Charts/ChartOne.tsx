import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import { useTheme } from "next-themes";

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface ChartOneProps {
  venteData: { dateLivraison: string; montantVente: number }[];
  achatData: { dateReception: string; montantAchat: number }[];
}

const ChartOne: React.FC<ChartOneProps> = ({ venteData, achatData }) => {
  const { theme } = useTheme();

  // Generate a list of unique dates from venteData and achatData
  const uniqueDates = Array.from(new Set([
    ...venteData.map((item) => item.dateLivraison),
    ...achatData.map((item) => item.dateReception),
  ])).sort();

  // Create series data that include all unique dates
  const venteSeriesData = uniqueDates.map(date => {
    const vente = venteData.find(item => item.dateLivraison === date);
    return vente ? vente.montantVente : 0;
  });

  const achatSeriesData = uniqueDates.map(date => {
    const achat = achatData.find(item => item.dateReception === date);
    return achat ? achat.montantAchat : 0;
  });

  const [series, setSeries] = useState([
    {
      name: "Vente",
      data: venteSeriesData,
    },
    {
      name: "Achat",
      data: achatSeriesData,
    },
  ]);

  useEffect(() => {
    const apexChartScript = document.createElement("script");
    apexChartScript.src = "https://cdn.jsdelivr.net/npm/apexcharts";
    document.body.appendChild(apexChartScript);
    return () => {
      document.body.removeChild(apexChartScript);
    };
  }, []);

  // Calculer le maximum pour l'axe y
  const calculateMaxYAxis = (): number => {
    return Math.max(Math.max(...venteSeriesData), Math.max(...achatSeriesData));
  };

  const options: ApexCharts.ApexOptions = {
    tooltip: {
      enabled: false ,
      theme:
        theme === "system"
          ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
          : theme,
    },
    legend: {
      show: true,
      position: "top",
      horizontalAlign: "left",
    },
    colors: ["#3C50E0", "#80CAEE"],
    chart: {
      fontFamily: "Satoshi, sans-serif",
      height: 335,
      type: "area",
      dropShadow: {
        enabled: false,
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
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
    },
    dataLabels: {
      enabled: true,
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
      categories: uniqueDates,
      axisBorder: {
        show: true,
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
      max: calculateMaxYAxis(),
    },
  };

  return (
    <div className="col-span-12 rounded-sm border border-stroke px-5 pb-5 pt-7.5 shadow-default sm:px-7.5 xl:col-span-8">
      <div className="flex flex-wrap items-start justify-between gap-3 sm:flex-nowrap">
        <div className="flex w-full flex-wrap gap-3 sm:gap-5">
          <div className="flex min-w-47.5">
            <div className="w-full"></div>
          </div>
        </div>
      </div>
      <div>
        <div id="chartOne" className="-ml-5">
          <ReactApexChart
            options={options}
            series={series}
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
