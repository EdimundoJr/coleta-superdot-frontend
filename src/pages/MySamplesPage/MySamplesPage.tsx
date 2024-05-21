import * as Form from "@radix-ui/react-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { InputField } from "../../components/InputField/InputField";
import { PAGE_SIZE } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import { Page, deleteSample, paginateSamples } from "../../api/sample.api";
import { MySamplesFilters, mySamplesFiltersSchema } from "../../schemas/mySample.schema";
import { Card } from "../../components/Card/Card";
import Modal from "../../components/Modal/Modal";
import Notify from "../../components/Notify/Notify";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithNotification } from "../../validators/navigationStateValidators";
import { DateTime } from "luxon";
import { ISample } from "../../interfaces/sample.interface";
import { Badge, Box, Button, Container, Flex, IconButton, Skeleton, Text, Tooltip } from "@radix-ui/themes";
import { Header } from "../../components/Header/Header";
import * as Icon from "@phosphor-icons/react";
import { GridComponent } from "../../components/Grid/Grid";

const MySamplesPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(mySamplesFiltersSchema) });
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(true);

    const [pageData, setPageData] = useState<Page<ISample>>();
    //const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<MySamplesFilters>();
    //const [sampleSelecteds, setSampleSelecteds] = useState();

    /* STATES TO SHOW NOTIFICATION */
    const [notificationTitle, setNotificationTitle] = useState<string>();
    const [notificationDescription, setNotificationDescription] = useState<string>();
    const [notificationIcon, setNotificationIcon] = useState<React.ReactNode>();
    const [notificationClass, setNotificationClass] = useState("");

    /* STATES TO DELETE SAMPLE REQUEST*/
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [sampleIdToDelete, setSampleIdToDelete] = useState<string>();

    useEffect(() => {
        if (stateWithNotification(location.state)) {
            setNotificationTitle(location.state.notification.title);
            setNotificationDescription(location.state.notification.description);
            setNotificationIcon(<Icon.CheckCircle size={30} color="white" />);
            setNotificationClass(location.state.notification.class);
        }
    }, [location.state]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 2000);

        const getPage = async () => {
            const response = await paginateSamples(1, PAGE_SIZE, filters);
            if (response.status === 200) {
                setPageData(response.data);
            }
        };

        getPage();
        return () => clearTimeout(timeoutId);
    }, [filters]);

    const handleCleanNotification = () => {
        setNotificationTitle("");
        setNotificationDescription("");
    };

    /* HANDLERS TO DELETE SAMPLE REQUEST*/
    const handleNavigateToDeleteSample = (sampleId?: string) => {
        if (sampleId) {
            setSampleIdToDelete(sampleId);
        }
        setOpenModalDelete(true);
    };

    const handleNavigateToEditSample = (sample?: ISample) => {
        if (sample) {
            navigate("/app/edit-sample", {
                state: {
                    sample,
                },
            });
        }
    };

    const handleDeleteSample = async () => {
        try {
            const response = await deleteSample(sampleIdToDelete);

            if (response.status === 200) {
                const dataFiltered = pageData?.data?.filter((data) => data._id !== sampleIdToDelete);
                const newPageData = {
                    ...pageData,
                    data: dataFiltered ? [...dataFiltered] : undefined,
                };
                setPageData(newPageData);
                setOpenModalDelete(false);
            }
            setNotificationTitle("Solicitação apagada!");
            setNotificationDescription("A solicitação foi apagada com sucesso!");
        } catch (e) {
            setNotificationTitle("Erro ao apagar solicitação");
            setNotificationDescription("Não foi possível apagar a solicitação. Tente novamente mais tarde.");
            console.error(e);
        }
    };

    const handleRegisterPeople = (sampleId: string) => {
        navigate("/app/participants-registration", {
            state: {
                sampleId,
            },
        });
    };

    const handleClickToAnalyzeSampleParticipantes = (sample: ISample) => {
        navigate("/app/analyze-sample", {
            state: {
                sample,
            },
        });
    };

    return (
        <Flex direction="column" className={`relative border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] p-5`}>
            <Notify
                open={!!notificationTitle}
                onOpenChange={handleCleanNotification}
                title={notificationTitle}
                description={notificationDescription}
                icon={notificationIcon}
                className={notificationClass}
            >
                <Header title="Minhas Amostra" icon={<Icon.Books size={24} className="items-center" />} />

                <Box className="w-full pt-10 pb-10">
                    <Form.Root
                        onSubmit={handleSubmit((data) => {
                            setFilters({
                                ...data,
                            });
                        })}
                        className="flex flex-col sm:flex-row items-center justify-between px-10 py-10 pt-0 pb-1 ">
                        <Form.Submit asChild>
                            <Button size="3" mr="3" className="items-center">
                                <Icon.FunnelSimple size={24} />
                                Filtrar
                            </Button>
                        </Form.Submit>
                        <InputField
                            label=""
                            icon={<Icon.MagnifyingGlass />}
                            placeholder="Digite o título da pesquisa"
                            errorMessage={errors.researcherTitle?.message}
                            {...register("researcherTitle")}
                        />
                        <InputField
                            label=""
                            icon={<Icon.MagnifyingGlass />}
                            placeholder="Digite o título da amostra"
                            errorMessage={errors.sampleTitle?.message}
                            {...register("sampleTitle")}
                            className="ml-1 m"
                        />
                        <Button onClick={() => setFilters({})} type="reset" size="3" ml="3" className="items-center">
                            limpar Filtro
                        </Button>
                        <Flex >
                        </Flex>
                    </Form.Root>
                </Box>
                <Container className="mb-4">
                    {pageData?.data?.length === 0 ? <h3>Você não possui nenhuma amostra.</h3> :

                        <GridComponent children={
                            <>
                                {pageData?.data?.map((sample, index) => {
                                    return (
                                        <Skeleton loading={loading}>
                                            <Box>
                                                <Card.Root key={index}>
                                                    <Card.Header>
                                                        <Flex justify="between">
                                                            {sample.status == "Autorizado" && (
                                                                <Tooltip content={"Editar Amostra"}>
                                                                    <IconButton color="amber" radius="full" variant="outline">
                                                                        <Icon.Pencil
                                                                            onClick={() => handleNavigateToEditSample(sample)}
                                                                            className="cursor-pointer"
                                                                            size={20}
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                            <Text as="label">{sample.sampleGroup}</Text>
                                                            {sample.status == "Autorizado" && (
                                                                <Tooltip content={"Excluir Amostra"}>
                                                                    <IconButton color="red" radius="full" variant="outline">
                                                                        <Icon.Trash
                                                                            className="cursor-pointer"
                                                                            onClick={() => handleNavigateToDeleteSample(sample._id)}
                                                                            size={20}
                                                                        />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            )}
                                                        </Flex>
                                                    </Card.Header>
                                                    <Card.Content>
                                                        <ul>
                                                            <li ><b>Amostra:</b> {sample.sampleTitle}</li>
                                                            <li ><b>Pesquisa:</b> {sample.researchTitle}</li>
                                                            {sample.qttParticipantsAuthorized && (
                                                                <li ><b>Limite de participantes:</b> {sample.qttParticipantsAuthorized}</li>
                                                            )}
                                                            {sample.participants && (
                                                                <li ><b>Participantes cadastrados:</b> {sample.participants.length}</li>
                                                            )}
                                                            <li ><b>Código do Comitê de Ética:</b> {sample.researchCep.cepCode}</li>
                                                            <li >
                                                                <b>Data da Solicitação da amostra:</b>{" "}
                                                                {sample.createdAt &&
                                                                    DateTime.fromISO(sample.createdAt).toFormat("dd/LL/yyyy - HH:mm")}
                                                            </li>
                                                            <li >
                                                                <b>Data da última atualização:</b>{" "}
                                                                {sample.updatedAt &&
                                                                    DateTime.fromISO(sample.updatedAt).toFormat("dd/LL/yyyy - HH:mm")}
                                                            </li>
                                                            <li > <b>Status da amostra:</b> {sample.status == "Autorizado" ? (
                                                                <Badge color="green" className="radios-full">{sample.status}</Badge>
                                                            ) : (

                                                                <Badge color="red">{sample.status}</Badge>


                                                            )}</li>
                                                        </ul>
                                                    </Card.Content>
                                                    <Card.Actions className="justify-around">
                                                        <Card.Action
                                                            disabled={
                                                                sample.status !== "Autorizado"
                                                                // ||
                                                                // sample.qttParticipantsAuthorized === sample.participants?.length
                                                            }
                                                            onClick={() => handleRegisterPeople(sample._id as string)}
                                                        >
                                                            Cadastrar Pessoas
                                                        </Card.Action>
                                                        <Card.Action
                                                            disabled={sample.status !== "Autorizado" || sample.participants?.length === 0}
                                                            onClick={() => handleClickToAnalyzeSampleParticipantes(sample)}
                                                        >
                                                            Avaliar Pessoas
                                                        </Card.Action>
                                                    </Card.Actions>
                                                </Card.Root>
                                            </Box>
                                        </Skeleton>
                                    );
                                })}


                            </>
                        } columns={2} className="gap-5">
                        </GridComponent>
                    }
                </Container>
                <Modal
                    open={openModalDelete}
                    setOpen={setOpenModalDelete}
                    title="Apagando solicitação de amostra"
                    accessibleDescription="A solicitação de amostra selecionada será apagada."
                    accessibleDescription2="Tem certeza que deseja apagar a solicitação de amostra selecionada?"
                >

                    <Flex gap="3" mt="4" justify="end">
                        <Button onClick={handleDeleteSample} variant="soft" color="gray">
                            Ecluir
                        </Button>

                        <Button onClick={() => setOpenModalDelete(false)} variant="solid" color="red">
                            Cancelar
                        </Button>
                    </Flex>
                </Modal>
            </Notify>
        </Flex >
    );
};

export default MySamplesPage;
