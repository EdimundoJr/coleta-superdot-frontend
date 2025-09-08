import React from 'react';
import ApexChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { IParticipant } from "../../interfaces/participant.interface";

interface ResponseChartByGenderProps {
  participants: IParticipant[] | undefined;
}

const ResponseChartByGender: React.FC<ResponseChartByGenderProps> = ({ participants }) => {
  function calcularFrequencia(participants: IParticipant[] | undefined): number[][] {
    if (!participants || participants.length === 0) {
      return [[0, 0, 0, 0, 0], [0, 0, 0, 0, 0]];
    }

    let frequentementeMasculino = 0;
    let sempreMasculino = 0;
    let asvezesMasculino = 0;
    let raramenteMasculino = 0;
    let nuncaMasculino = 0;

    let frequentementeFeminino = 0;
    let sempreFeminino = 0;
    let asvezesFeminino = 0;
    let raramenteFeminino = 0;
    let nuncaFeminino = 0;

    for (const participant of participants) {
      if (participant.adultForm && participant.adultForm.answersByGroup) {
        for (const group of participant.adultForm.answersByGroup) {
          for (const question of group.questions) {
            switch (question.answer) {
              case 'Frequentemente':
                if (participant.personalData.gender === "Masculino") {
                  frequentementeMasculino++;
                } else if (participant.personalData.gender === "Feminino") {
                  frequentementeFeminino++;
                }
                break;
              case 'Sempre':
                if (participant.personalData.gender === "Masculino") {
                  sempreMasculino++;
                } else if (participant.personalData.gender === "Feminino") {
                  sempreFeminino++;
                }
                break;
              case 'Ás vezes':
                if (participant.personalData.gender === "Masculino") {
                  asvezesMasculino++;
                } else if (participant.personalData.gender === "Feminino") {
                  asvezesFeminino++;
                }
                break;
              case 'Raramente':
                if (participant.personalData.gender === "Masculino") {
                  raramenteMasculino++;
                } else if (participant.personalData.gender === "Feminino") {
                  raramenteFeminino++;
                }
                break;
              case 'Nunca':
                if (participant.personalData.gender === "Masculino") {
                  nuncaMasculino++;
                } else if (participant.personalData.gender === "Feminino") {
                  nuncaFeminino++;
                }
                break;
              default:
                break;
            }
          }
        }
      }
    }

    return [
      [frequentementeMasculino, sempreMasculino, asvezesMasculino, raramenteMasculino, nuncaMasculino],
      [frequentementeFeminino, sempreFeminino, asvezesFeminino, raramenteFeminino, nuncaFeminino]
    ];
  }

  const frequencies = calcularFrequencia(participants);

  const options: ApexOptions = {
    series: [
      {
        name: 'Masculino',
        data: frequencies[0],
      },
      {
        name: 'Feminino',
        data: frequencies[1],
      },
    ],
    colors: ["#7A47E4", "#b57cffd2"],
    chart: {
      type: 'bar',
      height: 400,
      stacked: false,
      toolbar: {
        show: true,
      },
      zoom: {
        enabled: true,
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: 'bottom',
            offsetX: -10,
            offsetY: 0,
          },
        },
      },
    ],
    plotOptions: {
      bar: {
        horizontal: true,
        borderRadius: 2,
        dataLabels: {
          total: {
            enabled: false,
            style: {
              fontSize: '13px',
              fontWeight: 500,
            },
          },
        },
      },
    },
    xaxis: {
      categories: ['Frequentemente', 'Sempre', 'Ás vezes', 'Raramente', 'Nunca'],
    },
    legend: {
      position: 'right',
      offsetY: 40,
    },
    fill: {
      opacity: 1,
    },
    title: {
      text: 'Respostas/Gênero',
      align: 'left',
      style: {
        fontSize: '20px',
      },
    },
  };

  return <ApexChart options={options} series={options.series} type="bar" height={300} />;
};

export default ResponseChartByGender;
