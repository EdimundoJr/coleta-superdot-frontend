import { PAGE_SIZE } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import SamplesTable from "../../components/Table/SamplesTable/SamplesTable";
import { PageSampleSummary, paginateAllSamples, seeAttachment } from "../../api/sample.api";
import SampleReviewForm from "../../components/Form/SampleReviewForm/SampleReviewForm";
import { SampleReviewWithReviewerName, findReviewsBySampleId } from "../../api/sampleReview.api";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { SampleSummary } from "../../api/sample.api";
import { SampleStatus } from "../../utils/consts.utils";
import Notify from "../../components/Notify/Notify";
import { Container, Flex, Skeleton } from "@radix-ui/themes";
import { Button } from "../../components/Button/Button";
import * as Icon from "@phosphor-icons/react"
import axios from "axios";
import ForbiddenPage from "../../components/ForbiddenPage/ForbiddenPage";

const SampleReviewPage = () => {
    /* PAGE GLOBAL STATES */
    const [sampleSelected, setSampleSelected] = useState<SampleSummary | undefined>();
    const [showSuccessNotify, setShowSuccessNotify] = useState(false);
    const [loading, setLoading] = useState(true);
    const [forbidden, setForbidden] = useState(false);

    /* TABLE STATES */
    const [tablePageData, setTablePageData] = useState<PageSampleSummary>();
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<SampleStatus | "">("");
    const [refreshTable, setRefreshTable] = useState(false);

    /* TABLE DATA FETCH*/
    useEffect(() => {
        const getPage = async () => {
            try {
                const response = await paginateAllSamples(currentTablePage, PAGE_SIZE, filterStatus);
                if (response.status === 200) {
                    setTablePageData(response.data);
                    setForbidden(false);
                }
            } catch (error) {
                if (axios.isAxiosError(error) && error.response?.status === 403) {
                    setForbidden(true);
                } else {
                    console.error('Erro ao buscar revisões:', error);
                }
            }

        };

        getPage();
        setLoading(false)
    }, [currentTablePage, filterStatus, refreshTable]);

    /* TABLE HANDLERS */
    const handleChangeFilterStatus = (filter: SampleStatus | "") => {
        setFilterStatus(filter);
    };

    /* REVIEW CREATION STATES */
    const [modalReviewingOpen, setModalReviewingOpen] = useState(false);
    //const [currentSampleStatus, setCurrentSampleStatus] = useState<SampleStatus>();

    /* REVIEW CREATION HANDLERS */
    const handleOnClickToReviewSample = (sampleId: string) => {
        const sample = tablePageData?.data.find((sample) => sample.sampleId === sampleId);
        setSampleSelected(sample);
        setModalReviewingOpen(true);
    };

    const handleOnFinishReviewCreation = () => {
        setModalReviewingOpen(false);
        setRefreshTable((val) => !val);
    };

    /* VIEW SAMPLE REVIEWS STATES */
    const [modalListReviewsOpen, setModalListReviewsOpen] = useState(false);
    const [reviewsData, setReviewsData] = useState<SampleReviewWithReviewerName[]>();

    /* VIEW SAMPLE REVIEWS HANDLERS */
    const handleOnClickListSampleReviews = async (sample: SampleSummary) => {
        const response = await findReviewsBySampleId(sample.sampleId);
        if (response.status === 200) {
            setReviewsData(response.data);
        }
        setSampleSelected(sample);
        setModalListReviewsOpen(true);
    };



    /* VIEW ATTACHMENTS STATES */
    const [modalAttachmentsOpen, setModalAttachmentsOpen] = useState(false);
    const [attachmentsToDisplay, setAttachmentsToDisplay] = useState<SampleSummary["files"]>();

    /* VIEW ATTACHMENTS HANDLERS */
    const handleOnClickToViewSampleAttachments = async (files: SampleSummary["files"]) => {
        setAttachmentsToDisplay(files);
        setModalAttachmentsOpen(true);
    };

    const handleSeeAttachment = async (fileName: string) => {
        const response = await seeAttachment(fileName);
        if (response.status === 200) {
            const fileObjectURL = URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
            window.open(fileObjectURL);
        }
    };

    return (
        <>
            <Notify
                onOpenChange={setShowSuccessNotify}
                open={showSuccessNotify}
                description="O perfil do usuário foi atualizado com sucesso!"
                title="Sucesso"
            >
                <>
                    {forbidden ? (
                        <ForbiddenPage />
                    ) : (
                        <Skeleton loading={loading}>
                            <Container className="mb-8 p-4 ">

                                <SamplesTable
                                    onClickToReviewSample={handleOnClickToReviewSample}
                                    onClickToViewSampleReviews={handleOnClickListSampleReviews}
                                    onClickToViewSampleAttachments={handleOnClickToViewSampleAttachments}
                                    currentStatus={filterStatus}
                                    onChangeFilterStatus={handleChangeFilterStatus}
                                    currentPage={currentTablePage}
                                    setCurrentPage={setCurrentTablePage}
                                    page={tablePageData}
                                    loading={loading} />
                            </Container>

                            <Modal
                                accessibleDescription="Revisando uma solicitação de amostra."
                                title="Revisando solicitação"
                                open={modalReviewingOpen}
                                setOpen={setModalReviewingOpen}
                            >
                                <SampleReviewForm sample={sampleSelected} onFinish={handleOnFinishReviewCreation} />
                            </Modal>

                            <Modal
                                accessibleDescription="Visulizando todas as revisões da respectiva amostra."
                                title="Revisões"
                                className="overflow-auto"
                                open={modalListReviewsOpen}
                                setOpen={setModalListReviewsOpen}
                            >
                                {reviewsData?.map((review) => (
                                    <ReviewCard reviewerFullName={review.reviewerFullName} reviewDetails={review.reviewDetails} />
                                ))}
                            </Modal>
                            <Modal
                                accessibleDescription="Visulizar os anexos da amostra."
                                title="Anexos"
                                open={modalAttachmentsOpen}
                                setOpen={setModalAttachmentsOpen}
                            >
                                <Flex align="center" justify="center" gap="2" className="flex-row max-sm:flex-col">
                                    {attachmentsToDisplay?.researchDocument && (


                                        <Button
                                            onClick={() => handleSeeAttachment(attachmentsToDisplay.researchDocument || "")} title={"Projeto de pesquisa"}
                                            children={<Icon.Files size={20} />} color={"primary"} size={"Small"}                            >

                                        </Button>

                                    )}
                                    {attachmentsToDisplay?.tcleDocument && (

                                        <Button
                                            onClick={() => handleSeeAttachment(attachmentsToDisplay.tcleDocument || "")}
                                            title={"TCLE"}
                                            children={<Icon.Files size={20} />} color={"primary"} size={"Small"}                            >

                                        </Button>
                                    )}
                                    {attachmentsToDisplay?.taleDocument && (


                                        <Button
                                            onClick={() => handleSeeAttachment(attachmentsToDisplay.taleDocument || "")}
                                            title={"TALE"}
                                            children={<Icon.Files size={20} />} color={"primary"} size={"Small"}                            >

                                        </Button>

                                    )}
                                </Flex>
                            </Modal>
                        </Skeleton>
                    )}
                </>
            </Notify>
        </>
    );
};

export default SampleReviewPage;
