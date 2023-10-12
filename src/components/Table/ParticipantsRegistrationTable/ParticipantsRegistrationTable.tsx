import { CopyIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { DateTime } from "luxon";
import { ISample } from "../../../interfaces/sample.interface";
import { EAdultFormSteps, TParticipantFormProgress } from "../../../utils/consts.utils";
import { ISecondSource } from "../../../interfaces/secondSource.interface";
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
    const getParticipantProgress = (
        currentStep: EAdultFormSteps | undefined,
        secondSources: ISecondSource[] | undefined
    ): TParticipantFormProgress => {
        if (currentStep === EAdultFormSteps.FINISHED) {
            if (secondSources?.length) {
                const allSecondSourcesFillingForm = secondSources?.every(
                    (secSource) => secSource.adultFormCurrentStep !== EAdultFormSteps.FINISHED
                );
                if (allSecondSourcesFillingForm) return "Aguardando 2ª fonte";
                else return "Finalizado";
            }
        }
        return "Preenchendo";
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
                        <td>{getParticipantProgress(participant.adultFormCurrentStep, participant.secondSources)}</td>
                        <td>
                            <div className="flex items-center justify-center">
                                {participant.secondSources?.length}
                                <MagnifyingGlassIcon
                                    className="cursor-pointer"
                                    onClick={() => onClickToViewSecondSources(participant)}
                                />
                            </div>
                        </td>
                        <td>{DateTime.fromISO(participant.createdAt).toFormat("dd/LL/yyyy - HH:mm")}</td>
                        <td>
                            {participant.endFillFormDate &&
                                DateTime.fromISO(participant.endFillFormDate).toFormat("dd/LL/yyyy - HH:mm")}
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
