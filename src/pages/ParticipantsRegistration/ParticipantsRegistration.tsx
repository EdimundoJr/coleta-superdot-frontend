import { CopyIcon } from "@radix-ui/react-icons";
import ParticipantsRegistrationTable from "../../components/Table/ParticipantsRegistrationTable/ParticipantsRegistrationTable";
import { useEffect, useState } from "react";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { useLocation, useNavigate } from "react-router-dom";
import { ISample } from "../../interfaces/sample.interface";
import Modal from "../../components/Modal/Modal";
import { IParticipant } from "../../interfaces/participant.interface";
import { DateTime } from "luxon";
import Notify from "../../components/Notify/Notify";
import { EAdultFormSteps } from "../../utils/consts.utils";

const ParticipantsRegistration = () => {
    const [sample, setSample] = useState<ISample>();
    const [currentPage, setCurrentPage] = useState(1);
    const [modalSecondSourcesOpen, setModalSecondSourcesOpen] = useState(false);
    const [currentParticipant, setCurrentParticipant] = useState<IParticipant>();

    /* STATES TO SHOW NOTIFICATION */
    const [notificationTitle, setNotificationTitle] = useState<string>();
    const [notificationDescription, setNotificationDescription] = useState<string>();

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (stateWithSample(location.state)) {
            setSample(location.state.sample);
        } else {
            navigate("/app/my-samples");
        }
    }, [navigate, location]);

    const handleViewSecondSources = (participant: IParticipant) => {
        setCurrentParticipant(participant);
        setModalSecondSourcesOpen(true);
    };

    const handleSendTextToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotificationTitle("Link copiado.");
        setNotificationDescription("O link foi copiado para a sua área de transferência.");
    };

    const urlParticipantForm = `${import.meta.env.VITE_FRONTEND_URL}/formulario-adulto/${sample?._id}`;

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <header className="my-6">
                <h1>Cadastrar Pessoas - {sample?.sampleGroup}</h1>
                <p>
                    Você ainda não selecionou a quantidade total de participantes da pesquisa. Utilize os recursos
                    abaixo para adicionar mais participantes
                </p>
            </header>

            <div className="bg-dark-gradient my-6 p-4 text-white">
                <h3>URL DO AVALIADO</h3>
                <div className="my-4 flex items-center justify-center gap-x-5">
                    <p>{urlParticipantForm}</p>
                    <CopyIcon
                        className="cursor-pointer"
                        onClick={() => handleSendTextToClipBoard(urlParticipantForm)}
                    />
                </div>
                <p>Compartilhe a URL com os adultos que deseja adicionar à base de dados</p>
                <p>Máximo de inscrições: {sample?.qttParticipantsAuthorized}</p>
            </div>

            <h3>
                {`Novos participantes: ${sample?.participants?.length} (Aguardando mais ${
                    (sample?.qttParticipantsAuthorized || 0) - (sample?.participants?.length || 0)
                } participantes)`}
            </h3>

            <ParticipantsRegistrationTable
                sampleId={sample?._id || ""}
                data={sample?.participants}
                currentPage={currentPage}
                setCurrentPage={(newPage) => setCurrentPage(newPage)}
                onClickToViewSecondSources={handleViewSecondSources}
                onClickToCopySecondSourceURL={handleSendTextToClipBoard}
            />

            {/* MODAL TO SHOW SECOND SOURCES */}
            <Modal
                open={modalSecondSourcesOpen}
                setOpen={setModalSecondSourcesOpen}
                title="Segundas fontes"
                accessibleDescription="Abaixo estão listadas as informações das segundas fontes do participante."
            >
                <table className="bg-dark-gradient mx-auto w-11/12 border-collapse rounded-md text-alternative-text">
                    <thead>
                        <tr>
                            <th>Nome</th>
                            <th>Andamento</th>
                            <th>Relação</th>
                            <th>Data de início</th>
                            <th>Data de fim</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white text-primary">
                        {currentParticipant?.secondSources?.map((secondSource) => (
                            <tr key={secondSource._id} className="odd:bg-gray-200">
                                <td>{secondSource.personalData.fullName}</td>
                                <td>
                                    {secondSource.adultFormCurrentStep === EAdultFormSteps.FINISHED
                                        ? "Finalizado"
                                        : "Preenchendo"}
                                </td>
                                <td>{secondSource.personalData.relationship}</td>
                                <td>
                                    {secondSource.startFillFormDate &&
                                        DateTime.fromISO(secondSource.startFillFormDate).toFormat("dd/LL/yyyy - HH:mm")}
                                </td>
                                <td>
                                    {secondSource.endFillFormDate &&
                                        DateTime.fromISO(secondSource.endFillFormDate).toFormat("dd/LL/yyyy - HH:mm")}
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
            </Modal>
        </Notify>
    );
};

export default ParticipantsRegistration;
