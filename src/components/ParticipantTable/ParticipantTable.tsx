import { motion, AnimatePresence } from "framer-motion";
import { IParticipant } from "../../interfaces/participant.interface";
import * as Icon from "@phosphor-icons/react";
import { AlertDialog, Box, Flex, IconButton, Strong, Table, Tooltip, Text, Checkbox } from "@radix-ui/themes";
import { Button } from "../Button/Button";
import Modal from "../Modal/Modal";
// Importe todos os componentes necessários (Modal, HoverCard, etc.)

type ParticipantTableProps = {
  participants: IParticipant[];
  isCheckedAll: boolean;
  isChecked: boolean[];
  startIndex: number;
  endIndex: number;
  onCheckAll: () => void;
  onCheck: (index: number) => void;
  onShowIAH: (participantId: string) => void;
  onShowKAG: (participantId: string) => void;
  onShowKAE: (participantId: string) => void;
  openModalIAH: boolean;
  openModalKAG: boolean;
  openModalKAE: boolean;
  selectedOption: string | null;
  isSavingGift: boolean;
  onSaveGift: () => void;
  handleChangeKA: (selectedOptions: any) => void;
  selectedItems: { value: string }[];
  selectItensKA: Array<{ label: string; value: string }>;
};

export const ParticipantTable = ({
  participants,
  isCheckedAll,
  isChecked,
  startIndex,
  endIndex,
  onCheckAll,
  onCheck,
  onShowIAH,
  onShowKAG,
  onShowKAE,
  openModalIAH,
  openModalKAG,
  openModalKAE,
  selectedOption,
  isSavingGift,
  onSaveGift,
  handleChangeKA,
  selectedItems,
  selectItensKA
}: ParticipantTableProps) => {
  return (
    <Table.Root variant="surface" className="desktop card-container">
      {/* Cabeçalho da Tabela (mantenha igual ao original) */}
      <Table.Header className="text-[14px]">
        <Table.Row className="bg-red" >
          <Table.ColumnHeaderCell colSpan={4} className="border-l border-none" align="center">Informações do participante</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="border-l" align="center">Indicadores de AH/SD</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={3} className="border-l" align="center">Áreas do saber</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l"></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Header className="text-[14px] ">
        <Table.Row>
          <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r" >
            {isCheckedAll ? "Desmarcar Todos" : "Selecionar Todos "}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={3} className="border-r" ></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="border-r text-center" >De acordo com o :</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={1} className="border-r text-center" >Indicadas pelo avaliado</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="text-center  border-r ">Indicadas pelo pesquisador</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={1} ></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Header className="text-[14px] ">
        <Table.Row align={"center"} className="text-center">
          <Table.ColumnHeaderCell colSpan={1}  >
            <Checkbox className="hover:cursor-pointer" onClick={handleCheckAll} color="violet" />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l "> Nome do Avaliado </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l ">Pontuação</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l ">Quant. 2ªs fontes</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Pesquisador</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Áreas gerais</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Áreas específicas</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">
            <Flex gap="3" align="center" justify="center">
              <Text>Ações</Text>
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Box>
                    <Tooltip content={"Visualizar Ações"}>
                      <IconButton size="1" variant="surface" radius="full" className="hover:cursor-pointer">
                        <Icon.QuestionMark size={15} />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </AlertDialog.Trigger>
                <AlertDialog.Content>
                  <AlertDialog.Title className="mb-3">Tipos de Ação:</AlertDialog.Title>
                  <AlertDialog.Description className="flex gap-2 mb-2">
                    <Tooltip content="Visualizar Informações completas do Participante">
                      <IconButton size="2" color="lime" radius="full" variant="outline" className="">
                        <Icon.IdentificationCard size={20} />
                      </IconButton>
                    </Tooltip>
                    <Text>
                      <Strong>
                        Visualizar Informações completas do Participante
                      </Strong>
                      <br></br>
                      Esta seção permite visualizar todas as informações detalhadas do participante, incluindo os dados pessoais. É uma ferramenta útil para ter acesso completo ao perfil do participante, facilitando a consulta e o acompanhamento de suas informações.
                    </Text>
                  </AlertDialog.Description>
                  <AlertDialog.Description className="flex gap-2 mb-2">
                    <IconButton color="cyan" radius="full" variant="outline" >
                      <Icon.ClipboardText size={20} />
                    </IconButton>
                    <Text>
                      <Strong>
                        Comparar as respostas do avaliado com as respostas das 2ª fontes
                      </Strong>
                      <br></br>
                      Esta funcionalidade permite comparar as respostas fornecidas pelo avaliado com aquelas provenientes das segunda fontes, facilitando a análise das divergências e semelhanças. É uma ferramenta útil para garantir a precisão e consistência das informações, ajudando na avaliação mais completa do participante..
                    </Text>
                  </AlertDialog.Description>
                  <AlertDialog.Description className="flex gap-2">
                    <IconButton color="bronze" radius="full" variant="outline" >
                      <Icon.IdentificationBadge size={20} />
                    </IconButton>
                    <Text>
                      <Strong>
                        Visualizar Autobiografia
                      </Strong>
                      <br></br>
                      Esta opção permite acessar a autobiografia do participante, onde ele compartilha sua trajetória pessoal e experiências. É uma maneira de conhecer mais sobre sua história, valores e motivações, oferecendo um panorama completo de sua vida e visão.
                    </Text>
                  </AlertDialog.Description>
                  <AlertDialog.Action>
                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Button
                          color="red"
                          title={"Voltar"} size={""}
                        />
                      </AlertDialog.Cancel>
                    </Flex>
                  </AlertDialog.Action>
                </AlertDialog.Content>
              </AlertDialog.Root>
            </Flex>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      {/* Corpo da Tabela com Animações */}
      <Table.Body className="text-[14px]">
        <AnimatePresence>
          {participants.slice(startIndex, endIndex).map((participant, idx) => (
            <motion.tr
              key={participant._id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className={isChecked[startIndex + idx] ? 'bg-violet-100' : ''}
            >
              {/* Conteúdo das células */}
              <Table.Cell justify="center">
                <Checkbox
                  checked={isChecked[startIndex + idx]}
                  onCheckedChange={() => onCheck(startIndex + idx)}
                  color="violet"
                />
              </Table.Cell>


              <Table.Cell justify="center"> {participant.personalData.fullName}</Table.Cell>
              <Table.Cell justify="center" >{participant.adultForm?.totalPunctuation}</Table.Cell>
              <Table.Cell justify="center">{participant.secondSources?.length}</Table.Cell>
              <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>

              {/* Célula de Indicadores AH/SD */}
              <Table.Cell justify="center">
                <Flex direction="row" align="center" justify="center" gap="4">
                  {participant.giftdnessIndicatorsByResearcher ? 'Sim' : "Não"}
                  <IconButton
                    size="1"
                    variant="surface"
                    radius="full"
                    onClick={() => onShowIAH(participant._id!)}
                  >
                    <Icon.Pencil />
                  </IconButton>
                </Flex>

                {/* Modal de Indicadores */}
                <Modal
                  open={openModalIAH}
                  setOpen={(open) => !open && onShowIAH('')}
                  title="Indicadores de AH/SD" accessibleDescription={""}                >
                  {/* ... conteúdo do modal ... */}
                </Modal>
              </Table.Cell>

              {/* Repita para outras células com modais */}
            </motion.tr>
          ))}
        </AnimatePresence>
      </Table.Body>
    </Table.Root>
  );
};