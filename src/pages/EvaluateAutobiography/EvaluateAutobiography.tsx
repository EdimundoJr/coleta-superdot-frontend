import { useLocation } from "react-router-dom";
import { IParticipant } from "../../interfaces/participant.interface";
import { Flex, Section, TextArea } from "@radix-ui/themes";
import { Header } from "../../components/Header/Header";
import * as Icon from "@phosphor-icons/react";

interface LocationState {
    participant: IParticipant;
}

const EvaluateAutobiography = () => {
    const location = useLocation();

    const { participant } = location.state as LocationState;

    return (

        <Flex direction="column" className={`relative ml-2  border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] `}>
            <Header title={` Avaliar atobiografia`} children={`Nome: ${participant.personalData.fullName}`} icon={<Icon.Books size={24}></Icon.Books>}></Header>
            <Section className="h-screen">
                <p>Indicadores de Superdotação: {participant.adultForm?.giftednessIndicators}</p>
                <TextArea className="h-full m-2">{participant.autobiography?.text}</TextArea>

            </Section>
        </Flex>
    );
};

export default EvaluateAutobiography;
