import { CopyIcon } from "@radix-ui/react-icons";
import ParticipantsRegistrationTable from "../../components/Table/ParticipantsRegistrationTable/ParticipantsRegistrationTable";
import { useEffect, useState } from "react";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { useLocation, useNavigate } from "react-router-dom";
import ISample, { Page, ParticipantFormSummary, paginateParticipantFormSummary } from "../../api/sample.api";

const ParticipantsRegistration = () => {
    const [sample, setSample] = useState<ISample>();
    const [pageData, setPageData] = useState<Page<ParticipantFormSummary>>();
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getParticipantData = async (sampleId: string) => {
            const response = await paginateParticipantFormSummary(sampleId);
            if (response.status === 200) {
                setPageData(response.data);
            }
        };

        if (stateWithSample(location.state)) {
            setSample(location.state.sample);
            getParticipantData(location.state.sample._id);
        } else {
            navigate("/app/my-samples");
        }
    }, [navigate, location]);

    return (
        <>
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
                    <p>superdot-coleta.com.br/{sample?._id}/formulario-adulto</p>
                    <CopyIcon />
                </div>
                <p>Compartilhe a URL com os adultos que deseja adicionar à base de dados</p>
                <p>Máximo de inscrições: {sample?.qttParticipantsAuthorized}</p>
            </div>

            <h3>
                {`Novos participantes: ${sample?.qttParticipantsRegistered} (Aguardando mais ${
                    (sample?.qttParticipantsAuthorized || 0) - (sample?.qttParticipantsRegistered || 0)
                } participantes)`}
            </h3>

            <ParticipantsRegistrationTable
                page={pageData}
                currentPage={currentPage}
                setCurrentPage={(newPage: number) => setCurrentPage(newPage)}
                onClickToViewSecondSources={() => console.log("Second Sources")}
            />
        </>
    );
};

export default ParticipantsRegistration;
