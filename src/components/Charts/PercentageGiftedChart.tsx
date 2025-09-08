import React from "react";
import ApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IParticipant } from "../../interfaces/participant.interface";

interface PercentageGiftedChartProps {
  participants: IParticipant[] | undefined;
}

function calcularPorcentagemDeSuperdotados(participants: IParticipant[] | undefined) {
  if (!participants || participants.length === 0) {
    return 0;
  }

  const superdotados = participants.reduce((count, participant) => {
    if (participant.giftdnessIndicatorsByResearcher === true) {
      return count + 1;
    }
    return count;
  }, 0);

  return Math.round((superdotados / participants.length) * 100 * 100) / 100;
}

const PercentageGiftedChart: React.FC<PercentageGiftedChartProps> = ({ participants }) => {
  const percentage = calcularPorcentagemDeSuperdotados(participants);

  const options: ApexOptions = {
    series: [percentage],
    colors: ["#B57CFF"],
    chart: {
      type: "radialBar",
      height: 350,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -90,
        endAngle: 90,
        track: {
          background: "#000000bb",
          startAngle: -90,
          endAngle: 90,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "30px",
            show: true,
          },
        },
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "horizontal",
        gradientToColors: ["#7A47E4"],
        stops: [0, 100],
      },
    },
    title: {
      text: `Aval. com Indicadores`,
      align: "left",
      style: {
        fontSize: "20px",
      },
    },
  };

  return <ApexChart options={options} series={options.series} type="radialBar" height={450} />;
};

export default PercentageGiftedChart;
