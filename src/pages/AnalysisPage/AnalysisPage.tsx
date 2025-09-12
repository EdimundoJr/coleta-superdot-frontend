import { useEffect, useState } from "react";
import { ISample } from "../../interfaces/sample.interface";
import * as Icon from '@phosphor-icons/react'
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { Box, Flex, Skeleton, } from "@radix-ui/themes";
import * as Theme from "@radix-ui/themes"
import { IParticipant } from "../../interfaces/participant.interface";
import { GridComponent } from "../../components/Grid/Grid";
import { answerByGender, AnswerByGender, getSampleById } from "../../api/sample.api";
import { patchSaveGiftdnessIndicatorsByResearcher, patchSaveKnowledgeAreasIndicatedByResearcher } from "../../api/participant.api";
import Notify from "../../components/Notify/Notify";
import PercentageGiftedChart from "../../components/Charts/PercentageGiftedChart";
import ResponseChartByGender from "../../components/Charts/ResponseChartByGender";
import { useForm } from "react-hook-form";
import SkeletonHeader from "../../components/Skeletons/SkeletonHeader";
import DesktopTableView from "../../components/DesktopTableView/DesktopTableView";
import MobileDataListView from "../../components/MobileDataListView/MobileDataListView";
import AnalysisHeaderAndFilters from "../../components/AnalysisHeaderAndFilters/AnalysisHeaderAndFilters";

interface Filters {
    searchName?: string;
    knowledgeArea?: string;
    minPunctuation?: number;
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
                type: "erro"
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
                    <AnalysisHeaderAndFilters
                        sample={sample}
                        isDesktop={isDesktop}
                        showSearch={showSearch}
                        setShowSearch={setShowSearch}
                        showFilters={isDesktop || showSearch}
                        handleSubmit={handleSubmit}
                        onSubmit={onSubmit}
                        register={register}
                        clearFilters={clearFilters}
                        selectItensKA={selectItensKA}
                        selectItensPM={selectItensPM}
                        openModalCompare={openModalCompare}
                        setOpenModalCompare={setOpenModalCompare}
                        handleCompareSelected={handleCompareSelected}
                        openModal={openModal}
                        setOpenModal={setOpenModal}
                        handleShowPunctuation={handleShowPunctuation}
                        openModalCloud={openModalCloud}
                        setOpenModalCloud={setOpenModalCloud}
                        CloudWord={CloudWord}
                        isCheckedWC={isCheckedWC}
                        handleChangeWC={handleChangeWC}
                        cloudWords={cloudWords}
                        showNewComponent={showNewComponent}
                        selectedParticipants={selectedParticipants}
                        handleShowCloud={handleShowCloud}
                        getRangeForPercentage={getRangeForPercentage}
                    />
                </>
            )}



            <Box className="w-full m-auto">
                {isDesktop ? (
                    <DesktopTableView
                        sample={sample}
                        loading={loading}
                        currentPage={currentPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        isChecked={isChecked}
                        isCheckedAll={isCheckedAll}
                        handleCheckAll={handleCheckAll}
                        handleChange={handleChange}
                        filterParticipants={filterParticipants}
                        openModalIAH={openModalIAH}
                        setOpenModalIAH={setOpenModalIAH}
                        openModalKAG={openModalKAG}
                        setOpenModalKAG={setOpenModalKAG}
                        openModalKAE={openModalKAE}
                        setOpenModalKAE={setOpenModalKAE}
                        selectedOption={selectedOption}
                        handleCheckboxChange={handleCheckboxChange}
                        isSavingItem={isSavingItem}
                        handleSaveGift={handleSaveGift}
                        handleChangeKA={handleChangeKA}
                        handleSubmitKA={handleSubmitKA}
                        selectedItems={selectedItems}
                        getFirstAndLastName={getFirstAndLastName}
                        getFormattedBirthDate={getFormattedBirthDate}
                        handleCompareSource={handleCompareSource}
                        handleEvaluateAutobiography={handleEvaluateAutobiography}
                        handleShowIAH={handleShowIAH}
                        handleShowKAG={handleShowKAG}
                        handleShowKAE={handleShowKAE}
                        selectItensKA={selectItensKA}
                    />
                ) : (
                    <MobileDataListView
                        sample={sample}
                        loading={loading}
                        currentPage={currentPage}
                        startIndex={startIndex}
                        endIndex={endIndex}
                        isChecked={isChecked}
                        handleChange={handleChange}
                        filterParticipants={filterParticipants}
                        expandedParticipants={expandedParticipants}
                        setExpandedParticipants={setExpandedParticipants}
                        getFirstAndLastName={getFirstAndLastName}
                        handleCompareSource={handleCompareSource}
                        handleEvaluateAutobiography={handleEvaluateAutobiography}
                        handleShowIAH={handleShowIAH}
                        handleShowKAG={handleShowKAG}
                        handleShowKAE={handleShowKAE}
                    />
                )}
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
