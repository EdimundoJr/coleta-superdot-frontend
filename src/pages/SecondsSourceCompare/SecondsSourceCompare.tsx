import { useLocation } from "react-router-dom";
import { IParticipant, ISecondSource } from "../../interfaces/participant.interface";
import * as Icon from "@phosphor-icons/react";
import { Flex, Table, Box, Skeleton, Tooltip } from "@radix-ui/themes";
import { Header } from "../../components/Header/Header";
import Accordeon from "../../components/Accordeon/Accordeon";
import { GridComponent } from "../../components/Grid/Grid";
import ApexChart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import { SelectField } from "../../components/SelectField/SelectField";
import * as Form from "@radix-ui/react-form";
import { Button } from "../../components/Button/Button";
import { useState } from "react";


interface LocationState {
    participant: IParticipant;
}

const SecondsSourceCompare = () => {
    const location = useLocation();
    const { participant } = location.state as LocationState;
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
        { title: "Características Gerais", numbersOfquestions: `5-18`, numberBlocks: 1 },
        { title: "Habilidades acima da média", numbersOfquestions: `19-30`, numberBlocks: 2 },
        { title: "Criatividade", numbersOfquestions: `31-45`, numberBlocks: 3 },
        { title: "Comprometimento com a tarefa", numbersOfquestions: `46-58`, numberBlocks: 4 },
        { title: "Liderança", numbersOfquestions: `59-63`, numberBlocks: 5 },
        { title: "Atividades artísticas e esportivas", numbersOfquestions: `64-80`, numberBlocks: 6 },
    ];

    function calcularPunctuation(participants: IParticipant[] | undefined): number[][] {
        if (!participants || participants.length === 0) {
            return [[0, 0, 0, 0, 0, 0]];
        }

        let característicasGerais = 0;
        let HabilidadesAcimaDaMédia = 0;
        let criatividade = 0;
        let ComprometimentoComATarefa = 0;
        let Liderança = 0;
        let AtividadesArtísticasEsportivas = 0;

        for (const participant of participants) {
            if (participant.adultForm && participant.adultForm.answersByGroup) {
                for (const group of participant.adultForm.answersByGroup) {
                    for (const question of group.questions) {
                        const answerPoints = question.answerPoints ?? 0;
                        switch (group.groupName) {
                            case "Características Gerais":
                                característicasGerais += answerPoints;
                                break;
                            case "Habilidade Acima da Média":
                                HabilidadesAcimaDaMédia += answerPoints;
                                break;
                            case "Criatividade":
                                criatividade += answerPoints;
                                break;
                            case "Comprometimento da Tarefa":
                                ComprometimentoComATarefa += answerPoints;
                                break;
                            case "Liderança":
                                Liderança += answerPoints;
                                break;
                            case "Atividades Artísticas e Esportivas":
                                AtividadesArtísticasEsportivas += answerPoints;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }

        return [
            [
                característicasGerais,
                HabilidadesAcimaDaMédia,
                criatividade,
                ComprometimentoComATarefa,
                Liderança,
                AtividadesArtísticasEsportivas,
            ],
        ];
    }

    function calcularPontuacaoSegundasFontes(secondSources: ISecondSource[]): number[][] {
        const punctuationS: number[][] = [];

        for (const secondSource of secondSources) {
            let segundaFontePontuacao = [0, 0, 0, 0, 0, 0];

            if (secondSource.adultForm && secondSource.adultForm.answersByGroup) {
                for (const group of secondSource.adultForm.answersByGroup) {
                    for (const question of group.questions) {
                        const answerPoints = question.answerPoints ?? 0;
                        switch (group.groupName) {
                            case "Características Gerais":
                                segundaFontePontuacao[0] += answerPoints;
                                break;
                            case "Habilidade Acima da Média":
                                segundaFontePontuacao[1] += answerPoints;
                                break;
                            case "Criatividade":
                                segundaFontePontuacao[2] += answerPoints;
                                break;
                            case "Comprometimento da Tarefa":
                                segundaFontePontuacao[3] += answerPoints;
                                break;
                            case "Liderança":
                                segundaFontePontuacao[4] += answerPoints;
                                break;
                            case "Atividades Artísticas e Esportivas":
                                segundaFontePontuacao[5] += answerPoints;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            punctuationS.push(segundaFontePontuacao);
        }
        return punctuationS;
    }

    const secondSources: ISecondSource[] = participant.secondSources || [];
    const punctuationP = calcularPunctuation([participant])[0];
    const punctuationS = calcularPontuacaoSegundasFontes(secondSources);
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
            {
                name: 'Avaliado',
                data: punctuationP
            },
            ...punctuationS.map((data, index) => ({
                name: `ASF ${index + 1}`,
                data: data
            }))
        ],
        colors: randomColors,
        chart: {
            type: 'bar',
            height: 500,
            stacked: false,
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
                columnWidth: 20,
                horizontal: false,
                borderRadius: 5,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                dataLabels: {
                    position: 'top',

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
            text: 'Pontuação do Avaliado e das Segundas Fontes por Bloco',
            align: 'left',
            style: {
                fontSize: '15px',
            }
        },
    };

    const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedBlockIndex(parseInt(event.target.value));
    };
    const selectedQuestions = secondSources[0].adultForm?.answersByGroup?.[selectedBlockIndex]?.questions || [];

    return (
        <Flex direction="column" className="relative ml-2 border-t-4 border-primary rounded-tl-[30px] w-full bg-[#fbfaff] p-5">
            <Header title="Comparação com Segunda Fonte" icon={<Icon.Books size={24} />} />
            <Box className="w-[90%] m-auto">
                <Accordeon
                    title="Informações do Participante Avaliado"
                    content={
                        <Table.Root variant="surface" className="w-full truncate">
                            <Table.Header className="text-[18px]">
                                <Table.Row>
                                    <Table.ColumnHeaderCell colSpan={4} className="border-r"></Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell colSpan={2} className="border-r text-center">Indicadores de AH/SD de acordo com o :</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Nome do Avaliado</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Pontuação</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Idade</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Gênero</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Pesquisador</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row align="center">
                                    <Table.Cell justify="center">{participant.personalData.fullName}</Table.Cell>
                                    <Table.Cell justify="center">{participant.adultForm?.totalPunctuation}</Table.Cell>
                                    <Table.Cell justify="center">{handleAge(participant.personalData.birthDate)}</Table.Cell>
                                    <Table.Cell justify="center">{participant.personalData.gender}</Table.Cell>
                                    <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>
                                    <Table.Cell justify="center">
                                        {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table.Root>
                    }
                    className="mb-2"
                    defaultValue="item-1"
                />
                <Accordeon
                    title="Informações do(s) Participante(s) Avaliado(s) Segundas Fontes"
                    content={
                        <Table.Root variant="surface" className="w-full truncate">
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Identificação</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Nome do Avaliado</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Pontuação</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Idade</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Grau de Escolaridade</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Relação com o Avaliado</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Tempo de Relação com o Avaliado</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {participant?.secondSources?.map((secondSource, index) => (
                                    <Table.Row align="center" key={index}>
                                        <Table.Cell justify="center">
                                            <Tooltip content={`Avaliado Segundas Fontes - ${index + 1}`}>
                                                <Box>
                                                    ASF - {index + 1}
                                                </Box>
                                            </Tooltip>

                                        </Table.Cell>
                                        <Table.Cell justify="center">{secondSource.personalData?.fullName}</Table.Cell>
                                        <Table.Cell justify="center">{secondSource.adultForm?.totalPunctuation}</Table.Cell>
                                        <Table.Cell justify="center">{handleAge(secondSource.personalData?.birthDate)}</Table.Cell>
                                        <Table.Cell justify="center">{secondSource.personalData?.educationLevel}</Table.Cell>
                                        <Table.Cell justify="center">{secondSource.personalData?.relationship}</Table.Cell>
                                        <Table.Cell justify="center">{secondSource.personalData?.relationshipTime}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    }
                    defaultValue=""
                />

                <GridComponent className="gap-5  m-auto mt-2 " columns={2}>
                    <Skeleton loading={false}>
                        <Box>
                            <Table.Root variant="surface" className="truncate text-black rounded rounded-b-lg w-full drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto overflow-auto">
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
                                            <Table.Cell justify="center">{index + 1}</Table.Cell>
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
                    <Form.Root className="flex flex-row items-center justify-center truncate">
                        <Flex>
                            <SelectField label="FILTRAR PERGUNTAS POR BLOCO" name="blocks" onChange={handleSelectChange}>
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
                        <Table.Root variant="surface" className="w-full truncate h-[500px] overflow-auto">
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Perguntas</Table.ColumnHeaderCell>
                                    {participant?.secondSources?.map((secondSource, index) => (
                                        <Table.ColumnHeaderCell key={index} className="border-l">{secondSource.personalData?.fullName} </Table.ColumnHeaderCell>
                                    ))}
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                <Table.Row align="center">
                                    <Table.Cell>Pontuação:</Table.Cell>
                                    {participant?.secondSources?.map((secondSource, index) => (
                                        <Table.Cell key={index} justify="center">
                                            {secondSource.adultForm?.totalPunctuation}
                                        </Table.Cell>

                                    ))}
                                </Table.Row>
                                {selectedQuestions?.map((question, questionIndex) => (
                                    <Table.Row align="center" key={questionIndex}>
                                        <Table.Cell className="text-wrap">{question?.statement}</Table.Cell>
                                        {secondSources.map((secondSouce, secondSouceIndex) => {
                                            const answers = secondSouce.adultForm?.answersByGroup?.[selectedBlockIndex]?.questions
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
                                                <Table.Cell key={secondSouceIndex} align="center" className="border-l">
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
                    defaultValue={""} />

            </Box >
        </Flex >
    );
};

export default SecondsSourceCompare;
