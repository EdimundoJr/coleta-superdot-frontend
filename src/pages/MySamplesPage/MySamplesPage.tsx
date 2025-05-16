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
import { Badge, Box, Container, Flex, IconButton, Separator, Skeleton, Text, Tooltip } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { GridComponent } from "../../components/Grid/Grid";
import { Button } from "../../components/Button/Button";
import { AnimatePresence, motion } from "framer-motion";
import EmptyState from "../../components/EmptyState/EmptyState";
import { set } from "lodash";

const MySamplesPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(mySamplesFiltersSchema) });
    const navigate = useNavigate();
    const location = useLocation();
    const [loading, setLoading] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);

    const [pageData, setPageData] = useState<Page<ISample>>();
    //const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<MySamplesFilters>();
    //const [sampleSelecteds, setSampleSelecteds] = useState();

    /* STATES TO SHOW NOTIFICATION */
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });

    /* STATES TO DELETE SAMPLE REQUEST*/
    const [openModalDelete, setOpenModalDelete] = useState(false);
    const [sampleIdToDelete, setSampleIdToDelete] = useState<string>();

    useEffect(() => {
        if (stateWithNotification(location.state)) {
            setNotificationData({
                title: "Registro Concluído com Sucesso!",
                description: "A amostra foi cadastrada com êxito e já está disponível no sistema para consulta ou edição.",
                type: "success"
            });
        }
    }, [location.state]);

    useEffect(() => {
        setLoading(true);
        const getPage = async () => {
            try {
                const response = await paginateSamples(1, PAGE_SIZE, filters);
                if (response.status === 200) {
                    setPageData(response.data);
                } else {
                    console.error('Erro na resposta:', response);
                }
            } catch (error) {
                console.error('Erro ao buscar dados:', error);
            } finally {
                setLoading(false);
            }
        };

        getPage();
    }, [filters]);


    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1020);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    const showFilters = isDesktop || showSearch;



    /* HANDLERS TO DELETE SAMPLE REQUEST*/
    const handleNavigateToDeleteSample = (sampleId?: string) => {
        if (sampleId) {
            setSampleIdToDelete(sampleId);
        }
        setOpenModalDelete(true);
    };
    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    const handleNavigateToEditSample = (sample?: ISample) => {
        if (sample) {
            navigate("/app/edit-sample", {
                state: {
                    sample,
                },
            });
            scrollToTop();
        }
    };

    const handleDeleteSample = async () => {
        setLoading(true);
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
            setNotificationData({
                title: "Solicitação apagada!",
                description: "A solicitação foi apagada com sucesso!",
                type: "success"
            });

        } catch (e) {
            setNotificationData({
                title: "Erro ao apagar solicitação!",
                description: "Não foi possível apagar a solicitação. Tente novamente mais tarde.",
                type: "erro"
            });
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleRegisterPeople = (sampleId: string) => {
        navigate("/app/my-samples/participants-registration", {
            state: {
                sampleId,
            },
        });
        scrollToTop();
    };

    const handleClickToAnalyzeSampleParticipantes = (sample: ISample) => {
        navigate("/app/my-samples/analyze-sample", {
            state: {
                sample,
            },
        });
        scrollToTop();
    };

    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
                title={notificationData.title}
                description={notificationData.description}
                icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
                className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
            >


                <Box className="w-full  pt-10 pb-10 max-xl:pt-2 max-xl:pb-2">
                    <Form.Root
                        onSubmit={handleSubmit((data) => {
                            setFilters({
                                ...data,
                            });
                        })}
                        className="flex flex-col items-center gap-4 xl:flex-row xl:justify-between p-4 pt-0 pb-1"
                    >
                        {!isDesktop && (
                            <Button
                                type="button"
                                onClick={() => setShowSearch(!showSearch)}
                                className="block xl:hidden"
                                title={`${showSearch ? "Fechar Filtros" : "Mostrar Filtros"}`}
                                color="primary"
                                size="Medium"
                            >
                                {showSearch ? <Icon.X size={20} /> : <Icon.Funnel size={20} />}
                            </Button>
                        )}

                        <AnimatePresence>
                            {showFilters && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex flex-col xl:flex-row xl:items-center gap-3 w-full overflow-hidden"
                                >
                                    <Form.Submit asChild className="hidden xl:block">
                                        <Button
                                            size="Large"
                                            className="items-center w-full xl:w-[300px] xl:mt-2"
                                            title="Filtrar"
                                            color="primary"
                                        >
                                            <Icon.Funnel size={20} color="white" />
                                        </Button>
                                    </Form.Submit>
                                    <InputField
                                        label="Pesquisar pela pesquisa"
                                        icon={<Icon.MagnifyingGlass />}
                                        placeholder="Digite o título da pesquisa"
                                        errorMessage={errors.researcherTitle?.message}
                                        {...register("researcherTitle")}
                                    />
                                    <InputField
                                        label="Pesquisar pela amostra"
                                        icon={<Icon.MagnifyingGlass />}
                                        placeholder="Digite o título da amostra"
                                        errorMessage={errors.sampleTitle?.message}
                                        {...register("sampleTitle")}
                                    />
                                    <Form.Submit asChild className="block xl:hidden">
                                        <Button
                                            size="Large"
                                            className="items-center w-full xl:w-[300px]"
                                            title="Filtrar"
                                            color="primary"
                                        >
                                            <Icon.Funnel size={20} color="white" />
                                        </Button>
                                    </Form.Submit>

                                    <Button
                                        size="Large"
                                        onClick={() => setFilters({})}
                                        type="reset"
                                        className="items-center w-full xl:w-[300px] xl:mt-2"
                                        color="primary"
                                        title="Limpar Filtro"
                                    >
                                    </Button>

                                </motion.div>
                            )}
                        </AnimatePresence>
                        <Flex />
                    </Form.Root>
                </Box>

                <Container className="mb-4 p-4 max-lg:p-0">
                    {pageData?.data?.length === 0 ? <EmptyState icon={<Icon.FileX weight="thin" size={100} />} title={"Nenhuma amostra encontrada."} description={"Não foram encontradas amostras que correspondam aos critérios de busca ou filtros aplicados. Verifique os parâmetros utilizados e tente novamente."} />
                        :

                        <GridComponent columns={2} className="gap-5">
                            {loading
                                ? (
                                    Array.from({ length: 2 }).map((_, idx) => (
                                        <Card.Root
                                            key={idx}
                                            className="rounded-lg shadow-lg border border-gray-200 animate-pulse"
                                        >
                                            {/* Header */}
                                            <Card.Header>
                                                <Flex justify="between" className="space-x-4 items-center">
                                                    <Skeleton className="h-5 w-3/5" />
                                                </Flex>
                                            </Card.Header>

                                            {/* Content */}
                                            <Card.Content >
                                                <div className="space-y-4 mt-2">
                                                    <Separator size={"4"} />
                                                </div>
                                                <ul className="space-y-2 text-sm">
                                                    {Array.from({ length: 7 }).map((_, idx) => (
                                                        <li key={idx}>
                                                            <Skeleton className="h-4 w-full sm:w-[80%]" />
                                                        </li>
                                                    ))}
                                                    {/* Badge simulada */}
                                                    <li className="flex items-center gap-2">
                                                        <Skeleton className="h-5 w-24 rounded-full" />
                                                    </li>
                                                </ul>
                                            </Card.Content>

                                            {/* Ações */}
                                            <Card.Actions className="flex gap-4 justify-between max-sm:flex-col mt-4">
                                                <Skeleton className="h-10 w-full sm:w-1/2 rounded-md" />
                                                <Skeleton className="h-10 w-full sm:w-1/2 rounded-md" />
                                            </Card.Actions>
                                        </Card.Root>
                                    ))) :
                                pageData?.data?.map((sample, index) => (

                                    <Card.Root
                                        className={`${sample.status === "Autorizado" ? "!border-confirm" : sample.status === "Pendente" ? "!border-yellow-500" : "!border-red-500"} rounded-lg shadow-lg transition-all hover:drop-shadow-md`}>
                                        <Card.Header>
                                            <Flex justify="between" className="space-x-4">
                                                {sample.status !== "Autorizado" && (
                                                    <Tooltip content="Editar Amostra">
                                                        <IconButton color="amber" radius="full" variant="outline">
                                                            <Icon.Pencil
                                                                onClick={() => handleNavigateToEditSample(sample)}
                                                                className="cursor-pointer"
                                                                size={20}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                <Text as="label" className="text-xl font-medium text-gray-800">{sample.sampleGroup}

                                                </Text>

                                                {sample.status !== "Autorizado" && (
                                                    <Tooltip content="Excluir Amostra">
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
                                            <div className="space-y-4">
                                                <Separator size={"4"} ></Separator>

                                                <ul className="text-gray-700 text-sm">
                                                    <li>
                                                        <span className="font-medium text-gray-900">Amostra:</span> {sample.sampleTitle}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium text-gray-900">Pesquisa:</span> {sample.researchTitle}
                                                    </li>
                                                    {sample.qttParticipantsAuthorized && (
                                                        <li>
                                                            <span className="font-medium text-gray-900">Limite de participantes:</span> {sample.qttParticipantsAuthorized}
                                                        </li>
                                                    )}
                                                    {sample.participants && (
                                                        <li>
                                                            <span className="font-medium text-gray-900">Participantes cadastrados:</span> {sample.participants.length}
                                                        </li>
                                                    )}
                                                    <li>
                                                        <span className="font-medium text-gray-900">Código do Comitê de Ética:</span> {sample.researchCep.cepCode}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium text-gray-900">Data da Solicitação da amostra:</span>{" "}
                                                        {sample.createdAt && DateTime.fromISO(sample.createdAt).toFormat("dd/LL/yyyy - HH:mm")}
                                                    </li>
                                                    <li>
                                                        <span className="font-medium text-gray-900">Data da última atualização:</span>{" "}
                                                        {sample.updatedAt && DateTime.fromISO(sample.updatedAt).toFormat("dd/LL/yyyy - HH:mm")}
                                                    </li>
                                                    <li className="flex items-center gap-2">
                                                        <span className="font-medium text-gray-900">Status da amostra:</span>
                                                        {sample.status === "Autorizado" ? (
                                                            <Badge color="green" className="rounded-full px-2 py-0.5 text-xs">Autorizado</Badge>
                                                        ) : sample.status === "Pendente" ? (
                                                            <Badge color="orange" className="rounded-full px-2 py-0.5 text-xs">Pendente</Badge>
                                                        ) : (
                                                            <Badge color="red" className="rounded-full px-2 py-0.5 text-xs">{sample.status}</Badge>
                                                        )}
                                                    </li>
                                                </ul>
                                            </div>
                                        </Card.Content>

                                        <Card.Actions className=" flex gap-4 justify-between max-sm:flex-col">
                                            <Card.Action
                                                disabled={
                                                    sample.status !== "Autorizado" ||
                                                    sample.qttParticipantsAuthorized === sample.participants?.length
                                                }
                                                onClick={() => handleRegisterPeople(sample._id as string)}
                                            >
                                                Cadastrar Pessoas
                                            </Card.Action>
                                            <Card.Action
                                                disabled={
                                                    sample.status !== "Autorizado" ||
                                                    sample.participants?.filter(p => p.adultForm?.totalPunctuation != null).length === 0
                                                }
                                                onClick={() => handleClickToAnalyzeSampleParticipantes(sample)}
                                            >
                                                Avaliar Pessoas
                                            </Card.Action>
                                        </Card.Actions>
                                    </Card.Root>
                                ))}
                        </GridComponent>


                    }
                </Container>
                <Modal
                    open={openModalDelete}
                    setOpen={setOpenModalDelete}
                    title="Confirmação de Exclusão"
                    accessibleDescription="A solicitação de amostra selecionada está prestes a ser excluída do sistema."
                    accessibleDescription2="Tem certeza de que deseja prosseguir com a exclusão desta solicitação? Esta ação não poderá ser desfeita."
                >

                    <Flex gap="3" mt="4" justify="end">
                        <Button loading={loading} onClick={handleDeleteSample} color="red" title={"Ecluir"} size={"Extra Small"} />
                        <Button onClick={() => setOpenModalDelete(false)} color="gray" title={"Cancelar"} size={"Extra Small"} />
                    </Flex>
                </Modal>
            </Notify >
        </>
    );
};

export default MySamplesPage;
