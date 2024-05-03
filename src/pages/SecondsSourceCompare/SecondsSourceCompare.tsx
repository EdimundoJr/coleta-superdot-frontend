import { useLocation } from "react-router-dom";
import { IParticipant } from "../../interfaces/participant.interface";
import * as Icon from "@phosphor-icons/react";
import { Container, Flex } from "@radix-ui/themes";
import { Header } from "../../components/Header/Header";

interface LocationState {
    participant: IParticipant;
}

const SecondsSourceCompare = () => {
    const location = useLocation();

    const { participant } = location.state as LocationState;

    return (
        <Flex direction="column" className={`relative ml-2  border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] `}>
            <Header title={`Comparação com Segunda Fonte`} children={`Detalhes do Participante`} icon={<Icon.Books size={24}></Icon.Books>}></Header>
            <Container>
            <p>Nome: {participant.personalData.fullName}</p>
            <p>Pontuação Total: {participant.adultForm?.totalPunctuation}</p>
            <p>Indicadores de Superdotação: {participant.adultForm?.giftednessIndicators}</p>
            <p>Áreas de Conhecimento: {participant.adultForm?.knowledgeAreas?.join(", ")}</p>
            <p>{participant.autobiography?.text}</p>

            <h2>Segundas Fontes</h2>
            {participant?.secondSources?.map((secondSource, index) => (
                <div key={index}>
                    <h3>Segunda Fonte {index + 1}</h3>
                    <p>Nome: {secondSource.personalData?.fullName}</p>
                    <p>Id: {secondSource._id}</p>
                    {secondSource?.adultForm?.answersByGroup?.map((group, groupIndex) => (
                        <div key={groupIndex}>
                            <h4>Grupo: {group?.groupName}</h4>
                            {group?.questions?.map((question, questionIndex) => (
                                <div key={questionIndex}>
                                    <p>Pergunta: {question?.statement}</p>
                                    <p>Resposta: {question?.answer}</p>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            ))}
            </Container>
        </Flex>
    );
};

export default SecondsSourceCompare;
