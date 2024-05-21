import { useEffect, useState } from "react";
import { ISample } from "../../interfaces/sample.interface";
import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import { SelectField } from "../../components/SelectField/SelectField";
import * as Icon from '@phosphor-icons/react'
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { AlertDialog, Box, Button, Checkbox, Dialog, Flex, IconButton, Select, Table, Text, TextField, Tooltip, HoverCard, Skeleton } from "@radix-ui/themes";
import { IParticipant } from "../../interfaces/participant.interface";
import { Header } from "../../components/Header/Header";
import ApexChart from "react-apexcharts";
import { ApexOptions } from 'apexcharts';
import { GridComponent } from "../../components/Grid/Grid";
import { answerByGender, AnswerByGender } from "../../api/sample.api";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";



const AnalysisPage = () => {
    const [sample, setSample] = useState({} as ISample);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [currentPage, setCurrentPage] = useState(1);
    const [dados, setDados] = useState<null | AnswerByGender>(null);
    const [error, setError] = useState(null);
    const [notificationDescription, setNotificationDescription] = useState("");
    const [notificationTitle, setNotificationTitle] = useState("");


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
                <Button
                    key={i}
                    variant={currentPage === i ? "solid" : "soft"}
                    onClick={() => handlePageChange(i)}
                    className="w-10 hover:cursor-pointer"
                >
                    {i}
                </Button>
            );
        }
        return pages;
    };

    useEffect(() => {
        const fetchDados = async () => {
            try {
                const response = await answerByGender()
                setDados(response);
                console.log(response)
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

        navigate("/app/seconds-source-compare", {
            state: {
                participant,
            },
        });
    };

    const handleEvaluateAutobiography = (participant: IParticipant) => {
        navigate("/app/evaluate-autobiography", {
            state: {
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

    const handleCompareSelected = () => {
        const selectedParticipants = sample.participants?.filter((participant, index) => isChecked[index]);

        if (!selectedParticipants || selectedParticipants.length === 0) {
            return;
        }

        navigate("/app/compare-participants-selected", {
            state: {
                selectedParticipants,
            },
        });
    };

    const handleShowPunctuation = () => {
        return;
    }

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
            return 0; // Retorna 0 se não houver participantes
        }

        console.log(participants)
        const superdotados = participants.reduce((count, participant) => {
            if (participant.adultForm?.giftednessIndicators == true) {
                return count + 1;
            }
            return count;
        }, 0);
        // Calcula a porcentagem de superdotados
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



    return (

        <Flex direction="column" className={`relative border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] p-5 font-roboto`}>
            <ScrollToTop/>
            <Header title="Analisar Amostra" icon={<Icon.Books size={24} className="items-center" />} />

            <Box className="mb-[32px] w-full">
                <Text size="4" as="label" className="font-bold">{sample.sampleGroup} - Total de {sample.participants?.length} Avaliado(s).</Text>
                <Box className="w-full mb-[32px]">
                    <Form.Root className="flex flex-row items-center justify-between truncate">
                        <Form.Submit asChild>
                            <Button size="3" mr="3" className="items-center hover:cursor-pointer">
                                <Icon.FunnelSimple size={24} />
                                Filtrar
                            </Button>
                        </Form.Submit>
                        <InputField label="" icon={<Icon.MagnifyingGlass />} placeholder="Pesquisar pelo nome do avaliado..." name="participant-name" />
                        <Flex >
                            <SelectField label="Área do Saber" name="knowledge-area" children={
                                <>
                                    <option>teste</option>
                                    <option>test2</option>
                                </>
                            }>

                            </SelectField>
                            <SelectField label="Pontuação Mínima" name="min-punctuation" children={
                                <>
                                    <option>100% (219 a 242 pontos)</option>
                                    <option>90% (195 a 218 pontos)</option>
                                    <option>80% (170 a 194 pontos)</option>
                                    <option>70% (146 a 169 pontos)</option>
                                    <option>60% (122 a 145 pontos)</option>
                                    <option>50% (98 a 121 pontos)</option>
                                    <option>40% (73 a 97 pontos)</option>
                                    <option>30% (49 a 73 pontos)</option>
                                    <option>20 % (25 a 48 pontos)</option>
                                    <option>10% (0 a 24 pontos)</option>

                                </>
                            }>
                            </SelectField>
                        </Flex>
                    </Form.Root>
                </Box>
                <Flex direction="row" justify="center" gap="6" className=" mb-[32px] sm:flex-row items-center justify-between">
                    <AlertDialog.Root >
                        <AlertDialog.Trigger>
                            <Button className="hover:cursor-pointer" onClick={() => handleCompareSelected()}>Comparar selecionados</Button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content>
                            <AlertDialog.Title>Você não selecionou nenhum participante. </AlertDialog.Title>
                            <AlertDialog.Description size="2">
                                Para comparar as respostas entre os avaliados, selecione pelo menos um participante.
                            </AlertDialog.Description>

                            <Flex gap="3" mt="4" justify="end">
                                <AlertDialog.Cancel>
                                    <Button className="hover:cursor-pointer" variant="soft" color="red">
                                        Voltar
                                    </Button>
                                </AlertDialog.Cancel>

                            </Flex>
                        </AlertDialog.Content>
                    </AlertDialog.Root>
                    <AlertDialog.Root>
                        <AlertDialog.Trigger>
                            <Button className="hover:cursor-pointer">Pontuação do questionário</Button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content>
                            <AlertDialog.Title>Selecione as fontes de palavras:</AlertDialog.Title>
                            <AlertDialog.Description size="4">
                                <Flex justify="between" gap="8" className="pt-4 pb-4">
                                    <Text as="label" size="3">
                                        <Flex gap="2">
                                            <Checkbox />
                                            Respostas subjetivas
                                        </Flex>
                                    </Text>
                                    <Text as="label" size="3">
                                        <Flex gap="2">
                                            <Checkbox />
                                            Autobiografia
                                        </Flex>
                                    </Text>
                                    <Text as="label" size="3">
                                        <Flex gap="2">
                                            <Checkbox />
                                            Áreas do saber
                                        </Flex>
                                    </Text>
                                </Flex>
                            </AlertDialog.Description>

                            <Flex gap="3" mt="4" justify="end">
                                <AlertDialog.Action>

                                    <Button variant="soft" color="grass" className="hover:cursor-pointer">
                                        Confirmar
                                    </Button>

                                </AlertDialog.Action>
                                <AlertDialog.Cancel>
                                    <Button variant="soft" color="red" className="hover:cursor-pointer">
                                        Voltar
                                    </Button>


                                </AlertDialog.Cancel>

                            </Flex>
                        </AlertDialog.Content>
                    </AlertDialog.Root>
                    <AlertDialog.Root>
                        <AlertDialog.Trigger>
                            <Button className="hover:cursor-pointer">Gerar nuvem de palavras</Button>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content>

                            <AlertDialog.Title>Gerar nuvem de palavras dos avaliados selecionados</AlertDialog.Title>
                            <AlertDialog.Description>
                                Selecione as fontes de palavras:
                            </AlertDialog.Description>
                            <AlertDialog.Description size="4">
                                <Flex justify="between" gap="8" className="pt-4 pb-4">
                                    <Text as="label" size="3">
                                        <Flex gap="2">
                                            <Checkbox />
                                            Respostas subjetivas
                                        </Flex>
                                    </Text>
                                    <Text as="label" size="3">
                                        <Flex gap="2">
                                            <Checkbox />
                                            Autobiografia
                                        </Flex>
                                    </Text>
                                    <Text as="label" size="3">
                                        <Flex gap="2">
                                            <Checkbox />
                                            Áreas do saber
                                        </Flex>
                                    </Text>
                                </Flex>
                            </AlertDialog.Description>

                            <Flex gap="3" mt="4" justify="end">
                                <AlertDialog.Action>

                                    <Button variant="soft" color="grass" className="hover:cursor-pointer">
                                        Confirmar
                                    </Button>

                                </AlertDialog.Action>
                                <AlertDialog.Cancel>
                                    <Button variant="soft" color="red" className="hover:cursor-pointer">
                                        Voltar
                                    </Button>


                                </AlertDialog.Cancel>

                            </Flex>
                        </AlertDialog.Content>
                    </AlertDialog.Root>
                </Flex>
                <Box>
                    <Table.Root variant="surface" className="w-full truncate" >
                        <Table.Header className="text-[20px]">
                            <Table.Row className="bg-red" >
                                <Table.ColumnHeaderCell colSpan={4} className="border-l border-none" align="center">Informações do participante</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={2} className="border-l" align="center">Indicadores de AH/SD</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell colSpan={3} className="border-l" align="center">Áreas do saber</Table.ColumnHeaderCell>
                                <Table.ColumnHeaderCell className="border-l"></Table.ColumnHeaderCell>
                            </Table.Row>
                        </Table.Header>
                        <Table.Header className="text-[18px]">
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
                        <Table.Header className="text-[16px]">
                            <Table.Row align="center" className="text-center">
                                <Table.ColumnHeaderCell colSpan={1}  >
                                    <Flex align="center">
                                        <button className="flex flex-col m-auto align-center" onClick={handleCheckAll}>
                                            <Checkbox className="m-2 " color="violet" />
                                        </button>

                                    </Flex>
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
                                                            <Button variant="soft" color="red" className="hover:cursor-pointer">
                                                                Voltar
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
                        <Table.Body>
                            {sample.participants?.slice(startIndex, endIndex).map((participant, idx) => (
                                <Table.Row
                                    align="center"

                                    className={isChecked[startIndex + idx] ? 'bg-violet-200' : ''}
                                    key={startIndex + idx}>
                                    <Table.Cell justify="center">
                                        <Checkbox
                                            checked={isChecked[startIndex + idx] ?? false}
                                            onCheckedChange={() => handleChange(startIndex + idx)}
                                            color="violet" />
                                    </Table.Cell>
                                    <Table.Cell justify="center"> {getFirstAndLastName(participant.personalData.fullName)}</Table.Cell>
                                    <Table.Cell justify="center" >{participant.adultForm?.totalPunctuation}</Table.Cell>
                                    <Table.Cell justify="center">{participant.secondSources?.length}</Table.Cell>
                                    <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>
                                    <Table.Cell justify="center">
                                        <Select.Root defaultValue="definir">
                                            <Select.Trigger variant="ghost" />
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
                                        <Select.Root defaultValue="definir">
                                            <Select.Trigger variant="ghost" />
                                            <Select.Content >
                                                <Select.Item value="definir">Definir</Select.Item>
                                                <Select.Item value="teste">teste</Select.Item>
                                            </Select.Content>
                                        </Select.Root>
                                    </Table.Cell>
                                    <Table.Cell justify="center">
                                        <Select.Root defaultValue="definir">
                                            <Select.Trigger variant="ghost" />
                                            <Select.Content >
                                                <Select.Item value="definir">Definir</Select.Item>
                                                <Select.Item value="teste">teste</Select.Item>
                                            </Select.Content>
                                        </Select.Root>
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
                                                            <Button variant="soft" color="red" className="hover:cursor-pointer">
                                                                Fechar
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
                                                                <Icon.ClipboardText onClick={() => handleCompareSelected()} size={20} />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Box>
                                                </AlertDialog.Trigger>
                                                <AlertDialog.Content >
                                                    <AlertDialog.Title> Nenhuma pessoa foi identificada como segunda fonte desse avaliado. </AlertDialog.Title>
                                                    <AlertDialog.Description size="2">
                                                        Para contrastar as respostas do avaliado com as da(s) segunda(s) fonte(s), é necessário que um participante tenha recebido as respostas do questionário de uma pessoa adicional, atuando como a segunda fonte.
                                                    </AlertDialog.Description>

                                                    <Flex gap="3" mt="4" justify="end">
                                                        <AlertDialog.Cancel>
                                                            <Button variant="soft" color="red" className="hover:cursor-pointer">
                                                                Voltar
                                                            </Button>
                                                        </AlertDialog.Cancel>

                                                    </Flex>
                                                </AlertDialog.Content>
                                            </AlertDialog.Root>


                                            <Box className="flex gap-3" onClick={() => handleEvaluateAutobiography(participant)}>
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
                    <Button className="hover:cursor-pointer" variant="surface" onClick={() => handlePageChange(currentPage - 1)}>{`<`}</Button>
                    {renderPagination()}
                    <Button className="hover:cursor-pointer" variant="surface" onClick={() => handlePageChange(currentPage + 1)}>{`>`}</Button>
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
            </Box>
        </Flex >

    );
};

export default AnalysisPage;
