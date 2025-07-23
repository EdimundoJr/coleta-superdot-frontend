import { useEffect, useState } from "react";
import { ISample } from "../../interfaces/sample.interface";
import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import { SelectField } from "../../components/SelectField/SelectField";
import * as Icon from '@phosphor-icons/react'
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { Box, Checkbox, Dialog, Flex, IconButton, Table, Text, TextField, Tooltip, HoverCard, Skeleton, AlertDialog, Strong, DataList, Separator } from "@radix-ui/themes";
import Select from "react-select";
import * as Theme from "@radix-ui/themes"
import { IParticipant, ISecondSource } from "../../interfaces/participant.interface";
import { GridComponent } from "../../components/Grid/Grid";
import { answerByGender, AnswerByGender, getSampleById } from "../../api/sample.api";
import { Button } from "../../components/Button/Button";
import Modal from "../../components/Modal/Modal";
import WordCloudGenerator from "../../components/WordCloud/WordCloudGenerator";
import { patchSaveGiftdnessIndicatorsByResearcher, patchSaveKnowledgeAreasIndicatedByResearcher } from "../../api/participant.api";
import Notify from "../../components/Notify/Notify";
import PercentageGiftedChart from "../../components/Charts/PercentageGiftedChart";
import ResponseChartByGender from "../../components/Charts/ResponseChartByGender";
import { AnimatePresence, motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { MySamplesFilters, mySamplesFiltersSchema } from "../../schemas/mySample.schema";
import * as Switch from '@radix-ui/react-switch';
import EmptyState from "../../components/EmptyState/EmptyState";
import SkeletonDataList from "../../components/Skeletons/SkeletonDataList";
import ActionButtonExplain from "../../components/ActionButtonExplain/ActionButtonExplain";
import SkeletonTableBody from "../../components/Skeletons/SkeletonTableBody";
import SkeletonHeader from "../../components/Skeletons/SkeletonHeader";
import InstrumentResponsesTable from "../../components/InstrumentResponsesTable/InstrumentResponsesTable";

interface Filters {
    searchName?: string;
    knowledgeArea?: string;
    minPunctuation?: number;
}

interface Participant {
    name: string;
    knowledgeArea?: string;
    adultForm?: {
        totalPunctuation: number;
    };
}
const AnalysisPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const [filters, setFilters] = useState<Filters>({});
    const [sample, setSample] = useState({} as ISample);
    const [isCheckedAll, setIsCheckedAll] = useState(false);
    const [isChecked, setIsChecked] = useState<boolean[]>([]);
    const [isCheckedWC, setIsCheckedWC] = useState<boolean[]>([])
    const [showNewComponent, setShowNewComponent] = useState(false);
    const [selectedParticipants, setSelectedParticipants] = useState<IParticipant[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [dados, setDados] = useState<null | AnswerByGender>(null);
    const [error, setError] = useState(null);
    const [openModalCompare, setOpenModalCompare] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [openModalCloud, setOpenModalCloud] = useState(false);
    const [openModalKAG, setOpenModalKAG] = useState(false);
    const [openModalKAE, setOpenModalKAE] = useState(false);
    const [openModalIAH, setOpenModalIAH] = useState(false);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isSavingItem, setIsSavingItem] = useState(false);
    const [selectedItems, setSelectedItems] = useState<{ value: string }[]>([]);
    const [showSearch, setShowSearch] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [expandedParticipants, setExpandedParticipants] = useState<Record<string, boolean>>({});
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit, reset } = useForm<Filters>();


    const onSubmit = (data: Filters) => {
        setFilters(data);
    };
    const clearFilters = () => {
        setFilters({});
        reset();
    };


    const itemsPerPage = 10;
    const totalParticipants = sample.participants?.length;
    const totalPages = Math.ceil((totalParticipants || 0) / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalParticipants || 0);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(Math.max(1, Math.min(pageNumber, totalPages || 1)));
    };
    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1020);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);
    const fetchSample = async () => {
        try {
            if (!sample._id) {
                throw new Error("Sample ID is undefined");
            }
            const response = await getSampleById({ sampleId: sample._id });
            if (response.status === 200) {
                setSample(response.data);
            }
        } catch (error) {
            console.error("Erro ao buscar o sample atualizado:", error);
        }
    };

    const handleCheckboxChange = (option: string | null) => {
        setSelectedOption((prev) => (prev === option ? null : option));
    };

    const handleChangeKA = (selectedOptions: any) => {
        setSelectedItems(selectedOptions || []);
    };

    const handleSubmitKA = async (type: string) => {
        setIsSavingItem(true);
        try {
            const participantID = selectedParticipants[0];
            if (type === "KAG") {
                const specific: string[] = [];
                const general = selectedItems.map((item) => item.value);
                setSelectedItems([]);
                await patchSaveKnowledgeAreasIndicatedByResearcher({
                    sampleId: sample._id!,
                    participantId: participantID._id!,
                    knowledgeAreasIndicatedByResearcher: {
                        general,
                        specific,
                    },
                    submitForm: true,
                });
            } else {
                const general: string[] = [];
                const specific = selectedItems.map((item) => item.value);
                setSelectedItems([]);
                await patchSaveKnowledgeAreasIndicatedByResearcher({
                    sampleId: sample._id!,
                    participantId: participantID._id!,
                    knowledgeAreasIndicatedByResearcher: {
                        general,
                        specific,
                    },
                    submitForm: true,
                });

            }

            setNotificationData({
                title: "Dados enviados com sucesso!",
                description: "Os dados foram enviados corretamente e estão prontos para análise.",
                type: "success"
            });

        } catch (error) {
            console.error('Erro ao enviar os dados:', error);
            setNotificationData({
                title: "Erro ao enviar os dados.",
                description: "Ocorreu um problema ao tentar enviar os dados. Tente novamente mais tarde.",
                type: "erro"
            });
        } finally {
            setIsSavingItem(false);
            setOpenModalKAE(false);
            setOpenModalKAG(false);
            await fetchSample();
        }

    };

    const handleSaveGift = async () => {
        setIsSavingItem(true);
        if (!selectedOption) {
            alert("Selecione uma opção antes de salvar.");
            return;
        }

        try {
            const giftdnessIndicatorsByResearcher = selectedOption === "sim";
            const participantID = selectedParticipants[0];

            await patchSaveGiftdnessIndicatorsByResearcher({
                sampleId: sample._id!,
                participantId: participantID._id!,
                giftdnessIndicatorsByResearcher,
                submitForm: true,
            });

            setSelectedOption(null);
            setSelectedParticipants([]);

            setNotificationData({
                title: "Indicador registrado com sucesso!",
                description: "Os dados do indicador foram salvos com sucesso e estão prontos para análise.",
                type: "success"
            });

        } catch (error) {
            setNotificationData({
                title: "Erro ao salvar os dados",
                description: "Não foi possível salvar os dados. Tente novamente.",
                type: "error"
            });
            console.error("Erro ao salvar os dados:", error);
        } finally {
            setIsSavingItem(false);
            setOpenModalIAH(false);
            await fetchSample();
        }
    };

    const renderPagination = () => {
        if (!totalPages || totalPages <= 0) {
            return null;
        }

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
                setLoading(false);
            } catch (error: any) {
                setError(error.message);
                setNotificationData({
                    title: "Erro no servidor.",
                    description: "Não foi possível carregar os dados. Tente novamente.",
                    type: "erro"
                });
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
    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    const handleCompareSource = (participant: IParticipant) => {
        if (!participant.secondSources?.length) {
            return;
        }

        const hasValidSecondSource = participant.secondSources.some(
            (secondSource) => secondSource.adultForm?.endFillFormAt !== undefined
        );

        if (!hasValidSecondSource) {
            return;
        }

        navigate("/app/my-samples/seconds-source-compare", {
            state: {
                participant,
            },
        });
        scrollToTop();
    };


    const handleEvaluateAutobiography = (participant: IParticipant, sample: ISample) => {
        navigate("/app/my-samples/evaluate-autobiography", {
            state: {
                sample,
                participant,
            },
        });
        scrollToTop();
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

        setIsChecked(
            sample.participants?.map(participant =>
                participant.adultForm?.totalPunctuation !== undefined
                    ? !isCheckedAll
                    : false
            ) || []
        );
    };


    const handleChange = (index: number) => {
        const newCheckedState = isChecked.map((item, i) => (i === index ? !item : item));
        setIsChecked(newCheckedState);
    };

    const handleChangeWC = (index: number) => {
        const updatedCheckedWC = new Array(CloudWord.length).fill(false);
        updatedCheckedWC[index] = true;
        setIsCheckedWC(updatedCheckedWC);

    };

    const handleCompareSelected = () => {
        const selectedParticipants = sample.participants?.filter((participant, index) =>
            isChecked[index] && participant.adultForm?.totalPunctuation !== undefined
        );

        if (!selectedParticipants || selectedParticipants.length === 0) {
            setOpenModalCompare(true);
            return;
        }

        navigate("/app/my-samples/compare-participants-selected", {
            state: {
                selectedParticipants,
            },
        });
        scrollToTop();
    };


    const handleShowPunctuation = () => {
        setOpenModal(true)
        return;
    }
    const handleShowKAG = (participantID: string) => {
        const participant = sample.participants?.find(p => p._id === participantID);
        if (participant) {
            setSelectedParticipants([participant]);
        }
        setOpenModalKAG(true)
        return;
    }

    const handleShowKAE = (participantID: string) => {
        const participant = sample.participants?.find(p => p._id === participantID);
        if (participant) {
            setSelectedParticipants([participant]);
        }
        setOpenModalKAE(true)
        return;
    }
    const handleShowIAH = (participantID: string) => {
        setOpenModalIAH(true)
        const participant = sample.participants?.find(p => p._id === participantID);
        if (participant) {
            setSelectedParticipants([participant]);
        }
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
            setSelectedParticipants(selectedParticipants);
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

    const selectItensPM = [
        { value: 100, label: "(219 a 242 pontos)", min: 219, max: 242 },
        { value: 90, label: "(195 a 218 pontos)", min: 195, max: 218 },
        { value: 80, label: "(170 a 194 pontos)", min: 170, max: 194 },
        { value: 70, label: "(146 a 169 pontos)", min: 146, max: 169 },
        { value: 60, label: "(122 a 145 pontos)", min: 122, max: 145 },
        { value: 50, label: "(98 a 121 pontos)", min: 98, max: 121 },
        { value: 40, label: "(73 a 97 pontos)", min: 73, max: 97 },
        { value: 30, label: "(49 a 73 pontos)", min: 49, max: 73 },
        { value: 20, label: "(25 a 48 pontos)", min: 25, max: 48 },
        { value: 10, label: "(0 a 24 pontos)", min: 0, max: 24 }
    ];
    function getRangeForPercentage(percentage: number) {
        return selectItensPM.find(item => item.value === percentage);
    }

    const selectItensKA = [
        { label: "Memória", value: "Memória" },
        { label: "Dança", value: "Dança" },
        { label: "História", value: "História" },
        { label: "Química", value: "Química" },
        { label: "Física", value: "Física" },
        { label: "Pintura", value: "Pintura" },
        { label: "Biologia", value: "Biologia" },
        { label: "Esportes", value: "Esportes" },
        { label: "Liderança", value: "Liderança" },
        { label: "Astronomia", value: "Astronomia" },
        { label: "Música", value: "Música" },
        { label: "Criatividade", value: "Criatividade" },
        { label: "Cinema", value: "Cinema" },
        { label: "Observação", value: "Observação" },
        { label: "Matemática", value: "Matemática" },
        { label: "Abstração", value: "Abstração" },
        { label: "Comunicação", value: "Comunicação" },
        { label: "Português", value: "Português" },
        { label: "Planejamento", value: "Planejamento" },
        { label: "Fotografia", value: "Fotografia" },
        { label: "Geografia", value: "Geografia" },
        { label: "Línguas estrangeiras", value: "Línguas estrangeiras" },
        { label: "Escultura", value: "Escultura" },
        { label: "Política", value: "Política" },
        { label: "Mitologia", value: "Mitologia" },
        { label: "Arqueologia", value: "Arqueologia" },

    ];

    const showFilters = isDesktop || showSearch;

    const CloudWord = [
        { title: "Respostas subjetivas", value: "RES-SUB" },
        { title: "Autobiografia", value: "AUT-BIO" },
        { title: "Áreas do Saber", value: "ARE-SAB" },
    ];
    const filterParticipants = (participant: IParticipant) => {
        // Verifica se tem pontuação válida
        if (participant.adultForm?.totalPunctuation === undefined) {
            return false;
        }

        const punctuation = participant.adultForm.totalPunctuation;
        const combinedAreas = [
            ...(participant.knowledgeAreasIndicatedByResearcher?.general || []),
            ...(participant.knowledgeAreasIndicatedByResearcher?.specific || []),
            ...(participant.adultForm?.knowledgeAreas || []),
        ];

        // Filtro por nome
        if (filters.searchName &&
            !participant.personalData.fullName.toLowerCase().includes(filters.searchName.toLowerCase())) {
            return false;
        }

        // Filtro por área de conhecimento
        if (filters.knowledgeArea && filters.knowledgeArea !== "default" &&
            !combinedAreas.includes(filters.knowledgeArea)) {
            return false;
        }

        // Filtro por pontuação mínima
        if (filters.minPunctuation && filters.minPunctuation !== 99) {
            const selectedRange = getRangeForPercentage(Number(filters.minPunctuation));
            if (selectedRange && (punctuation < selectedRange.min || punctuation > selectedRange.max)) {
                return false;
            }
        }

        return true;
    };

    return (

        <Notify
            open={!!notificationData.title}
            onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
            title={notificationData.title}
            description={notificationData.description}
            icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
            className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
        >

            {loading ? (
                <>
                    <SkeletonHeader buttons={true} filter={true} />
                </>
            ) : (
                <>
                    <header className="pt-8 pb-6 border-b border-gray-200 mb-8">
                        <h2 className="heading-2 font-semibold text-gray-900">
                            Análise de Participantes
                        </h2>
                        <p className="text-lg text-gray-600">
                            Amostra: <Strong className="text-primary-600 !font-roboto">{sample?.sampleGroup}</Strong>
                        </p>
                    </header>
                    <Box className="hidden lg:grid grid-cols-4 gap-4">
                        <Form.Root
                            onSubmit={handleSubmit(onSubmit)}
                            className="flex flex-col items-center xl:flex-row xl:justify-between xl:p-0 pt-0 pb-1"
                        >
                            {!isDesktop && (
                                <Button
                                    type="button"
                                    onClick={() => setShowSearch(!showSearch)}
                                    className="block xl:hidden "
                                    title={showSearch ? "Fechar Filtros" : "Mostrar Filtros"}
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
                                        className="flex flex-col xl:flex-row xl:items-end gap-3 w-full overflow-hidden"
                                    >
                                        <Form.Submit asChild className="desktop xl:block">
                                            <Button
                                                size="Large"
                                                className="items-center w-full xl:w-[300px]"
                                                title="Filtrar"
                                                color="primary"
                                            >
                                                <Icon.Funnel size={20} color="white" />
                                            </Button>
                                        </Form.Submit>
                                        <InputField
                                            icon={<Icon.MagnifyingGlass />}
                                            placeholder="Pesquisar pelo nome do avaliado..."
                                            {...register("searchName")}
                                        />
                                        <Flex align="center" className="gap-2 flex-col xl:flex-row w-full xl:w-auto">
                                            <SelectField
                                                label="Área do Saber"
                                                {...register("knowledgeArea")}
                                                defaultValue="default"
                                                className="p-2 w-full xl:w-auto truncate"
                                            >
                                                <option value='default'>
                                                    Selecionar
                                                </option>
                                                {selectItensKA.map(option => (
                                                    <option key={option.label} value={option.label}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </SelectField>
                                            <SelectField
                                                label="Pontuação Mínima"
                                                {...register("minPunctuation", { valueAsNumber: true })}
                                                className="w-full xl:w-auto truncate"
                                                defaultValue={99}
                                            >
                                                <option value={99} className="text-gray-99">Selecionar</option>
                                                {selectItensPM.map(option => (
                                                    <option key={option.value} value={option.value}>
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </SelectField>
                                        </Flex>
                                        <Form.Submit asChild className="desktop xl:mobo">
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
                                            onClick={clearFilters}
                                            type="button"
                                            className="items-center w-full xl:w-[300px] "
                                            color="primary"
                                            title="Limpar Filtro"
                                        >
                                        </Button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Form.Root>
                    </Box>
                    < Flex
                        direction={isDesktop ? "row" : "column"}
                        justify="between"
                        className="gap-4 m-auto w-[90%] max-w-4xl mt-5 px-4"
                    >
                        <Modal
                            open={openModalCompare}
                            setOpen={setOpenModalCompare}
                            title={""}
                            accessibleDescription={""} >
                            <EmptyState
                                icon={<Icon.UserGear size={40} />}
                                title="Você não selecionou nenhum participante."
                                description="Para comparar as respostas entre os avaliados ou gerar a nuvem de palavras, você deve selecionar pelo menos um participante."
                            />
                        </Modal>


                        <Button
                            size="Medium"
                            title={"Comparar Selecionados"}
                            color={"primary"}
                            onClick={() => handleCompareSelected()}
                            children={<Icon.ChartBar size={20} color="white" weight="bold" />}
                            className="btn-primary"
                        >

                        </Button>
                        <Modal
                            open={openModal}
                            setOpen={setOpenModal}
                            title={"Pontuação:"}
                            accessibleDescription={""}
                            children={
                                <InstrumentResponsesTable />
                            } />
                        <Button
                            size="Medium"
                            onClick={() => handleShowPunctuation()}
                            title={"Pontuação do Questionário"}
                            color={"primary"}
                            children={<Icon.Trophy size={20} color="white" weight="bold" />}
                            className="btn-primary"
                        />
                        <Modal
                            open={openModalCloud}
                            setOpen={setOpenModalCloud}
                            title={"Selecione as fontes de palavras:"}
                            accessibleDescription={""}
                        >
                            <Flex justify={isDesktop ? "between" : "center"} direction={isDesktop ? "column" : "column"} className="gap-3  xl:pt-4 pb-4 ">
                                {CloudWord.map((itens, index) => (
                                    <Text as="label" size="3" >
                                        <Flex gap="2" className={`card-container p-2`} direction={isDesktop ? "row" : "row"}>
                                            <Switch.Root
                                                className="w-11 h-6 rounded-full relative data-[state=checked]:bg-primary bg-gray-300 transition-colors duration-200"
                                                checked={isCheckedWC[index]}
                                                onCheckedChange={() => handleChangeWC(index)}
                                                value={itens.value}
                                            >
                                                <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                                            </Switch.Root>
                                            {/* <Checkbox
                                                        className="hover:cursor-pointer"
                                                        
                                                        checked={isCheckedWC[index]}
                                                        value={itens.value}
                                                    /> */}
                                            {itens.title}
                                        </Flex>
                                    </Text>
                                ))}
                            </Flex>
                            <Flex justify="end">
                                <Button
                                    onClick={cloudWords}
                                    className={`${showNewComponent ? 'hidden' : ''} items-end`}
                                    color="green"
                                    title={"Confirmar"}
                                    size={"Medium"}
                                />
                            </Flex>
                            {showNewComponent && (
                                <>
                                    {CloudWord.map((item, index) => {
                                        if (isCheckedWC[index]) {
                                            switch (item.value) {
                                                case "RES-SUB":
                                                    return (
                                                        <Box key={index} className="xl:w-full  m-auto">
                                                            <p className="text-lg font-bold text-center mb-4">
                                                                Respostas Subjetivas / Quantidade de Avaliados: {selectedParticipants.length}
                                                            </p>
                                                            <WordCloudGenerator
                                                                textBio={selectedParticipants.map((participant) => {
                                                                    const combinedSubjective = [
                                                                        ...Array.from({ length: 8 }, (_, i) =>
                                                                            participant.adultForm?.answersByGroup?.[0]?.questions[i]?.answer || []
                                                                        ).flat(),
                                                                        ...Array.from({ length: 5 }, (_, i) =>
                                                                            participant.adultForm?.answersByGroup?.[5]?.questions[i]?.answer || []
                                                                        ).flat(),
                                                                    ];
                                                                    return combinedSubjective.join(', ') || '';
                                                                })}
                                                            />
                                                        </Box>
                                                    );
                                                case "AUT-BIO":
                                                    return (
                                                        <Box key={index} className="xl:w-full m-auto">
                                                            <p className="text-lg font-bold text-center mb-4">
                                                                Autobiografia / Quantidade de Avaliados: {selectedParticipants.length}
                                                            </p>
                                                            <WordCloudGenerator
                                                                textBio={selectedParticipants.map((participant) => participant.autobiography?.text || '')}
                                                            />
                                                        </Box>
                                                    );
                                                case "ARE-SAB":
                                                    return (
                                                        <Box key={index} className="xl:w-full  m-auto">
                                                            <p className="text-lg font-bold text-center mb-4">
                                                                Áreas do Saber / Quantidade de Avaliados: {selectedParticipants.length}
                                                            </p>
                                                            <WordCloudGenerator
                                                                textBio={selectedParticipants.map((participant) => {
                                                                    const combinedAreas = [
                                                                        ...(participant.knowledgeAreasIndicatedByResearcher?.general || []),
                                                                        ...(participant.knowledgeAreasIndicatedByResearcher?.specific || []),
                                                                        ...(participant.adultForm?.knowledgeAreas || []),
                                                                    ];
                                                                    return combinedAreas.join(', ') || '';
                                                                })}
                                                            />
                                                        </Box>
                                                    );
                                                default:
                                                    return (
                                                        <Box key={index}>
                                                            <p className="text-lg font-bold text-center mb-4">
                                                                Valor não reconhecido: {item.title}
                                                            </p>
                                                        </Box>
                                                    );
                                            }
                                        }
                                        return null;
                                    })}
                                </>
                            )}
                        </Modal>
                        <Button
                            size="Medium"
                            onClick={handleShowCloud}
                            title={"Gerar Nuvem de Palavras"}
                            color={"primary"}
                            children={<Icon.Cloud size={20} color="white" weight="bold" />}
                            className="btn-primary"
                        />
                    </Flex>
                </>
            )}


            <Box className="w-full m-auto ">

                <Table.Root variant="surface" className="desktop card-container" >
                    <Table.Header className="text-[14px] bg-violet-200">
                        <Table.Row className="" >
                            <Table.ColumnHeaderCell colSpan={4} className="border-l border-none" align="center">Informações do participante</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell colSpan={2} className="border-l" align="center">Indicadores de AH/SD</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell colSpan={3} className="border-l" align="center">Áreas do saber</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l"></Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Header className="text-[14px] bg-violet-200">
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
                    <Table.Header className="text-[14px] bg-violet-200">
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
                                    <ActionButtonExplain />
                                </Flex>
                            </Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>

                    {loading ? (
                        <SkeletonTableBody itens={5} columns={10} />
                    ) : (
                        <Table.Body className="text-[14px]">
                            {(() => {
                                const filteredParticipants = sample.participants
                                    ?.slice(startIndex, endIndex)
                                    .filter(filterParticipants);

                                if (filteredParticipants?.length === 0) {
                                    return (
                                        <Table.Row align="center">
                                            <Table.Cell colSpan={10} justify={"center"}>
                                                Nenhum participante encontrado
                                            </Table.Cell>
                                        </Table.Row>
                                    );
                                }

                                return filteredParticipants?.map((participant, idx) => (
                                    <Table.Row
                                        align={"center"}
                                        className={isChecked[startIndex + idx] ? 'bg-violet-50' : ''}
                                        key={startIndex + idx}
                                    >

                                        <Table.Cell justify="center">
                                            <Checkbox
                                                className="hover:cursor-pointer"
                                                checked={isChecked[startIndex + idx] ?? false}
                                                onCheckedChange={() => handleChange(startIndex + idx)}
                                                color="violet"
                                            />
                                        </Table.Cell>
                                        <Table.Cell justify="center"> {getFirstAndLastName(participant.personalData.fullName)}</Table.Cell>
                                        <Table.Cell justify="center" >{participant.adultForm?.totalPunctuation}</Table.Cell>
                                        <Table.Cell justify="center">{participant.secondSources?.length}</Table.Cell>
                                        <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>
                                        <Table.Cell justify="center">
                                            <Modal
                                                open={openModalIAH}
                                                setOpen={setOpenModalIAH}
                                                title={"Indicadores de AH/SD"}
                                                accessibleDescription={"Essa área é destinada a identificar se a pessoa apresenta características de Altas Habilidades/Superdotação (AH/SD), com base nos critérios estabelecidos pelo pesquisador."}>
                                                <Flex direction="column" gap="2">

                                                    <Flex align="center" gap="2" className="text-[20px]">
                                                        <Checkbox
                                                            checked={selectedOption === "sim"}
                                                            onCheckedChange={() => handleCheckboxChange("sim")}
                                                            className="hover:cursor-pointer"
                                                        >
                                                        </Checkbox>
                                                        Sim
                                                    </Flex>
                                                    <Flex align="center" gap="2" className="text-[20px]">
                                                        <Checkbox
                                                            checked={selectedOption === "nao"}
                                                            onCheckedChange={() => handleCheckboxChange("nao")}
                                                            className="hover:cursor-pointer"
                                                        >
                                                        </Checkbox>
                                                        Não
                                                    </Flex>
                                                </Flex>
                                                <Flex align="center" justify="center" className="gap-4">

                                                    <Button
                                                        loading={isSavingItem}
                                                        title={"Salvar alterações"}
                                                        color="green"
                                                        size="Medium"
                                                        className="mt-5"
                                                        onClick={handleSaveGift}
                                                        disabled={isSavingItem}
                                                        children={<Icon.FloppyDisk size={18} weight="bold" />}
                                                    >
                                                    </Button>
                                                </Flex>
                                            </Modal>
                                            <Flex direction={"row"} align={"center"} justify={"center"} gap={"4"}>
                                                {participant.giftdnessIndicatorsByResearcher ? 'Sim' : "Não"}

                                                <IconButton size="1" variant="surface" radius="full" >
                                                    <Icon.Pencil

                                                        onClick={() => participant._id && handleShowIAH(participant._id)}
                                                        className="cursor-pointer"
                                                    />
                                                </IconButton>
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell justify="center">
                                            <Flex align="center" direction="row" justify="center" className="mb-0" >
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
                                                open={openModalKAG}
                                                setOpen={setOpenModalKAG}
                                                title={"Selecione as Áreas Gerias:"}
                                                accessibleDescription={"Essas áreas gerais são utilizadas para compreender as habilidades e talentos amplos de um indivíduo, com o objetivo de fornecer suporte e orientação adequada, identificando o potencial de desenvolvimento em diversas dimensões da vida pessoal e acadêmica."} >
                                                <Select
                                                    isMulti
                                                    aria-hidden="false"
                                                    options={selectItensKA.map((iten) => ({
                                                        value: iten.value,
                                                        label: iten.label,
                                                    }))}
                                                    className="text-black"
                                                    placeholder="Selecione uma ou várias opções"
                                                    menuPosition="fixed"
                                                    onChange={handleChangeKA}

                                                />
                                                <Flex align="center" justify="center" className="gap-4 mt-0">
                                                    <Button
                                                        loading={isSavingItem}
                                                        title={"Salvar alterações"}
                                                        color="green"
                                                        size="Medium"
                                                        className="mt-5"
                                                        onClick={async () => await handleSubmitKA("KAG")}
                                                        disabled={isSavingItem}
                                                        children={<Icon.FloppyDisk size={18} weight="bold" />}
                                                    >
                                                    </Button>
                                                </Flex>
                                            </Modal>
                                            <Flex align="center" direction="row" justify="center" className="gap-2" >
                                                <Text as="label" className="pr-3">
                                                    {participant.knowledgeAreasIndicatedByResearcher?.general[0]}{'...'}{''}
                                                </Text>
                                                <HoverCard.Root>
                                                    <HoverCard.Trigger >
                                                        <IconButton size="1" variant="surface" radius="full">
                                                            <Icon.Eye size={15} className="hover:cursor-pointer" />
                                                        </IconButton>
                                                    </HoverCard.Trigger>
                                                    <HoverCard.Content size="3" >
                                                        <Text as="div" size="3" trim="both">
                                                            {participant.knowledgeAreasIndicatedByResearcher?.general.map((area, index) => (
                                                                <span key={index}>
                                                                    {area}
                                                                    {index !== (participant.knowledgeAreasIndicatedByResearcher?.general.length ?? 0) - 1 && ", "}
                                                                </span>
                                                            ))}
                                                        </Text>
                                                    </HoverCard.Content>
                                                </HoverCard.Root>
                                                <Tooltip content="Definir/Editar Áreas Gerais">
                                                    <IconButton size="1" variant="surface" radius="full" >
                                                        <Icon.Pencil
                                                            onClick={() => participant._id && handleShowKAG(participant._id)}
                                                            className="cursor-pointer"
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
                                        </Table.Cell>
                                        <Table.Cell justify="center">
                                            <Modal
                                                open={openModalKAE}
                                                setOpen={setOpenModalKAE}
                                                title={"Selecione as Áreas Específicas:"}
                                                accessibleDescription={"Essas áreas específicas são utilizadas para identificar talentos excepcionais em diferentes campos, ajudando a orientar intervenções educacionais e sociais para promover o desenvolvimento e o reconhecimento de indivíduos com AH/SD."} >
                                                <Select
                                                    isMulti
                                                    options={selectItensKA.map((item) => ({
                                                        value: item.value,
                                                        label: item.label,
                                                    })) as any}
                                                    className="text-black"
                                                    placeholder="Selecione uma ou várias opções"
                                                    menuPosition="fixed"
                                                    onChange={handleChangeKA}
                                                />
                                                <Flex align="center" justify="center" className="gap-4">
                                                    <Button
                                                        loading={isSavingItem}
                                                        title={"Salvar alterações"}
                                                        color="green"
                                                        size="Medium"
                                                        className="mt-5"
                                                        onClick={async () => await handleSubmitKA("KAE")}
                                                        disabled={isSavingItem}
                                                        children={<Icon.FloppyDisk size={18} weight="bold" />}
                                                    >
                                                    </Button>
                                                </Flex>
                                            </Modal>
                                            <Flex align="center" direction="row" justify="center" className="gap-2" >
                                                <Text as="label" className="pr-3">
                                                    {participant.knowledgeAreasIndicatedByResearcher?.specific[0]}{'...'}{''}
                                                </Text>
                                                <HoverCard.Root>
                                                    <HoverCard.Trigger >
                                                        <IconButton size="1" variant="surface" radius="full">
                                                            <Icon.Eye size={15} className="hover:cursor-pointer" />
                                                        </IconButton>
                                                    </HoverCard.Trigger>
                                                    <HoverCard.Content size="3" >
                                                        <Text as="div" size="3" trim="both">
                                                            {participant.knowledgeAreasIndicatedByResearcher?.specific.map((area, index) => (
                                                                <span key={index}>
                                                                    {area}
                                                                    {index !== (participant.knowledgeAreasIndicatedByResearcher?.specific.length ?? 0) - 1 && ",\u00A0"}
                                                                </span>
                                                            ))}
                                                        </Text>
                                                    </HoverCard.Content>
                                                </HoverCard.Root>
                                                <Tooltip content="Definir/Editar Áreas Específicas">
                                                    <IconButton size="1" variant="surface" radius="full" >
                                                        <Icon.Pencil
                                                            onClick={() => participant._id && handleShowKAE(participant._id)}
                                                            className="cursor-pointer"
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            </Flex>
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

                                                        </Flex>
                                                        <Flex gap="3" mt="4" justify="end">
                                                            <Dialog.Close>
                                                                <Button color="red" className="w-[100px]" title={"Fechar"} size={"Extra Small"}>
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

                                                        <EmptyState
                                                            icon={<Icon.Users size={40} />}
                                                            title="Aguardando resposta da 2ª fonte."
                                                            description="A comparação só será exibida após a 2ª fonte concluir o questionário. Assim que a resposta for registrada, você poderá visualizar as diferenças e semelhanças entre as percepções."
                                                        />

                                                        <Flex gap="3" mt="4" justify="end">
                                                            <AlertDialog.Cancel className="absolute top-2 right-2">
                                                                <Button
                                                                    className="hover:cursor-pointer"
                                                                    aria-label="Close modal" title={""} color={"red"} size={"Small"}>
                                                                    <Icon.X size={20} weight="bold" />
                                                                </Button>
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
                                ));
                            })()}
                        </Table.Body>
                    )}

                </Table.Root>
                <div className="mobo">
                    <DataList.Root orientation="vertical" className="!font-roboto">
                        {loading ? (
                            <SkeletonDataList itens={3} titles={1} columns={3} actionButton={true} />
                        ) : (
                            (() => {
                                const filteredParticipants = sample.participants
                                    ?.slice(startIndex, endIndex)
                                    .filter(participant => {
                                        // Verificação básica de pontuação
                                        if (participant.adultForm?.totalPunctuation === undefined) {
                                            return false;
                                        }

                                        const punctuation = participant.adultForm.totalPunctuation;
                                        const knowledgeAreas = participant.adultForm?.knowledgeAreas || [];

                                        // Filtro por nome
                                        if (filters.searchName &&
                                            !participant.personalData.fullName.toLowerCase().includes(filters.searchName.toLowerCase())) {
                                            return false;
                                        }

                                        // Filtro por área do saber
                                        if (filters.knowledgeArea && filters.knowledgeArea !== "default" &&
                                            !knowledgeAreas.includes(filters.knowledgeArea)) {
                                            return false;
                                        }

                                        // Filtro por pontuação mínima
                                        if (filters.minPunctuation && filters.minPunctuation !== 99) {
                                            const selectedRange = getRangeForPercentage(Number(filters.minPunctuation));
                                            if (selectedRange && (punctuation < selectedRange.min || punctuation > selectedRange.max)) {
                                                return false;
                                            }
                                        }

                                        return true;
                                    });

                                return filteredParticipants?.map((participant, idx) => {

                                    const isExpanded = participant._id ? expandedParticipants[participant._id] : false;
                                    const isSelected = isChecked[startIndex + idx];
                                    const participantId = String(participant._id) ?? '';

                                    return (
                                        <DataList.Item
                                            key={startIndex + idx}
                                            className={`w-full p-3 card-container rounded-lg mb-5 border-2 border-[#baa7ff] bg-[#f9f6ffcc] transition-all duration-300 ease-in-out 
              ${isSelected ? '!bg-violet-100 !border-primary' : ''} 
              ${isExpanded ? 'max-h-[1000px]' : 'max-h-[300px]'}`}
                                            onClick={() => handleChange(startIndex + idx)} // Adiciona clique na linha inteira
                                        >
                                            {/* Informações Básicas */}
                                            <p className="text-[16px] font-bold text-center border-b-black">Informações do participante</p>

                                            <DataList.Label>Nome:</DataList.Label>
                                            <DataList.Value>{getFirstAndLastName(participant.personalData.fullName)}</DataList.Value>
                                            <Separator size="4" />

                                            <DataList.Label>Pontuação do questionário:</DataList.Label>
                                            <DataList.Value>{participant.adultForm?.totalPunctuation}</DataList.Value>
                                            <Separator size="4" />

                                            <DataList.Label>Quantidade de 2ªs Fontes:</DataList.Label>
                                            <DataList.Value>{participant.secondSources?.length}</DataList.Value>
                                            <Separator size="4" className="mb-2" />

                                            {isExpanded && (
                                                <>
                                                    <p className="text-[16px] font-bold text-center">Indicadores de AH/SD:</p>
                                                    <DataList.Label>Pelo Questionário:</DataList.Label>
                                                    <DataList.Value className="gap-2">
                                                        {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}

                                                    </DataList.Value>
                                                    <Separator size="4" />

                                                    <DataList.Label>Pelo Pesquisador:</DataList.Label>
                                                    <DataList.Value className="gap-2">
                                                        {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                                                        <IconButton
                                                            size="1"
                                                            variant="surface"
                                                            radius="full"
                                                            className="ml-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                participant._id && handleShowIAH(participant._id);
                                                            }}
                                                        >
                                                            <Icon.Pencil size={15} />
                                                        </IconButton>
                                                    </DataList.Value>
                                                    <Separator size="4" className="my-2" />

                                                    <p className="text-[16px] font-bold text-center">Áreas do saber:</p>
                                                    <Flex direction="column" gap="2">
                                                        <DataList.Label>Indicadas pelo Questionário:</DataList.Label>
                                                        <DataList.Value className="gap-[1px] flex-wrap">
                                                            {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                                                                <span key={index}>
                                                                    {area}
                                                                    {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                                                                </span>
                                                            ))}
                                                        </DataList.Value>
                                                        <Separator size="4" className="my-2" />

                                                        <DataList.Label>Indicadas pelo Pesquisador:</DataList.Label>
                                                        <DataList.Label>Áreas Gerais</DataList.Label>
                                                        <DataList.Value className="gap-2 flex-wrap">
                                                            {participant.knowledgeAreasIndicatedByResearcher?.general?.map((area, index) => (
                                                                <span key={index}>
                                                                    {area}
                                                                    {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                                                                </span>
                                                            ))}
                                                            <IconButton
                                                                size="1"
                                                                variant="surface"
                                                                radius="full"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    participant._id && handleShowKAG(participant._id);
                                                                }}
                                                            >
                                                                <Icon.Pencil size={15} />
                                                            </IconButton>
                                                        </DataList.Value>
                                                        <Separator size="4" />

                                                        <DataList.Label>Áreas Específicas</DataList.Label>
                                                        <DataList.Value className="gap-2">
                                                            {participant.knowledgeAreasIndicatedByResearcher?.specific?.map((area, index) => (
                                                                <span key={index}>
                                                                    {area}
                                                                    {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                                                                </span>
                                                            ))}
                                                            <IconButton
                                                                size="1"
                                                                variant="surface"
                                                                radius="full"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    participant._id && handleShowKAE(participant._id);
                                                                }}
                                                            >
                                                                <Icon.Pencil size={15} />
                                                            </IconButton>
                                                        </DataList.Value>
                                                        <Separator size="4" />
                                                    </Flex>

                                                    {/* Ações */}
                                                    <Flex gap="2" direction="row" align="center" className="mt-2 mb-0">
                                                        <p className="text-[16px] font-bold text-center">Ações </p>
                                                        <ActionButtonExplain />
                                                        <Flex align="center" gap="3" className="!justify-end w-full">
                                                            <Tooltip content="Informações completas">
                                                                <IconButton
                                                                    variant="outline"
                                                                    color="lime"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCompareSource(participant);
                                                                    }}
                                                                >
                                                                    <Icon.IdentificationCard size={20} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip content="Comparar fontes">
                                                                <IconButton
                                                                    variant="outline"
                                                                    color="cyan"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleCompareSource(participant);
                                                                    }}
                                                                >
                                                                    <Icon.ClipboardText size={20} />
                                                                </IconButton>
                                                            </Tooltip>

                                                            <Tooltip content="Autobiografia">
                                                                <IconButton
                                                                    variant="outline"
                                                                    color="bronze"
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        handleEvaluateAutobiography(participant, sample);
                                                                    }}
                                                                >
                                                                    <Icon.IdentificationBadge size={20} />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Flex>
                                                    </Flex>
                                                    <Separator size="4" className="my-2" />
                                                </>
                                            )}

                                            <DataList.Label className="justify-end">
                                                <Flex direction="row" justify="center" gap="2" align="center" className="mb-0">
                                                    <p className="text-[12px] font-bold text-center">
                                                        {isSelected ? "Desmarcar" : "Selecionar"} participante
                                                    </p>
                                                    <Checkbox
                                                        className="hover:cursor-pointer justify-end"
                                                        checked={isSelected ?? false}
                                                        onCheckedChange={() => handleChange(startIndex + idx)}
                                                        color="violet"
                                                    />
                                                </Flex>
                                            </DataList.Label>

                                            <button
                                                className="justify-end items-center leading-none flex gap-2 mt-2"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setExpandedParticipants(prev => ({
                                                        ...prev,
                                                        [participantId]: !prev[participantId]
                                                    }));
                                                }}
                                            >
                                                {isExpanded ? "Veja menos" : "Ver mais"}
                                                <Icon.CaretDown
                                                    size={15}
                                                    className={`transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                                                />
                                            </button>
                                        </DataList.Item>
                                    );
                                });
                            })()
                        )}
                    </DataList.Root>
                </div>
            </Box>
            <Flex gap="2" mt="4" justify="center" align="center">
                <Theme.Button className="hover:cursor-pointer" variant="surface" onClick={() => handlePageChange(currentPage - 1)}>{`<`}</Theme.Button>
                {renderPagination()}
                <Theme.Button className="hover:cursor-pointer" variant="surface" onClick={() => handlePageChange(currentPage + 1)}>{`>`}</Theme.Button>
            </Flex>
            <GridComponent
                className="gap-5 mt-5 m-auto w-full  max-xl:p-2"
                children={
                    <>
                        <Skeleton loading={loading} >
                            <Box className="rounded overflow-hidden  bg-white card-container p-2 font-roboto ">
                                <PercentageGiftedChart participants={sample.participants?.filter(participant => participant.adultForm?.totalPunctuation != null) || []} />
                            </Box>
                        </Skeleton>
                        <Skeleton loading={loading} >
                            <Box className="rounded overflow-hidden  bg-white card-container  font-roboto p-2">

                                <ResponseChartByGender participants={sample.participants?.filter(participant => participant.adultForm?.totalPunctuation != null) || []} />
                            </Box>
                        </Skeleton>

                    </>}
                columns={2}>

            </GridComponent>


        </Notify >

    );
};

export default AnalysisPage;
