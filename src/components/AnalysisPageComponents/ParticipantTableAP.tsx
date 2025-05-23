import { Table, Flex, Text, IconButton, Tooltip } from "@radix-ui/themes";
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from "../../interfaces/participant.interface";

interface ParticipantTableProps {
  participants: IParticipant[];
  isDesktop: boolean;
  onSelectParticipant: (participant: IParticipant) => void;
}

export const ParticipantTable: React.FC<ParticipantTableProps> = ({
  participants,
  isDesktop,
  onSelectParticipant
}) => {
  return (
    <Table.Root variant="surface" className="card-container">
      <Table.Header>
        {/* Cabeçalhos da tabela */}
      </Table.Header>
      <Table.Body>
        {participants.map(participant => (
          <Table.Row key={participant._id} align="center">
            {/* Células da tabela */}
            <Table.Cell>
              <Flex align="center" gap="3">
                <Text>{participant.personalData.fullName}</Text>
                <Tooltip content="Ver detalhes">
                  <IconButton
                    size="1"
                    variant="ghost"
                    onClick={() => onSelectParticipant(participant)}
                  >
                    <Icon.Info size={16} />
                  </IconButton>
                </Tooltip>
              </Flex>
            </Table.Cell>
            {/* Outras células */}
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};