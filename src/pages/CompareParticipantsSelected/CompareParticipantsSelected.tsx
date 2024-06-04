import { Badge, Box, Flex, Skeleton, Table, Tooltip } from "@radix-ui/themes"
import { useLocation } from "react-router-dom";
import { IParticipant } from "../../interfaces/participant.interface";
import { Header } from "../../components/Header/Header";
import * as  Icon from "@phosphor-icons/react";
import Accordeon from "../../components/Accordeon/Accordeon";
import { GridComponent } from "../../components/Grid/Grid";
import { ApexOptions } from 'apexcharts';
import ApexChart from "react-apexcharts";
import { SelectField } from "../../components/SelectField/SelectField";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";

interface LocationState {
  selectedParticipants: IParticipant[];
}


const CompareParticipantsSelected = () => {

  const location = useLocation();
  const state = location.state as LocationState;
  const { selectedParticipants } = state || { selectedParticipants: [] };

  const [selectedBlockIndex, setSelectedBlockIndex] = useState(0);

  const handleAge = (birthDate: Date): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);

    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();

    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }

    return age;
  };
  const detailBlocks = [
    { title: "Características Gerais", numbersOfquestions: `5-22`, numberBlocks: 1 },
    { title: "Habilidades acima da média", numbersOfquestions: `23-34`, numberBlocks: 2 },
    { title: "Criatividade", numbersOfquestions: `35-49`, numberBlocks: 3 },
    { title: "Comprometimento com a tarefa", numbersOfquestions: `50-62`, numberBlocks: 4 },
    { title: "Liderança", numbersOfquestions: `63-67`, numberBlocks: 5 },
    { title: "Atividades artísticas e esportivas", numbersOfquestions: `68-70`, numberBlocks: 6 },
  ];

  function calcularPunctuation(participants: IParticipant[]): number[][] {
    const punctuationS: number[][] = [];

    for (const participant of participants) {
      let participantesPontuacao = [0, 0, 0, 0, 0, 0];

      if (participant.adultForm && participant.adultForm.answersByGroup) {
        for (const group of participant.adultForm.answersByGroup) {
          for (const question of group.questions) {
            const answerPoints = question.answerPoints ?? 0;
            switch (group.groupName) {
              case "Características Gerais":
                participantesPontuacao[0] += answerPoints;
                break;
              case "Habilidade Acima da Média":
                participantesPontuacao[1] += answerPoints;
                break;
              case "Criatividade":
                participantesPontuacao[2] += answerPoints;
                break;
              case "Comprometimento da Tarefa":
                participantesPontuacao[3] += answerPoints;
                break;
              case "Liderança":
                participantesPontuacao[4] += answerPoints;
                break;
              case "Atividades Artísticas e Esportivas":
                participantesPontuacao[5] += answerPoints;
                break;
              default:
                break;
            }
          }
        }
      }
      punctuationS.push(participantesPontuacao);
    }
    return punctuationS;
  }


  const punctuationS = calcularPunctuation(selectedParticipants);
  const generateRandomColor = (): string => {
    const baseColor = [0x6e, 0x56, 0xcf];
    const variation = 50;

    const randomColor = baseColor.map((channel) => {
      const min = Math.max(0, channel - variation);
      const max = Math.min(255, channel + variation);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    });

    return `rgb(${randomColor[0]}, ${randomColor[1]}, ${randomColor[2]})`;
  };

  const randomColors = Array.from({ length: 6 }, generateRandomColor);
  const options2: ApexOptions = {
    series: [
      ...punctuationS.map((data, index) => ({
        name: `A-${index + 1}`,
        data: data
      }))
    ],
    colors: randomColors,
    chart: {
      type: 'bar',
      height: 500,
      stacked: punctuationS.length > 5 ? true : false,
      toolbar: {
        show: true
      },
      zoom: {
        enabled: true
      }
    },
    responsive: [{
      breakpoint: 500,
      options: {
        legend: {
          position: 'bottom',
          offsetX: -10,
          offsetY: 0
        }
      }
    }],
    plotOptions: {
      bar: {
        columnWidth: punctuationS.length > 5 ? 80 : 20,
        horizontal: false,
        borderRadius: 5,
        borderRadiusApplication: 'end',
        borderRadiusWhenStacked: 'last',
        dataLabels: {
          position: 'center',
        },
      },
    },
    xaxis: {
      categories: ['Bloco 1', 'Bloco 2', 'Bloco 3', 'Bloco 4', 'Bloco 5', "Bloco 6"],
    },
    legend: {
      position: 'right',
      offsetY: 20
    },
    fill: {
      opacity: 1
    },
    title: {
      text: 'Pontuação dos Participantes Selecionados por Bloco',
      align: 'left',
      style: {
        fontSize: '15px',
      }
    },
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBlockIndex(parseInt(event.target.value));
  };

  const selectedQuestions = selectedParticipants[0].adultForm?.answersByGroup?.[selectedBlockIndex]?.questions || []


  return (
    <Flex direction="column" className={`relative ml-2  border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] p-5 font-roboto `}>
      <Header title="Comparação dos Participantes Selecionados" icon={<Icon.Books size={24}></Icon.Books>}></Header>
      <Box className="w-[90%] m-auto">
        <Accordeon
          title="Informações do Participante(s) Selecionados"
          content={
            <Table.Root variant="surface" className="w-full">
              <Table.Header className="text-[18px]">
                <Table.Row>
                  <Table.ColumnHeaderCell colSpan={5} className="border-r"></Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell colSpan={2} className="border-r text-center">Indicadores de AH/SD de acordo com o :</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Header className="text-[16px]">
                <Table.Row align="center" className="text-center">
                  <Table.ColumnHeaderCell className="border-l">Identificação</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="border-l">Nome do Avaliado</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="border-l">Pontuação</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="border-l">Idade</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="border-l">Gênero</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell className="border-l">Pesquisador</Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {selectedParticipants.map((participant, index) => (
                  <Table.Row key={index} align="center">
                    <Table.Cell justify="center">
                      <Tooltip content={`Avaliado - ${index + 1}`}>
                        <Box>
                          A-{index + 1}
                        </Box>
                      </Tooltip>

                    </Table.Cell>
                    <Table.Cell justify="center">{participant.personalData.fullName}</Table.Cell>
                    <Table.Cell justify="center">{participant.adultForm?.totalPunctuation}</Table.Cell>
                    <Table.Cell justify="center">{handleAge(participant.personalData.birthDate)}</Table.Cell>
                    <Table.Cell justify="center">{participant.personalData.gender}</Table.Cell>
                    <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>
                    <Table.Cell justify="center">
                      {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          }
          className="mb-2"
          defaultValue="item-1"
        />


        <GridComponent className="gap-5 m-auto mt-2 " columns={2}>
          <Skeleton loading={false}>
            <Box>
              <Table.Root variant="surface" className=" text-black rounded rounded-b-lg w-full drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto overflow-auto">
                <Table.Header className="text-[14px] text-black bg-violet-200">
                  <Table.ColumnHeaderCell align="center" colSpan={8}>Detalhes de cada bloco</Table.ColumnHeaderCell>
                </Table.Header>
                <Table.Header className="text-[12px] bg-violet-200">
                  <Table.Row align="center" className="text-center">
                    <Table.ColumnHeaderCell className="border-l">Nº das perguntas do questionário</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="border-l">Nº de bloco</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell className="border-l">Nome do bloco</Table.ColumnHeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {detailBlocks.map((detail, index) => (
                    <Table.Row align="center" key={index}>
                      <Table.Cell justify="center">{detail.numbersOfquestions}</Table.Cell>
                      <Table.Cell justify="center">{detail.numberBlocks}</Table.Cell>
                      <Table.Cell justify="center">{detail.title}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          </Skeleton>
          <Skeleton loading={false}>
            <Box className="rounded overflow-hidden bg-white rounded-b-lg w-full pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto border-2 p-2">
              <ApexChart options={options2} series={options2.series} type="bar" height={300} />
            </Box>
          </Skeleton>
        </GridComponent>
        <Box className="w-full ">
          <Form.Root className="flex flex-row items-center ">
            <Flex>
              <SelectField label="FILTRAR PERGUNTAS POR BLOCO" className="" name="blocks" onChange={handleSelectChange}>
                {detailBlocks.map((detail, index) => (
                  <option className="hover:cursor-pointer" value={`${index}`} key={index}>
                    Bloco {index + 1} - {detail.title}
                  </option>
                ))}
              </SelectField>
            </Flex>
          </Form.Root>
        </Box>
        <Accordeon
          title="Comparação:"
          content={
            <Table.Root variant="surface" className="h-[500px] overflow">
              <Table.Header className="text-[16px]">
                <Table.Row align="center" className="text-center">
                  <Table.ColumnHeaderCell className="border-l">Perguntas</Table.ColumnHeaderCell>
                  {selectedParticipants?.map((participant, index) => (
                    <Table.ColumnHeaderCell key={index} className="border-l">{participant.personalData?.fullName}</Table.ColumnHeaderCell>
                  ))}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row align="center">
                  <Table.Cell>Pontuação:</Table.Cell>
                  {selectedParticipants?.map((participant, index) => (
                    <Table.Cell align="center" key={index} className="border-l">{participant.adultForm?.totalPunctuation} </Table.Cell>
                  ))}
                </Table.Row>
                {selectedQuestions.map((question, questionIndex) => (
                  <Table.Row align="center" key={questionIndex}>
                    <Table.Cell className="text-wrap">{question.statement}</Table.Cell>
                    {selectedParticipants.map((participant, participantIndex) => {
                      const answers = participant.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions
                        ?.filter(q => q.statement === question.statement)
                        ?.map(q => {
                          if (typeof q.answer === 'string') {
                            return q.answer.trim();
                          } else if (Array.isArray(q.answer)) {
                            return q.answer.map(a => (typeof a === 'string' ? a.trim() : '')).join(', ');
                          } else {
                            return '';
                          }
                        })
                        ?.join(', ');

                      return (
                        <Table.Cell key={participantIndex} align="center" className="border-l">
                          <p className={` rounded py-1   
                          ${answers === "Sempre" ? "bg-green-400 text-white w-[200px] text-center font-semibold " :
                              answers === "Frequentemente" ? "bg-green-400 text-white  w-[200px] text-center font-semibold " :
                                answers === "Ás vezes" ? "bg-red-400 text-white  w-[200px] text-center font-semibold " :
                                  answers === "Raramente" ? "bg-red-400 text-white w-[200px] text-center font-semibold " :
                                    answers === "Nunca" ? "bg-red-400 text-white w-[200px] text-center font-semibold " : " "
                            }}`}
                          >{answers}</p>
                        </Table.Cell>
                      );
                    })}
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Root>
          }
          defaultValue={""}
        />
      </Box >
    </Flex>
  );
};

export default CompareParticipantsSelected;