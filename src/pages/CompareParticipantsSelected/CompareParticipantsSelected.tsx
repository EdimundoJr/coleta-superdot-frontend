import { Box, Container, Flex } from "@radix-ui/themes"
import { useLocation } from "react-router-dom";
import { IParticipant } from "../../interfaces/participant.interface";
import { Header } from "../../components/Header/Header";
import * as  Icon from "@phosphor-icons/react";

interface LocationState {
  selectedParticipants: IParticipant[];
}

const CompareParticipantsSelected = () => {

  const location = useLocation();
  const state = location.state as LocationState;
  const { selectedParticipants } = state || { selectedParticipants: [] };

  return (
    <Flex direction="column" className={`relative ml-2  border-t-4 border-primary rounded-tl-[30px]  w-full bg-[#fbfaff] `}>
      <Header title="Comparação dos Participantes Selecionados" icon={<Icon.Books size={24}></Icon.Books>}></Header>
      <Container>
        <Box className="mt-20">
          <div>
            
              <div>
                <h2>Participantes Selecionados:</h2>
                <ul>
                  {selectedParticipants.map((participant, index) => (
                    <li key={index}>
                      <strong>Nome:</strong> {participant.personalData.fullName}, <strong>Pontuação:</strong> {participant.adultForm?.totalPunctuation}

                    </li>
                  ))}
                </ul>
              </div>
            
           
          </div>
        </Box>
      </Container>
    </Flex>
  );
};

export default CompareParticipantsSelected;