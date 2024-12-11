import { useEffect, useState } from "react";
import { ISample } from "../../interfaces/sample.interface";
import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import { SelectField } from "../../components/SelectField/SelectField";
import * as Icon from '@phosphor-icons/react'
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { Box, Checkbox, Dialog, Flex, IconButton, Select, Table, Text, TextField, Tooltip, HoverCard, Skeleton, AlertDialog } from "@radix-ui/themes";
import * as Theme from "@radix-ui/themes"
import { IParticipant } from "../../interfaces/participant.interface";
import { Header } from "../../components/Header/Header";
import ApexChart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import { GridComponent } from "../../components/Grid/Grid";
import { answerByGender, AnswerByGender } from "../../api/sample.api";
import { Button } from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import WordCloudGenerator from "../../components/WordCloud/WordCloudGenerator";

const AnalysisPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [sample, setSample] = useState({} as ISample);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    const [isCheckedWC, setIsCheckedWC] = useState<boolean[]>([])
    const [showNewComponent, setShowNewComponent] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<IParticipant[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dados, setDados] = useState<null | AnswerByGender>(null);
    const [error, setError] = useState(null);
    const [notificationDescription, setNotificationDescription] = useState("");
    const [notificationTitle, setNotificationTitle] = useState("");
    const [openModalCompare, setOpenModalCompare] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalCloud, setOpenModalCloud] = useState(false);
    const [openModalKA, setOpenModalKA] = useState(false);



    const itemsPerPage = 5;
    const totalParticipants = sample.participants?.length || 0;
    const totalPages = Math.ceil(totalParticipants / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalParticipants);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages)));
    };

    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <Theme.Button
                    key={i}
                    variant={currentPage === i ? "solid" : "soft"}
                    onClick={() => handlePageChange(i)}
                    className="w-10 hover:cursor-pointer"
                >
                    {i}
                </Theme.Button>
            );
        }
        return pages;
    };

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await answerByGender()
                setDados(response);
                //setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setNotificationTitle("Erro no servidor.");
                setNotificationDescription("Não foi possível carregar os dados do Dashboard.");
            }
        };
        fetchDados();
    }, []);



    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };


    useEffect(() => {
        if (stateWithSample(location.state)) {
            setSample(location.state.sample);
        } else {
            navigate("/app/my-samples");
        }
    }, [location, navigate]);


    const handleCompareSource = (participant: IParticipant) => {
        if (!participant.secondSources?.length || participant.secondSources?.length === 0) {
            return;
        }

        navigate("/app/my-samples/seconds-source-compare", {
            state: {
                participant,
            },
        });
    };

    const handleEvaluateAutobiography = (participant: IParticipant, sample: ISample) => {
        navigate("/app/my-samples/evaluate-autobiography", {
            state: {
                sample,
                participant,
            },
        });
    };

    useEffect(() => {
        if (isCheckedAll) {
            setIsChecked(Array(sample.participants?.length).fill(true));
        } else {
            setIsChecked(Array(sample.participants?.length).fill(false));
        }
    }, [isCheckedAll, sample.participants]);

    const handleCheckAll = () => {
        setIsCheckedAll(!isCheckedAll);
        setIsChecked(sample.participants?.map(() => !isCheckedAll) || []);
    };


    const handleChange = (index: number) => {
        const newCheckedState = isChecked.map((item, i) => (i === index ? !item : item));
        setIsChecked(newCheckedState);
    };

    const handleChangeWC = (index: number) => {
        const updatedCheckedWC = [...isCheckedWC];
        updatedCheckedWC[index] = !updatedCheckedWC[index];
        setIsCheckedWC(updatedCheckedWC);

    };

    const handleCompareSelected = () => {
        const selectedParticipants = sample.participants?.filter((participant, index) => isChecked[index]);

        if (!selectedParticipants || selectedParticipants.length === 0) {
            setOpenModalCompare(true)
            return;
        }

        navigate("/app/my-samples/compare-participants-selected", {
            state: {
                selectedParticipants,
            },
        });
    };

    const handleShowPunctuation = () => {
        setOpenModal(true)
        return;
    }
    const handleShowKA = () => {
        setOpenModalKA(true)
        return;
    }

    const handleShowCloud = () => {
        const selectedParticipants = sample.participants?.filter((participant, index) => isChecked[index]);
        if (!selectedParticipants || selectedParticipants.length === 0) {
            setOpenModalCompare(true);
            setSelectedParticipants([]);
            setShowNewComponent(false);
        } else {
            setOpenModalCloud(true);
            const participantesBio = selectedParticipants.map((participant) => (
                participant?.autobiography?.text
            )).filter(text => text !== undefined);
            setSelectedParticipants(participantesBio);
            setShowNewComponent(false);
        }
    };

    const cloudWords = () => {
        if (showNewComponent === true) {
            setShowNewComponent(false);
        } else {
            setShowNewComponent(true);
        }
    };



    const getFormattedBirthDate = (birthDate: Date | string | undefined) => {
        if (!birthDate) return '';
        const dateObj = typeof birthDate === 'string' ? new Date(birthDate) : birthDate;
        if (!(dateObj instanceof Date) || isNaN(dateObj.getTime())) {
            console.error('birthDate não é uma data válida:', birthDate);
            return '';
        }
        return dateObj.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
    };


    function calcularPorcentagemDeSuperdotados(participants: IParticipant[] | undefined) {
        if (!participants || participants.length === 0) {
            return 0;
        }

        console.log(participants)
        const superdotados = participants.reduce((count, participant) => {
            if (participant.adultForm?.giftednessIndicators == true) {
                return count + 1;
            }
            return count;
        }, 0);

        return Math.round((superdotados / participants.length) * 100 * 100) / 100;
    }

    function calcularFrequencia(participants: IParticipant[] | undefined): number[][] {
        if (!participants || participants.length === 0) {
            return [[0, 0, 0, 0, 0]];
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



    const options: ApexOptions = {
        series: [calcularPorcentagemDeSuperdotados(sample.participants)],
        colors: ["#B57CFF"],
        chart: {
            type: 'radialBar',
            height: 350,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        plotOptions: {
            radialBar: {
                startAngle: -90,
                endAngle: 90,
                track: {
                    background: '#000000bb',
                    startAngle: -90,
                    endAngle: 90,
                },
                dataLabels: {
                    name: {
                        show: false,
                    },
                    value: {
                        fontSize: "50px",
                        show: true
                    }
                }
            }
        },
        fill: {
            type: "gradient",
            gradient: {
                shade: "dark",
                type: "horizontal",
                gradientToColors: ["#7A47E4"],
                stops: [0, 100]
            }
        },
        title: {
            text: 'Quantidade de Avaliados que Possuem indicadores AH/SD',
            align: 'left',
            style: {
                fontSize: '20px',
            }
        },

    };

    const options2: ApexOptions = {
        series: [{
            name: 'Masculino',
            data: calcularFrequencia(sample.participants)[0]
        }, {
            name: 'Feminino',
            data: calcularFrequencia(sample.participants)[1]
        }],
        colors: ["#7A47E4", "#b57cffd2"],
        chart: {
            type: 'bar',
            height: 350,
            stacked: false,
            toolbar: {
                show: true
            },
            zoom: {
                enabled: true
            }
        },
        responsive: [{
            breakpoint: 480,
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
                horizontal: true,
                borderRadius: 5,
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'last',
                dataLabels: {
                    total: {
                        enabled: false,
                        style: {
                            fontSize: '13px',
                            fontWeight: 900
                        }
                    }
                }
            },
        },
        xaxis: {
            categories: ['Frequentemente', 'Sempre', 'Ás vezes', 'Raramente', 'Nunca'],
        },
        legend: {
            position: 'right',
            offsetY: 40
        },
        fill: {
            opacity: 1
        },
        title: {
            text: 'Frequência de Respostas por Gênero',
            align: 'left',
            style: {
                fontSize: '20px',
            }
        },
    };

    const selectItensPM = [
        { value: "100", label: "100% (219 a 242 pontos)" },
        { value: "90", label: "90% (195 a 218 pontos)" },
        { value: "80", label: "80% (170 a 194 pontos)" },
        { value: "70", label: "70% (146 a 169 pontos)" },
        { value: "60", label: "60% (122 a 145 pontos)" },
        { value: "50", label: "50% (98 a 121 pontos)" },
        { value: "40", label: "40% (73 a 97 pontos)" },
        { value: "30", label: "30% (49 a 73 pontos)" },
        { value: "20", label: "20% (25 a 48 pontos)" },
        { value: "10", label: "10% (0 a 24 pontos)" }
    ];

    const selectItensKA = [
        { label: "Selecione" },
        { label: "Memória" },
        { label: "Dança" },
        { label: "História" },
        { label: "Química" },
        { label: "Física" },
        { label: "Pintura" },
        { label: "Biologia" },
        { label: "Esportes" },
        { label: "Liderança" },
        { label: "Astronomia" },
        { label: "Música" },
        { label: "Criatividade" },
        { label: "Cinema" },
        { label: "Observação" },
        { label: "Matemática" },
        { label: "Abstração" },
        { label: "Comunicação" },
        { label: "Português" },
        { label: "Planejamento" },
        { label: "Fotografia" },
        { label: "Geografia" },
        { label: "Línguas estrangeiras" },
        { label: "Escultura" },
        { label: "Política" },
        { label: "Mitologia" },
        { label: "Arqueologia" },
    ];

    const CloudWord = [
        { title: "Respostas subjetivas" },
        { title: "Autobiografia" },
        { title: "Áreas do Saber" },
    ];

    return (

        <>


            <Header title="Analisar Amostra" icon={<Icon.Books size={24} className="items-center" />} />

            <Box className="mb-8 w-full">
                <Text size="4" as="label" className="font-bold">{sample.sampleGroup} - Total de {sample.participants?.length} Avaliado(s).</Text>
                <Box className="w-full mt-2">
                    <Form.Root className="flex items-center justify-between truncate">
                        <Form.Submit asChild>
                            <Button
                                size="Large"
                                className="mb-4 items-center hover:cursor-pointer mr-3"
                                title={" Filtrar"}
                                color={"primary"}
                                children={<Icon.Funnel size={20} color="white" />}>
                            </Button>
                        </Form.Submit>
                        <InputField label="" icon={<Icon.MagnifyingGlass />} placeholder="Pesquisar pelo nome do avaliado..." name="participant-name" />
                        <Flex >
                            <SelectField label="Área do Saber" name="knowledge-area" defaultValue="Selecione">
                                {selectItensKA.map(option => (
                                    <option className="hover:cursor-pointer" key={option.label} value={option.label}>
                                        {option.label}
                                    </option>
                                ))}
                            </SelectField>
                            <SelectField label="Pontuação Mínima" name="min-punctuation">
                                {selectItensPM.map(option => (
                                    <option className="hover:cursor-pointer" key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </SelectField>
                            <Button size="Large" onClick={() => setFilters({})} type="reset" className="items-center w-[300px] ml-3" color={"primary"} title={"Limpar Filtro"}></Button>
                        </Flex>
                    </Form.Root>
                </Box>
                <Flex direction="row" justify="center" gap="6" className="mb-8">
                    <Modal
                        open={openModalCompare}
                        setOpen={setOpenModalCompare}
                        title={"Você não selecionou nenhum participante."}
                        accessibleDescription={"Para comparar as respostas entre os avaliados ou gerar a nuvem de palavras, você deve selecionar pelo menos um participante."} />

                    <Button
                        size="Medium"
                        onClick={() => handleCompareSelected()}
                        title={"Comparar selecionados"}
                        color={"primary"} />

                    <Modal
                        open={openModal}
                        setOpen={setOpenModal}
                        title={"Pontuação:"}
                        accessibleDescription={""}
                        children={
                            <Table.Root variant="ghost" className="w-full mt-3">
                                <Table.Header className="text-[16px]">
                                    <Table.Row align="center" className="text-center">
                                        <Table.ColumnHeaderCell colSpan={2} className="border-l">Nº da pergunta do Questionário</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell colSpan={5} className="border-l"></Table.ColumnHeaderCell>

                                    </Table.Row>
                                </Table.Header>
                                <Table.Header className="text-[16px]">
                                    <Table.Row align="center" className="text-center">
                                        <Table.ColumnHeaderCell className="border-l">QIIAHSD - Adulto</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">QIIAHSD - Adulto -
                                            2ª Fonte</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">Respostas comuns</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">Pontos</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">Respostas não comuns</Table.ColumnHeaderCell>
                                        <Table.ColumnHeaderCell className="border-l">Pontos</Table.ColumnHeaderCell>
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">-</Table.Cell>
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">Sim</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">Não</Table.Cell>
                                        <Table.Cell justify="center">0</Table.Cell>
                                        <Table.Cell justify="center">-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">-</Table.Cell>
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">Sim</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">Não</Table.Cell>
                                        <Table.Cell justify="center">0</Table.Cell>
                                        <Table.Cell justify="center">-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">-</Table.Cell>
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">Sim</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">Não</Table.Cell>
                                        <Table.Cell justify="center">0</Table.Cell>
                                        <Table.Cell justify="center">-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">-</Table.Cell>
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">Sim</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">Não</Table.Cell>
                                        <Table.Cell justify="center">0</Table.Cell>
                                        <Table.Cell justify="center">-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">5</Table.Cell>
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">Sim</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">Não</Table.Cell>
                                        <Table.Cell justify="center">0</Table.Cell>
                                        <Table.Cell justify="center">-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">6</Table.Cell>
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">Sim</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">Não</Table.Cell>
                                        <Table.Cell justify="center">0</Table.Cell>
                                        <Table.Cell justify="center">-</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                                <Table.Body>
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">1</Table.Cell>
                                        <Table.Cell justify="center">2</Table.Cell>
                                        <Table.Cell justify="center">3</Table.Cell>
                                        <Table.Cell justify="center">4</Table.Cell>
                                        <Table.Cell justify="center">5</Table.Cell>
                                        <Table.Cell justify="center">6</Table.Cell>
                                        <Table.Cell justify="center">7</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table.Root>
                        } />

                    <Button
                        size="Medium"
                        onClick={() => handleShowPunctuation()}
                        title={"Pontuação do questionário"}
                        color={"primary"} />


                    <Modal
                        open={openModalCloud}
                        setOpen={setOpenModalCloud}
                        title={"Selecione as fontes de palavras:"}
                        accessibleDescription={""}
                    >
                        <Flex justify="between" gap="8" className="pt-4 pb-4">
                            {CloudWord.map((itens, index) => (
                                <Text as="label" size="3" >
                                    <Flex gap="2" className="p-1">
                                        <Checkbox
                                            key={index}
                                            className="hover:cursor-pointer"
                                            onCheckedChange={() => handleChangeWC(index)}
                                        />
                                        {itens.title}
                                    </Flex>
                                </Text>
                            ))}
                        </Flex>
                        <Flex justify="end">
                            <Button
                                onClick={cloudWords}
                                className="items-end"
                                color="green"
                                title={"Confirmar"}
                                size={"Extra Small"}
                            />
                        </Flex>
                        {showNewComponent === true ?
                            <Box>
                                <p className="text-lg font-bold text-center mb-4">Quantidade de Avaliados : {selectedParticipants.length} </p>

                                <WordCloudGenerator texts={selectedParticipants} />
                            </Box>
                            : <></>
                        }
                    </Modal>
                    <Button
                        size="Medium"
                        onClick={handleShowCloud}
                        title={"Gerar nuvem de palavras"}
                        color={"primary"}
                    />
                </Flex>
                <Box>
                    <Table.Root variant="surface" className="w-full truncate drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)]" >
                        <Table.Header className="text-[14px] ">
                            <Table.Row className="bg-red" >
                                <Table.ColumnHeaderCell colSpan={4} className="border-l border-none" align="center">Informações do participante</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={2} className="border-l" align="center">Indicadores de AH/SD</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={3} className="border-l" align="center">Áreas do saber</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>

                        <Table.Header className="text-[14px] ">
                            <Table.Row>
                                <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r" >
                                    {isCheckedAll ? "Desmarcar Todos" : "Selecionar Todos "}

                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={3} className="border-r" ></Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={2} className="border-r text-center" >De acordo com o :</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={1} className="border-r text-center" >Indicadas pelo avaliado</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={2} className="text-center  border-r ">Indicadas pelo pesquisador</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={1} ></Table.ColumnHeaderCell>
                            </Table.Row>

                        </Table.Header>
                        <Table.Header className="text-[14px] ">
                            <Table.Row align={"center"} className="text-center">
                                <Table.ColumnHeaderCell colSpan={1}  >
                                    <Checkbox className="hover:cursor-pointer" onClick={handleCheckAll} color="violet" />
                                </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l "> Nome do Avaliado </Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l ">Pontuação</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l ">Quant. 2ªs fontes</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">Pesquisador</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">Áreas gerais</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">Áreas específicas</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l">
                                    <Flex gap="3" align="center" justify="center">
                                        <Text>Ações</Text>

                                        <AlertDialog.Root>
                                            <AlertDialog.Trigger>
                                                <Box>
                                                    <Tooltip content={"Visualizar Ações"}>
                                                        <IconButton size="1" variant="surface" radius="full" className="hover:cursor-pointer">
                                                            <Icon.QuestionMark size={15} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                            </AlertDialog.Trigger>
                                            <AlertDialog.Content>
                                                <AlertDialog.Title>Tipos de Ação:</AlertDialog.Title>
                                                <AlertDialog.Description>
                                                    <IconButton radius="full" variant="solid" >
                                                        <Icon.IdentificationCard size={20} />
                                                    </IconButton>
                                                </AlertDialog.Description>
                                                <AlertDialog.Description>
                                                    <IconButton radius="full" variant="solid">
                                                        <Icon.ClipboardText size={20} />
                                                    </IconButton>
                                                    <Text>
                                                        teste
                                                    </Text>
                                                </AlertDialog.Description>
                                                <AlertDialog.Description>
                                                    <IconButton radius="full" variant="solid">
                                                        <Icon.ClipboardText size={20} />
                                                    </IconButton>
                                                </AlertDialog.Description>
                                                <AlertDialog.Action>
                                                    <Flex gap="3" mt="4" justify="end">
                                                        <AlertDialog.Cancel>
                                                            <Button
                                                                color="red"
                                                                title={"Voltar"} size={""}
                                                            >

                                                            </Button>
                                                        </AlertDialog.Cancel>
                                                    </Flex>
                                                </AlertDialog.Action>
                                            </AlertDialog.Content>
                                        </AlertDialog.Root>
                                    </Flex>
                                </Table.ColumnHeaderCell>

                            </Table.Row>
                        </Table.Header>
                        <Table.Body className="text-[14px]">
                            {sample.participants?.slice(startIndex, endIndex).map((participant, idx) => (
                                <Table.Row align={"center"}

                                    className={isChecked[startIndex + idx] ? 'bg-violet-100' : ''}
                                    key={startIndex + idx}>
                                    <Table.Cell justify="center">
                                        <Checkbox
                                            className="hover:cursor-pointer"
                                            checked={isChecked[startIndex + idx] ?? false}
                                            onCheckedChange={() => handleChange(startIndex + idx)}
                                            color="violet" />
                                    </Table.Cell>
                                    <Table.Cell justify="center"> {getFirstAndLastName(participant.personalData.fullName)}</Table.Cell>
                                    <Table.Cell justify="center" >{participant.adultForm?.totalPunctuation}</Table.Cell>
                                    <Table.Cell justify="center">{participant.secondSources?.length}</Table.Cell>
                                    <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>
                                    <Table.Cell justify="center">
                                        <Select.Root>
                                            <Select.Trigger placeholder="Definir..." variant="ghost" />
                                            <Select.Content >
                                                <Select.Item value="definir" >Definir</Select.Item>
                                                <Select.Item value="true">Sim</Select.Item>
                                                <Select.Item value="false">Não</Select.Item>
                                            </Select.Content>
                                        </Select.Root>
                                    </Table.Cell>
                                    <Table.Cell justify="center">
                                        <Flex align="center" direction="row" justify="center" >
                                            <Text as="label" className="pr-3">
                                                {participant.adultForm?.knowledgeAreas?.[0]}{'...'}{''}
                                            </Text>

                                            <HoverCard.Root>
                                                <HoverCard.Trigger >
                                                    <IconButton size="1" variant="surface" radius="full">
                                                        <Icon.Eye size={15} className="hover:cursor-pointer" />
                                                    </IconButton>
                                                </HoverCard.Trigger>
                                                <HoverCard.Content size="3" >
                                                    <Text as="div" size="3" trim="both">
                                                        {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                                                            <span key={index}>
                                                                {area}
                                                                {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ", "}
                                                            </span>
                                                        ))}
                                                    </Text>
                                                </HoverCard.Content>
                                            </HoverCard.Root>
                                        </Flex>

                                    </Table.Cell>
                                    <Table.Cell justify="center">
                                        <Modal
                                            open={openModalKA}
                                            setOpen={setOpenModalKA}
                                            title={"Selecione as Áreas Gerias:"}
                                            accessibleDescription={"Para comparar as respostas entre os avaliados ou gerar a nuvem de palavras, você deve selecionar pelo menos um participante."} >
                                                inserir aqui
                                            </Modal>
                                        <Button title={"Definir"} color={"primary"} size={"Medium"} className="mt-0" onClick={() => handleShowKA()} />
                                    </Table.Cell>
                                    <Table.Cell justify="center">

                                        <Button title={"Definir"} color={"primary"} size={"Medium"} className="mt-0" />
                                    </Table.Cell>
                                    <Table.Cell justify="center">
                                        <Flex justify="center" align="center" className="gap-4">
                                            <Dialog.Root >
                                                <Dialog.Trigger>
                                                    <Box>
                                                        <Tooltip content="Visualizar Informações completas do Participante">
                                                            <IconButton size="2" color="lime" radius="full" variant="outline" className="hover:cursor-pointer hover:translate-y-[3px] transition-all ease-in-out">
                                                                <Icon.IdentificationCard size={20} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </Dialog.Trigger>
                                                <Dialog.Content style={{ maxWidth: 450 }}>
                                                    <Dialog.Title align="center" mb="5" >Informações Gerais do Participante</Dialog.Title>
                                                    <Flex direction="column" gap="3">
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Nome Completo
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.fullName}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Data de Nascimento
                                                            <TextField.Root
                                                                defaultValue={getFormattedBirthDate(participant.personalData.birthDate)}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Gênero
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.gender}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Telefone
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.phone}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            E-mail
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.email}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Estado Civil
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.maritalStatus}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Trabalho
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.job}
                                                                disabled
                                                            />
                                                        </Text>
                                                        <Text as="label" size="2" mb="1" weight="bold">
                                                            Ocupação
                                                            <TextField.Root
                                                                defaultValue={participant.personalData.occupation}
                                                                disabled
                                                            />
                                                        </Text>
                                                    </Flex>

                                                    <Flex gap="3" mt="4" justify="end">
                                                        <Dialog.Close>
                                                            <Button color="red" className="w-[100px]" title={"Fechar"} size={""}>

                                                            </Button>
                                                        </Dialog.Close>
                                                    </Flex>
                                                </Dialog.Content>
                                            </Dialog.Root>
                                            <AlertDialog.Root>
                                                <AlertDialog.Trigger>
                                                    <Box className="flex gap-3" onClick={() => handleCompareSource(participant)}>
                                                        <Tooltip content="Comparar as respostas do avaliado com as respostas das 2ª fontes">
                                                            <IconButton color="cyan" radius="full" variant="outline" className="hover:cursor-pointer  hover:translate-y-[3px] transition-all ease-in-out">
                                                                <Icon.ClipboardText size={20} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </AlertDialog.Trigger>
                                                <AlertDialog.Content >
                                                    <AlertDialog.Title> Nenhuma pessoa foi identificada como segunda fonte desse avaliado. </AlertDialog.Title>
                                                    <AlertDialog.Description size="2">
                                                        Para mostrar as respostas do avaliado com as da(s) segunda(s) fonte(s), é necessário a finalização do questionário de uma pessoa adicional, atuando como a segunda fonte.
                                                    </AlertDialog.Description>

                                                    <Flex gap="3" mt="4" justify="end">
                                                        <AlertDialog.Cancel>
                                                            <Theme.Button variant="soft" color="red" className="hover:cursor-pointer">
                                                                Voltar
                                                            </Theme.Button>
                                                        </AlertDialog.Cancel>

                                                    </Flex>
                                                </AlertDialog.Content>
                                            </AlertDialog.Root>


                                            <Box className="flex gap-3" onClick={() => handleEvaluateAutobiography(participant, sample)}>
                                                <Tooltip content="Visualizar Autobiaografia do participante">
                                                    <IconButton color="bronze" radius="full" variant="outline" className="hover:cursor-pointer  hover:translate-y-[3px] transition-all ease-in-out">
                                                        <Icon.IdentificationBadge size={20} />
                                                    </IconButton>
                                                </Tooltip>
                                            </Box>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Box>
                <Flex gap="2" mt="4" justify="center" align="center">
                    <Theme.Button className="hover:cursor-pointer" variant="surface" onClick={() => handlePageChange(currentPage - 1)}>{`<`}</Theme.Button>
                    {renderPagination()}
                    <Theme.Button className="hover:cursor-pointer" variant="surface" onClick={() => handlePageChange(currentPage + 1)}>{`>`}</Theme.Button>
                </Flex>
                <GridComponent
                    className="gap-5 mt-5 m-auto w-[80%] "
                    children={
                        <>
                            <Skeleton loading={false} >
                                <Box className="rounded overflow-hidden  bg-white rounded-b-lg w-full  pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto border-2 p-2">
                                    <ApexChart options={options} series={options.series} type="radialBar" height={450} />
                                </Box>
                            </Skeleton>
                            <Skeleton loading={false} >
                                <Box className="rounded overflow-hidden  bg-white rounded-b-lg w-full   pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto border-2 p-2">
                                    <ApexChart options={options2} series={options2.series} type="bar" height={300} />
                                </Box>
                            </Skeleton>

                        </>}
                    columns={2}>

                </GridComponent>
            </Box >
        </>

    );
};

export default AnalysisPage;
