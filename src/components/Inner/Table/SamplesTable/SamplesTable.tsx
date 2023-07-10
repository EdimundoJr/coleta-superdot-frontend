import { ClipboardIcon, MagnifyingGlassIcon, Pencil1Icon } from "@radix-ui/react-icons";
import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE } from "../../../../api/researchers.api";
import { Page, SampleSummary } from "../../../../api/sample.api";
import { SampleStatus } from "../../../../utils/consts.utils";

interface SamplesTableProps {
    page?: Page;
    currentPage: number;
    currentStatus: SampleStatus | "";
    setCurrentPage: (newPage: number) => void;
    onClickToReviewSample: (itemId: string) => void;
    onClickToViewSampleReviews: (itemId: string) => void;
    onClickToViewSampleAttachments: (files: SampleSummary["files"]) => void;
    onChangeFilterStatus: (filter: SampleStatus | "") => void;
}

const SamplesTable = ({
    page,
    currentPage,
    currentStatus,
    setCurrentPage,
    onClickToReviewSample,
    onClickToViewSampleReviews,
    onClickToViewSampleAttachments,
    onChangeFilterStatus,
}: SamplesTableProps) => {
    return (
        <>
            <div className="mt-11 flex gap-5 sm:justify-center ">
                <div
                    onClick={() => onChangeFilterStatus("")}
                    className={`w-fit cursor-pointer rounded-t-lg p-1 ${
                        !currentStatus ? "bg-gray-500" : "bg-blue-950"
                    } hover:bg-blue-600`}
                >
                    Todos
                </div>
                <div
                    onClick={() => onChangeFilterStatus("Pendente")}
                    className={`w-fit cursor-pointer rounded-t-lg ${
                        currentStatus === "Pendente" ? "bg-gray-500" : "bg-blue-950"
                    } p-1 hover:bg-blue-600`}
                >
                    Pendentes
                </div>
                <div
                    onClick={() => onChangeFilterStatus("Autorizado")}
                    className={`w-fit cursor-pointer rounded-t-lg ${
                        currentStatus === "Autorizado" ? "bg-gray-500" : "bg-blue-950"
                    } p-1 hover:bg-blue-600`}
                >
                    Autorizados
                </div>
                <div
                    onClick={() => onChangeFilterStatus("Não Autorizado")}
                    className={`w-fit cursor-pointer rounded-t-lg ${
                        currentStatus === "Não Autorizado" ? "bg-gray-500" : "bg-blue-950"
                    } p-1 hover:bg-blue-600`}
                >
                    Não autorizados
                </div>
            </div>
            <table className="mx-auto w-11/12 border-collapse rounded-md bg-blue-950">
                <thead>
                    <tr>
                        <th className="px-6 py-3">Nome do Pesquisador</th>
                        <th className="px-6 py-3">Nome da amostra</th>
                        <th className="px-6 py-3">CAAE</th>
                        <th className="px-6 py-3">Participantes solicitados</th>
                        <th className="px-6 py-3">Participantes autorizados</th>
                        <th className="px-6 py-3">Status</th>
                        <th className="px-6 py-3">Ações</th>
                    </tr>
                </thead>
                <tbody className="bg-white text-blue-950">
                    {page?.data?.map((sample) => (
                        <tr key={sample.sample_id} className="odd:bg-gray-200">
                            <td className="border-x-2 border-gray-600 px-6 py-3">{sample.researcher_name}</td>
                            <td className="border-x-2 border-gray-600 px-6 py-3">{sample.sample_name}</td>
                            <td className="border-x-2 border-gray-600 px-6 py-3">{sample.cep_code}</td>
                            <td className="border-x-2 border-gray-600 px-6 py-3">
                                {sample.qtt_participants_requested}
                            </td>
                            <td className="border-x-2 border-gray-600 px-6 py-3">
                                {sample.qtt_participants_authorized}
                            </td>
                            <td className="border-x-2 border-gray-600 px-6 py-3">{sample.currentStatus}</td>
                            <td className="border-x-2 border-gray-600 px-6 py-3 text-center">
                                <div className="flex justify-center gap-2">
                                    <Pencil1Icon
                                        onClick={() => onClickToReviewSample(sample.sample_id)}
                                        className="cursor-pointer"
                                    />
                                    <MagnifyingGlassIcon
                                        onClick={() => onClickToViewSampleReviews(sample.sample_id)}
                                        className="cursor-pointer"
                                    />
                                    <ClipboardIcon
                                        onClick={() => onClickToViewSampleAttachments(sample.files)}
                                        className="cursor-pointer"
                                    />
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr className="text-right">
                        <td className="px-6 py-3" colSpan={3}>
                            <Pagination
                                currentPage={currentPage}
                                pageSize={PAGE_SIZE}
                                totalCount={page?.pagination.totalItems || 0}
                                onPageChange={(page: number) => setCurrentPage(page)}
                            />
                        </td>
                    </tr>
                </tfoot>
            </table>
        </>
    );
};

export default SamplesTable;
