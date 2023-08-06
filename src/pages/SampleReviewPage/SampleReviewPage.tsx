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

const SampleReviewPage = () => {
    /* PAGE GLOBAL STATES */
    const [sampleSelected, setSampleSelected] = useState<SampleSummary | undefined>();
    const [showSuccessNotify, setShowSuccessNotify] = useState(false);

    /* TABLE STATES */
    const [tablePageData, setTablePageData] = useState<PageSampleSummary>();
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [filterStatus, setFilterStatus] = useState<SampleStatus | "">("");
    const [refreshTable, setRefreshTable] = useState(false);

    /* TABLE DATA FETCH*/
    useEffect(() => {
        const getPage = async () => {
            const response = await paginateAllSamples(currentTablePage, PAGE_SIZE, filterStatus);
            if (response.status === 200) {
                setTablePageData(response.data);
            }
        };

        getPage();
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
        <Notify
            onOpenChange={setShowSuccessNotify}
            open={showSuccessNotify}
            description="O perfil do usuário foi atualizado com sucesso!"
            title="Sucesso"
        >
            <header className="mt-6 text-2xl font-bold">Solicitações</header>
            <div className="mb-8 overflow-x-scroll">
                <SamplesTable
                    onClickToReviewSample={handleOnClickToReviewSample}
                    onClickToViewSampleReviews={handleOnClickListSampleReviews}
                    onClickToViewSampleAttachments={handleOnClickToViewSampleAttachments}
                    currentStatus={filterStatus}
                    onChangeFilterStatus={handleChangeFilterStatus}
                    currentPage={currentTablePage}
                    setCurrentPage={setCurrentTablePage}
                    page={tablePageData}
                />
            </div>
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
                open={modalListReviewsOpen}
                setOpen={setModalListReviewsOpen}
            >
                {reviewsData?.map((review) => (
                    <ReviewCard reviewerFullName={review.reviewerFullName} reviewDetails={review.reviewDetails} />
                ))}
            </Modal>
            <Modal
                accessibleDescription="Visulizando os anexos da amostra."
                title="Anexos"
                open={modalAttachmentsOpen}
                setOpen={setModalAttachmentsOpen}
            >
                <ul className="text-center">
                    {attachmentsToDisplay?.researchDocument && (
                        <li>
                            Projeto de pesquisa:
                            <button
                                onClick={() => handleSeeAttachment(attachmentsToDisplay.researchDocument || "")}
                                className="button-neutral-light m-4"
                            >
                                Visualizar
                            </button>
                        </li>
                    )}
                    {attachmentsToDisplay?.tcleDocument && (
                        <li>
                            TCLE:
                            <button
                                onClick={() => handleSeeAttachment(attachmentsToDisplay.tcleDocument || "")}
                                className="button-neutral-light m-4"
                            >
                                Visualizar
                            </button>
                        </li>
                    )}
                    {attachmentsToDisplay?.taleDocument && (
                        <li>
                            TALE:
                            <button
                                onClick={() => handleSeeAttachment(attachmentsToDisplay.taleDocument || "")}
                                className="button-neutral-light m-4"
                            >
                                Visualizar
                            </button>
                        </li>
                    )}
                </ul>
            </Modal>
        </Notify>
    );
};

export default SampleReviewPage;
