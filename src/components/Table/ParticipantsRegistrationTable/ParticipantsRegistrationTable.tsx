import { CopyIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { ISample } from "../../../interfaces/sample.interface";
import { TFormFillStatus } from "../../../utils/consts.utils";
import { IParticipant } from "../../../interfaces/participant.interface";

interface ParticipantsRegistrationTableProps {
    sampleId: string;
    data?: ISample["participants"];
    currentPage: number;
    setCurrentPage: (newPage: number) => void;
    onClickToViewSecondSources: (participant: IParticipant) => void;
    onClickToCopySecondSourceURL: (text: string) => void;
}

const ParticipantsRegistrationTable = ({
    sampleId,
    data,
    currentPage,
    setCurrentPage,
    onClickToViewSecondSources,
    onClickToCopySecondSourceURL,
}: ParticipantsRegistrationTableProps) => {
    const getParticipantProgress = (participant: IParticipant): TFormFillStatus => {
        if (!participant.adultForm?.startFillFormAt) {
            return "Não iniciado";
        }

        if (!participant.adultForm?.endFillFormAt) {
            return "Preenchendo";
        }

        const oneSecSourceFinishTheForm = participant.secondSources?.some(
            (secSource) => secSource.adultForm?.endFillFormAt
        );

        if (!oneSecSourceFinishTheForm) {
            return "Aguardando 2ª fonte";
        }

        return "Finalizado";
    };

    return (
        <table className="bg-dark-gradient mx-auto w-11/12 border-collapse rounded-md text-alternative-text">
            <thead>
                <tr>
                    <th>Nome</th>
                    <th>Andamento</th>
                    <th>2ªs Fontes</th>
                    <th>Data de início</th>
                    <th>Data de fim</th>
                    <th>Indicadores de AH/SD</th>
                    <th>URL 2ª fonte</th>
                </tr>
            </thead>
            <tbody className="bg-white text-primary">
                {data?.map((participant) => (
                    <tr key={participant._id} className="odd:bg-gray-200">
                        <td>{participant.personalData.fullName}</td>
                        <td>{getParticipantProgress(participant)}</td>
                        <td>
                            <div className="flex items-center justify-center">
                                {participant.secondSources?.length}
                                <MagnifyingGlassIcon
                                    className="cursor-pointer"
                                    onClick={() => onClickToViewSecondSources(participant)}
                                />
                            </div>
                        </td>
                        <td>
                            {participant.adultForm?.startFillFormAt &&
                                DateTime.fromISO(participant.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")}
                        </td>
                        <td>
                            {participant.adultForm?.endFillFormAt &&
                                getParticipantProgress(participant) === "Finalizado" &&
                                DateTime.fromISO(participant.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")}
                        </td>
                        <td>{participant.giftdnessIndicators ? "Sim" : "Não"}</td>
                        <td>
                            <div className="flex justify-center">
                                <CopyIcon
                                    className="cursor-pointer"
                                    onClick={() =>
                                        onClickToCopySecondSourceURL(
                                            `${
                                                import.meta.env.VITE_FRONTEND_URL
                                            }/formulario-adulto-segunda-fonte/${sampleId}/${participant._id}`
                                        )
                                    }
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
            <tfoot>
                <tr className="text-right">
                    <td colSpan={3}></td>
                </tr>
            </tfoot>
        </table>
    );
};

export default ParticipantsRegistrationTable;
