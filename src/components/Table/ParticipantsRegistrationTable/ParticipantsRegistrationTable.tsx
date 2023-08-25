import { CopyIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Page, PageSampleSummary, ParticipantFormSummary } from "../../../api/sample.api";
import { DateTime } from "luxon";

interface ParticipantsRegistrationTableProps {
    page?: Page<ParticipantFormSummary>;
    currentPage: number;
    setCurrentPage: (newPage: number) => void;
    onClickToViewSecondSources: (participantId: string) => void;
}

const ParticipantsRegistrationTable = ({
    page,
    currentPage,
    setCurrentPage,
    onClickToViewSecondSources,
}: ParticipantsRegistrationTableProps) => {
    return (
        <table className="bg-dark-gradient mx-auto w-11/12 border-collapse rounded-md text-alternative-text">
            <thead>
                <tr>
                    <th className=" px-6 py-3">Nome</th>
                    <th className=" px-6 py-3">Andamento</th>
                    <th className=" px-6 py-3">2ªs Fontes</th>
                    <th className=" px-6 py-3">Data de início</th>
                    <th className=" px-6 py-3">Data de fim</th>
                    <th className=" px-6 py-3">Indicadores de AH/SD</th>
                    <th className=" px-6 py-3">URL 2ª fonte</th>
                </tr>
            </thead>
            <tbody className="bg-white text-primary">
                {page?.data?.map((participant) => (
                    <tr key={participant._id} className="odd:bg-gray-200">
                        <td className="border-x-2 border-primary px-6 py-3">{participant.fullName}</td>
                        <td className="border-x-2 border-primary px-6 py-3">{participant.formFillStatus}</td>
                        <td className="border-x-2 border-primary px-6 py-3 text-center">
                            <div className="flex justify-center">
                                {participant.qttSecondSources}
                                <MagnifyingGlassIcon className="cursor-pointer" />
                            </div>
                        </td>
                        <td className="border-x-2 border-primary px-6 py-3">
                            {DateTime.fromISO(participant.formFillStartDate || "").toFormat("dd/LL/yyyy - HH:mm")}
                        </td>
                        <td className="border-x-2 border-primary px-6 py-3">
                            {participant.formFillEndDate &&
                                DateTime.fromISO(participant.formFillEndDate || "").toFormat("dd/LL/yyyy - HH:mm")}
                        </td>
                        <td className="border-x-2 border-primary px-6 py-3">
                            {participant.giftednessIndicators ? "Sim" : "Não"}
                        </td>
                        <td className="border-x-2 border-primary px-6 py-3">
                            <CopyIcon />
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="text-right">
                    <td className="px-6 py-3" colSpan={3}></td>
                </tr>
            </tfoot>
        </table>
    );
};

export default ParticipantsRegistrationTable;
