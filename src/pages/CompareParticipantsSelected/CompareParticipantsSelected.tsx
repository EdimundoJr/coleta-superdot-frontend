import { Box, DataList, Flex, Separator, Table, Tooltip } from "@radix-ui/themes"
import { useLocation } from "react-router-dom";
import { IParticipant } from "../../interfaces/participant.interface";
import * as  Icon from "@phosphor-icons/react";
import Accordeon from "../../components/Accordeon/Accordeon";
import { GridComponent } from "../../components/Grid/Grid";
import { ApexOptions } from 'apexcharts';
import ApexChart from "react-apexcharts";
import { SelectField } from "../../components/SelectField/SelectField";
import { useState } from "react";
import * as Form from "@radix-ui/react-form";
import { Button } from "../../components/Button/Button";

interface LocationState {
  selectedParticipants: IParticipant[];
}


const CompareParticipantsSelected = () => {

  const location = useLocation();
  const state = location.state as LocationState;
  const { selectedParticipants } = state || { selectedParticipants: [] };

  const [expandedParticipants, setExpandedParticipants] = useState<Record<string, boolean>>({});
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

  const selectedQuestions = selectedParticipants[0].adultForm?.answersByGroup?.find(
    group => group.sequence === selectedBlockIndex
  )?.questions || [];


  return (
    <>

      <Box className="w-full m-auto">
        <Accordeon
          title="Informações do(s) Participante(s) Selecionado(s)"
          content={
            <>
              <Table.Root variant="surface" className="w-full desktop">
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
              <div className="mobo">
                <DataList.Root orientation="vertical" className="!font-roboto">
                  {selectedParticipants.map((participant, index) => (
                    <DataList.Item
                      key={index}
                      className={`w-full p-3 rounded-lg mb-5 card-container transition-all duration-300 ease-in-out 
          ${expandedParticipants[participant._id] ? 'max-h-[1000px]' : 'max-h-[300px]'}`}
                    >

                      {/* Informações Básicas */}
                      <p className="text-[16px] font-bold text-center mb-4 text-black">Informações do participante</p>
                      <Separator size="4" className="mt-2" />

                      <DataList.Label >Nome:</DataList.Label>
                      <DataList.Value>{participant.personalData.fullName}</DataList.Value>
                      <Separator size="4" />

                      <DataList.Label>Pontuação do questionário:</DataList.Label>
                      <DataList.Value>{participant.adultForm?.totalPunctuation}</DataList.Value>
                      <Separator size="4" />

                      <DataList.Label>Quantidade de 2ªs Fontes:</DataList.Label>
                      <DataList.Value>{participant.secondSources?.length}</DataList.Value>
                      <Separator size="4" className="mb-2" />

                      {participant?._id && expandedParticipants[participant._id] && (
                        <>
                          <p className="text-[16px] font-bold text-center">Indicadores de AH/SD:</p>
                          <Separator size="4" className="mt-2" />

                          <DataList.Label>Pelo Questionário:</DataList.Label>
                          <DataList.Value className="gap-2">
                            {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                          </DataList.Value>
                          <Separator size="4" />

                          <DataList.Label>Pelo Pesquisador:</DataList.Label>
                          <DataList.Value className="gap-2">
                            {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                          </DataList.Value>
                        </>
                      )}

                      <Button
                        size="Small"
                        className="justify-end flex mt-2"
                        onClick={() =>
                          setExpandedParticipants((prev) => ({
                            ...prev,
                            [String(participant._id)]: !prev[String(participant._id)],
                          }))
                        }
                        title={
                          participant._id && expandedParticipants[participant._id]
                            ? "Veja menos"
                            : "Ver mais"
                        }
                        color={""}
                      >
                        <Icon.CaretDown
                          size={15}
                          className={`transition-all duration-300 ${participant._id && expandedParticipants[participant._id]
                            ? "rotate-180"
                            : ""
                            }`}
                        />
                      </Button>
                    </DataList.Item>
                  ))}
                </DataList.Root>
              </div>
            </>
          }
          className="mb-2"
          defaultValue="item-1"
        />


        <GridComponent className="gap-5 m-auto mt-2 " columns={2}>

          <Box>
            <Table.Root variant="surface" className=" text-black rounded rounded-b-lg w-full  font-roboto overflow-auto">
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


          <Box className="rounded overflow-hidden bg-white rounded-b-lg w-full pt-4  font-roboto border-2 p-2">
            <ApexChart options={options2} series={options2.series} type="bar" height={300} />
          </Box>

        </GridComponent>
        <Box className="w-full ">
          <Form.Root className="flex flex-row items-center justify-center truncate mb-2">
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
          className="mb-10"
          content={
            <>
              <Table.Root variant="surface" className="h-[500px] overflow-auto desktop">
                <Table.Header className="text-[16px]">
                  <Table.Row align="center" className="text-center">
                    <Table.ColumnHeaderCell className="border-l">Perguntas</Table.ColumnHeaderCell>
                    {selectedParticipants?.map((participant, index) => (
                      <Table.ColumnHeaderCell key={index} className="border-l italic text-[#0400119c]">{participant.personalData?.fullName}</Table.ColumnHeaderCell>
                    ))}
                  </Table.Row>
                </Table.Header>
                <Table.Body>

                  {selectedQuestions.map((question, questionIndex) => (
                    <Table.Row align="center" key={`question-${questionIndex}`}>
                      <Table.Cell className="text-wrap font-bold">{question.statement}</Table.Cell>

                      {selectedParticipants.map((participant, participantIndex) => {
                        const answerGroup = participant.adultForm?.answersByGroup?.find(
                          group => group.sequence === selectedBlockIndex
                        );

                        const matchedQuestion = answerGroup?.questions?.find(
                          q => q.statement === question.statement
                        );

                        let processedAnswer = '';
                        if (matchedQuestion) {
                          if (typeof matchedQuestion.answer === 'string') {
                            processedAnswer = matchedQuestion.answer.trim();
                          } else if (Array.isArray(matchedQuestion.answer)) {
                            processedAnswer = matchedQuestion.answer
                              .map(a => (typeof a === 'string' ? a.trim() : ''))
                              .filter(a => a) // Remove valores vazios
                              .join(', ');
                          }
                        }

                        const answerClass = () => {
                          const baseClass = "rounded py-1 w-[200px] text-center text-[#6f6e77]";

                          switch (processedAnswer) {
                            case 'Sempre':
                            case 'Frequentemente':
                              return `${baseClass} bg-green-400 !text-white font-bold`;
                            case 'Ás vezes':
                            case 'Raramente':
                            case 'Nunca':
                              return `${baseClass} bg-red-400 !text-white font-bold`;
                            default:
                              return baseClass;
                          }
                        };

                        return (
                          <Table.Cell
                            key={`participant-${participantIndex}`}
                            align="center"
                            className="border-l"
                          >
                            <p className={answerClass()}>
                              {processedAnswer || '-'}
                            </p>
                          </Table.Cell>
                        );
                      })}
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
              <div className="mobo">
                <DataList.Root orientation="vertical" className="!font-roboto">
                  {/* Pontuação geral por participante */}
                  <DataList.Item className="w-full p-3 rounded-lg mb-1 card-container">
                    <p className="text-[16px] font-bold text-center mb-4 text-black">Pontuação Geral do(s) Participante(s):</p>
                    {selectedParticipants.map((participant, index) => (
                      <div key={index} className="mb-2">
                        <DataList.Label className="font-semibold italic">{participant.personalData.fullName}:</DataList.Label>
                        <DataList.Value>{participant.adultForm?.totalPunctuation}</DataList.Value>
                      </div>
                    ))}
                  </DataList.Item>
                  <Separator size="4" className="my-2" />

                  {/* Perguntas e respostas */}
                  <DataList.Item className="w-full p-3 rounded-lg mb-1 card-container">
                    <p className="text-[16px] font-bold text-center mb-4 text-black">Questionário:</p>

                    {selectedQuestions.map((question, questionIndex) => (
                      <div key={`question-${questionIndex}`} className="mb-2">
                        <p className="text-[16px] font-bold mb-4 text-black">{question.statement}</p>

                        {selectedParticipants.map((participant, participantIndex) => {
                          const answerGroup = participant.adultForm?.answersByGroup?.find(
                            group => group.sequence === selectedBlockIndex
                          );

                          const matchedQuestion = answerGroup?.questions?.find(
                            q => q.statement === question.statement
                          );

                          let processedAnswer = '';
                          if (matchedQuestion) {
                            if (typeof matchedQuestion.answer === 'string') {
                              processedAnswer = matchedQuestion.answer.trim();
                            } else if (Array.isArray(matchedQuestion.answer)) {
                              processedAnswer = matchedQuestion.answer
                                .map(a => (typeof a === 'string' ? a.trim() : ''))
                                .filter(a => a)
                                .join(', ');
                            }
                          }

                          const answerStyle = () => {
                            const baseClass = "font-semibold text-center px-2 py-1 rounded justify-center";

                            switch (processedAnswer) {
                              case 'Sempre':
                              case 'Frequentemente':
                                return `${baseClass} bg-green-400 text-white`;
                              case 'Ás vezes':
                              case 'Raramente':
                              case 'Nunca':
                                return `${baseClass} bg-red-400 text-white`;
                              default:
                                return "gap-2";
                            }
                          };

                          return (
                            <div key={`participant-${participantIndex}`}>
                              <DataList.Label className="font-semibold italic">
                                {participant.personalData.fullName}:
                              </DataList.Label>

                              <DataList.Value className={`${answerStyle()} !mb-5`}>
                                {!processedAnswer ? (
                                  <p className="text-red-500">Nenhuma resposta encontrada.</p>
                                ) : (
                                  processedAnswer
                                )}
                              </DataList.Value>
                            </div>
                          );
                        })}

                        <Separator size="4" className="my-2" />
                      </div>
                    ))}
                  </DataList.Item>
                </DataList.Root>
              </div>

            </>
          }
          defaultValue={""}
        />
      </Box >
    </>
  );
};

export default CompareParticipantsSelected;