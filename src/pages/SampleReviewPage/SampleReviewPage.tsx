import { PAGE_SIZE } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import * as Toast from "@radix-ui/react-toast";
import SamplesTable from "../../components/Table/SamplesTable/SamplesTable";
import { PageSampleSummary, paginateAllSamples, seeAttachment } from "../../api/sample.api";
import SampleReviewForm from "../../components/Form/SampleReviewForm/SampleReviewForm";
import { SampleReviewWithReviewerName, findReviewsBySampleId } from "../../api/sampleReview.api";
import ReviewCard from "../../components/ReviewCard/ReviewCard";
import { SampleSummary } from "../../api/sample.api";
import { SampleStatus } from "../../utils/consts.utils";

const SampleReviewPage = () => {
    /* PAGE GLOBAL STATES */
    const [sampleSelected, setSampleSelected] = useState<string | null>();
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
    const [currentSampleStatus, setCurrentSampleStatus] = useState<SampleStatus>();

    /* REVIEW CREATION HANDLERS */
    const handleOnClickToReviewSample = (sampleId: string) => {
        const status = tablePageData?.data.find((sample) => sample.sample_id === sampleId)?.currentStatus;
        setCurrentSampleStatus(status);
        setSampleSelected(sampleId);
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
    const handleOnClickListSampleReviews = async (sampleId: string) => {
        const response = await findReviewsBySampleId(sampleId);
        if (response.status === 200) {
            setReviewsData(response.data);
        }
        setSampleSelected(sampleId);
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
        <Toast.Provider swipeDirection="left">
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
                <SampleReviewForm
                    currentStatus={currentSampleStatus}
                    sampleId={sampleSelected || ""}
                    onFinish={handleOnFinishReviewCreation}
                />
            </Modal>
            <Modal
                accessibleDescription="Visulizando todas as revisões da respectiva amostra."
                title="Revisões"
                open={modalListReviewsOpen}
                setOpen={setModalListReviewsOpen}
            >
                {reviewsData?.map((review) => (
                    <ReviewCard reviewer_full_name={review.reviewer_full_name} review_details={review.review_details} />
                ))}
            </Modal>
            <Modal
                accessibleDescription="Visulizando os anexos da amostra."
                title="Anexos"
                open={modalAttachmentsOpen}
                setOpen={setModalAttachmentsOpen}
            >
                <ul className="text-center ">
                    {attachmentsToDisplay?.research_document && (
                        <li>
                            Projeto de pesquisa:
                            <button
                                onClick={() => handleSeeAttachment(attachmentsToDisplay.research_document || "")}
                                className="m-4 text-white"
                            >
                                Visualizar
                            </button>
                        </li>
                    )}
                    {attachmentsToDisplay?.tcle_document && (
                        <li>
                            TCLE:
                            <button
                                onClick={() => handleSeeAttachment(attachmentsToDisplay.tcle_document || "")}
                                className="m-4 text-white"
                            >
                                Visualizar
                            </button>
                        </li>
                    )}
                    {attachmentsToDisplay?.tale_document && (
                        <li>
                            TALE:
                            <button
                                onClick={() => handleSeeAttachment(attachmentsToDisplay.tale_document || "")}
                                className="m-4 text-white"
                            >
                                Visualizar
                            </button>
                        </li>
                    )}
                </ul>
            </Modal>
            <Toast.Root
                className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md border border-blue-800 bg-white p-[15px] text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
                open={showSuccessNotify}
                onOpenChange={setShowSuccessNotify}
            >
                <Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
                    Sucesso!
                </Toast.Title>
                <Toast.Description className="m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]">
                    <p>O perfil do usuário foi atualizado com sucesso!</p>
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className="fixed right-0 top-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
        </Toast.Provider>
    );
};

export default SampleReviewPage;
