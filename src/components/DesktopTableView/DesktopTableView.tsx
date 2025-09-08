import React from 'react';
import {
  Table,
  Checkbox,
  Flex,
  Text,
  IconButton,
  Tooltip,
  HoverCard,
  Dialog,
  Box,
  TextField,
  AlertDialog,
  Strong
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from "../../interfaces/participant.interface";
import { ISample } from "../../interfaces/sample.interface";
import ActionButtonExplain from '../../components/ActionButtonExplain/ActionButtonExplain';
import SkeletonTableBody from '../../components/Skeletons/SkeletonTableBody';
import Modal from '../../components/Modal/Modal';
import { Button } from '../../components/Button/Button';
import EmptyState from '../../components/EmptyState/EmptyState';
import Select from 'react-select';

interface DesktopTableViewProps {
  sample: ISample;
  loading: boolean;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  isChecked: boolean[];
  isCheckedAll: boolean;
  handleCheckAll: () => void;
  handleChange: (index: number) => void;
  filterParticipants: (participant: IParticipant) => boolean;
  openModalIAH: boolean;
  setOpenModalIAH: (open: boolean) => void;
  openModalKAG: boolean;
  setOpenModalKAG: (open: boolean) => void;
  openModalKAE: boolean;
  setOpenModalKAE: (open: boolean) => void;
  selectedOption: string | null;
  handleCheckboxChange: (option: string | null) => void;
  isSavingItem: boolean;
  handleSaveGift: () => void;
  handleChangeKA: (selectedOptions: any) => void;
  handleSubmitKA: (type: string) => Promise<void>;
  selectedItems: { value: string }[];
  getFirstAndLastName: (fullName: string) => string;
  getFormattedBirthDate: (birthDate: Date | string | undefined) => string;
  handleCompareSource: (participant: IParticipant) => void;
  handleEvaluateAutobiography: (participant: IParticipant, sample: ISample) => void;
  handleShowIAH: (participantId: string) => void;
  handleShowKAG: (participantId: string) => void;
  handleShowKAE: (participantId: string) => void;
  selectItensKA: { label: string; value: string }[];
}

const DesktopTableView: React.FC<DesktopTableViewProps> = ({
  sample,
  loading,
  currentPage,
  startIndex,
  endIndex,
  isChecked,
  isCheckedAll,
  handleCheckAll,
  handleChange,
  filterParticipants,
  openModalIAH,
  setOpenModalIAH,
  openModalKAG,
  setOpenModalKAG,
  openModalKAE,
  setOpenModalKAE,
  selectedOption,
  handleCheckboxChange,
  isSavingItem,
  handleSaveGift,
  handleChangeKA,
  handleSubmitKA,
  selectedItems,
  getFirstAndLastName,
  getFormattedBirthDate,
  handleCompareSource,
  handleEvaluateAutobiography,
  handleShowIAH,
  handleShowKAG,
  handleShowKAE,
  selectItensKA
}) => {
  return (
    <Table.Root variant="surface" className="desktop card-container">
      <Table.Header className="text-[14px] bg-violet-200">
        <Table.Row>
          <Table.ColumnHeaderCell colSpan={4} className="border-l border-none" align="center">
            Informações do participante
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="border-l" align="center">
            Indicadores de AH/SD
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={3} className="border-l" align="center">
            Áreas do saber
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l"></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Header className="text-[14px] bg-violet-200">
        <Table.Row>
          <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r">
            {isCheckedAll ? "Desmarcar Todos" : "Selecionar Todos"}
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={3} className="border-r"></Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="border-r text-center">
            De acordo com o:
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={1} className="border-r text-center">
            Indicadas pelo avaliado
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={2} className="text-center border-r">
            Indicadas pelo pesquisador
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell colSpan={1}></Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      <Table.Header className="text-[14px] bg-violet-200">
        <Table.Row align="center" className="text-center">
          <Table.ColumnHeaderCell colSpan={1}>
            <Checkbox
              className="hover:cursor-pointer"
              onClick={handleCheckAll}
              color="violet"
            />
          </Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Nome do Avaliado</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Pontuação</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Quant. 2ªs fontes</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Pesquisador</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Questionário</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Áreas gerais</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">Áreas específicas</Table.ColumnHeaderCell>
          <Table.ColumnHeaderCell className="border-l">
            <Flex gap="3" align="center" justify="center">
              <Text>Ações</Text>
              <ActionButtonExplain />
            </Flex>
          </Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>

      {loading ? (
        <SkeletonTableBody itens={5} columns={10} />
      ) : (
        <Table.Body className="text-[14px]">
          {(() => {
            const filteredParticipants = sample.participants
              ?.slice(startIndex, endIndex)
              .filter(filterParticipants);

            if (filteredParticipants?.length === 0) {
              return (
                <Table.Row align="center">
                  <Table.Cell colSpan={10} justify="center">
                    Nenhum participante encontrado
                  </Table.Cell>
                </Table.Row>
              );
            }

            return filteredParticipants?.map((participant, idx) => (
              <Table.Row
                align="center"
                className={isChecked[startIndex + idx] ? 'bg-violet-50' : ''}
                key={startIndex + idx}
              >
                <Table.Cell justify="center">
                  <Checkbox
                    className="hover:cursor-pointer"
                    checked={isChecked[startIndex + idx] ?? false}
                    onCheckedChange={() => handleChange(startIndex + idx)}
                    color="violet"
                  />
                </Table.Cell>

                <Table.Cell justify="center">
                  {getFirstAndLastName(participant.personalData.fullName)}
                </Table.Cell>

                <Table.Cell justify="center">
                  {participant.adultForm?.totalPunctuation}
                </Table.Cell>

                <Table.Cell justify="center">
                  {participant.secondSources?.length}
                </Table.Cell>

                <Table.Cell justify="center">
                  {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                </Table.Cell>

                <Table.Cell justify="center">
                  <Modal
                    open={openModalIAH}
                    setOpen={setOpenModalIAH}
                    title="Indicadores de AH/SD"
                    accessibleDescription="Essa área é destinada a identificar se a pessoa apresenta características de Altas Habilidades/Superdotação (AH/SD), com base nos critérios estabelecidos pelo pesquisador."
                  >
                    <Flex direction="column" gap="2">
                      <Flex align="center" gap="2" className="text-[20px]">
                        <Checkbox
                          checked={selectedOption === "sim"}
                          onCheckedChange={() => handleCheckboxChange("sim")}
                          className="hover:cursor-pointer"
                        />
                        Sim
                      </Flex>
                      <Flex align="center" gap="2" className="text-[20px]">
                        <Checkbox
                          checked={selectedOption === "nao"}
                          onCheckedChange={() => handleCheckboxChange("nao")}
                          className="hover:cursor-pointer"
                        />
                        Não
                      </Flex>
                    </Flex>
                    <Flex align="center" justify="center" className="gap-4">
                      <Button
                        loading={isSavingItem}
                        title="Salvar alterações"
                        color="green"
                        size="Medium"
                        className="mt-5"
                        onClick={handleSaveGift}
                        disabled={isSavingItem}
                      >
                        <Icon.FloppyDisk size={18} weight="bold" />
                      </Button>
                    </Flex>
                  </Modal>
                  <Flex direction="row" align="center" justify="center" gap="4">
                    {participant.giftdnessIndicatorsByResearcher ? 'Sim' : "Não"}
                    <IconButton
                      size="1"
                      variant="surface"
                      radius="full"
                      onClick={() => participant._id && handleShowIAH(participant._id)}
                    >
                      <Icon.Pencil className="cursor-pointer" />
                    </IconButton>
                  </Flex>
                </Table.Cell>

                <Table.Cell justify="center">
                  <Flex align="center" direction="row" justify="center" className="mb-0">
                    <Text as="label" className="pr-3">
                      {participant.adultForm?.knowledgeAreas?.[0]}
                      {'...'}
                    </Text>
                    <HoverCard.Root>
                      <HoverCard.Trigger>
                        <IconButton size="1" variant="surface" radius="full">
                          <Icon.Eye size={15} className="hover:cursor-pointer" />
                        </IconButton>
                      </HoverCard.Trigger>
                      <HoverCard.Content size="3">
                        <Text as="div" size="3" trim="both">
                          {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                            <span key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ", "}
                            </span>
                          ))}
                        </Text>
                      </HoverCard.Content>
                    </HoverCard.Root>
                  </Flex>
                </Table.Cell>

                <Table.Cell justify="center">
                  <Modal
                    open={openModalKAG}
                    setOpen={setOpenModalKAG}
                    title="Selecione as Áreas Gerais:"
                    accessibleDescription="Essas áreas gerais são utilizadas para compreender as habilidades e talentos amplos de um indivíduo, com o objetivo de fornecer suporte e orientação adequada, identificando o potencial de desenvolvimento em diversas dimensões da vida pessoal e acadêmica."
                  >
                    <Select
                      isMulti
                      aria-hidden="false"
                      options={selectItensKA.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      className="text-black"
                      placeholder="Selecione uma ou várias opções"
                      menuPosition="fixed"
                      onChange={handleChangeKA}
                    />
                    <Flex align="center" justify="center" className="gap-4 mt-0">
                      <Button
                        loading={isSavingItem}
                        title="Salvar alterações"
                        color="green"
                        size="Medium"
                        className="mt-5"
                        onClick={() => handleSubmitKA("KAG")}
                        disabled={isSavingItem}
                      >
                        <Icon.FloppyDisk size={18} weight="bold" />
                      </Button>
                    </Flex>
                  </Modal>
                  <Flex align="center" direction="row" justify="center" className="gap-2">
                    <Text as="label" className="pr-3">
                      {participant.knowledgeAreasIndicatedByResearcher?.general[0]}
                      {'...'}
                    </Text>
                    <HoverCard.Root>
                      <HoverCard.Trigger>
                        <IconButton size="1" variant="surface" radius="full">
                          <Icon.Eye size={15} className="hover:cursor-pointer" />
                        </IconButton>
                      </HoverCard.Trigger>
                      <HoverCard.Content size="3">
                        <Text as="div" size="3" trim="both">
                          {participant.knowledgeAreasIndicatedByResearcher?.general.map((area, index) => (
                            <span key={index}>
                              {area}
                              {index !== (participant.knowledgeAreasIndicatedByResearcher?.general.length ?? 0) - 1 && ", "}
                            </span>
                          ))}
                        </Text>
                      </HoverCard.Content>
                    </HoverCard.Root>
                    <Tooltip content="Definir/Editar Áreas Gerais">
                      <IconButton
                        size="1"
                        variant="surface"
                        radius="full"
                        onClick={() => participant._id && handleShowKAG(participant._id)}
                      >
                        <Icon.Pencil className="cursor-pointer" />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </Table.Cell>

                <Table.Cell justify="center">
                  <Modal
                    open={openModalKAE}
                    setOpen={setOpenModalKAE}
                    title="Selecione as Áreas Específicas:"
                    accessibleDescription="Essas áreas específicas são utilizadas para identificar talentos excepcionais em diferentes campos, ajudando a orientar intervenções educacionais e sociais para promover o desenvolvimento e o reconhecimento de indivíduos com AH/SD."
                  >
                    <Select
                      isMulti
                      options={selectItensKA.map((item) => ({
                        value: item.value,
                        label: item.label,
                      }))}
                      className="text-black"
                      placeholder="Selecione uma ou várias opções"
                      menuPosition="fixed"
                      onChange={handleChangeKA}
                    />
                    <Flex align="center" justify="center" className="gap-4">
                      <Button
                        loading={isSavingItem}
                        title="Salvar alterações"
                        color="green"
                        size="Medium"
                        className="mt-5"
                        onClick={() => handleSubmitKA("KAE")}
                        disabled={isSavingItem}
                      >
                        <Icon.FloppyDisk size={18} weight="bold" />
                      </Button>
                    </Flex>
                  </Modal>
                  <Flex align="center" direction="row" justify="center" className="gap-2">
                    <Text as="label" className="pr-3">
                      {participant.knowledgeAreasIndicatedByResearcher?.specific[0]}
                      {'...'}
                    </Text>
                    <HoverCard.Root>
                      <HoverCard.Trigger>
                        <IconButton size="1" variant="surface" radius="full">
                          <Icon.Eye size={15} className="hover:cursor-pointer" />
                        </IconButton>
                      </HoverCard.Trigger>
                      <HoverCard.Content size="3">
                        <Text as="div" size="3" trim="both">
                          {participant.knowledgeAreasIndicatedByResearcher?.specific.map((area, index) => (
                            <span key={index}>
                              {area}
                              {index !== (participant.knowledgeAreasIndicatedByResearcher?.specific.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
                        </Text>
                      </HoverCard.Content>
                    </HoverCard.Root>
                    <Tooltip content="Definir/Editar Áreas Específicas">
                      <IconButton
                        size="1"
                        variant="surface"
                        radius="full"
                        onClick={() => participant._id && handleShowKAE(participant._id)}
                      >
                        <Icon.Pencil className="cursor-pointer" />
                      </IconButton>
                    </Tooltip>
                  </Flex>
                </Table.Cell>

                <Table.Cell justify="center">
                  <Flex justify="center" align="center" className="gap-4">
                    <Dialog.Root>
                      <Dialog.Trigger>
                        <Box>
                          <Tooltip content="Visualizar Informações completas do Participante">
                            <IconButton
                              size="2"
                              color="lime"
                              radius="full"
                              variant="outline"
                              className="hover:cursor-pointer hover:translate-y-[3px] transition-all ease-in-out"
                            >
                              <Icon.IdentificationCard size={20} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Dialog.Trigger>
                      <Dialog.Content style={{ maxWidth: 450 }}>
                        <Dialog.Title align="center" mb="5">
                          Informações Gerais do Participante
                        </Dialog.Title>
                        <Flex direction="column" gap="3">
                          <Text as="label" size="2" mb="1" weight="bold">
                            Nome Completo
                            <TextField.Root
                              defaultValue={participant.personalData.fullName}
                              disabled
                            />
                          </Text>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Data de Nascimento
                            <TextField.Root
                              defaultValue={getFormattedBirthDate(participant.personalData.birthDate)}
                              disabled
                            />
                          </Text>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Gênero
                            <TextField.Root
                              defaultValue={participant.personalData.gender}
                              disabled
                            />
                          </Text>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Telefone
                            <TextField.Root
                              defaultValue={participant.personalData.phone}
                              disabled
                            />
                          </Text>
                          <Text as="label" size="2" mb="1" weight="bold">
                            E-mail
                            <TextField.Root
                              defaultValue={participant.personalData.email}
                              disabled
                            />
                          </Text>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Estado Civil
                            <TextField.Root
                              defaultValue={participant.personalData.maritalStatus}
                              disabled
                            />
                          </Text>
                          <Text as="label" size="2" mb="1" weight="bold">
                            Trabalho
                            <TextField.Root
                              defaultValue={participant.personalData.job}
                              disabled
                            />
                          </Text>
                        </Flex>
                        <Flex gap="3" mt="4" justify="end">
                          <Dialog.Close>
                            <Button
                              color="red"
                              className="w-[100px]"
                              title="Fechar"
                              size="Extra Small"
                            />
                          </Dialog.Close>
                        </Flex>
                      </Dialog.Content>
                    </Dialog.Root>

                    <AlertDialog.Root>
                      <AlertDialog.Trigger>
                        <Box
                          className="flex gap-3"
                          onClick={() => handleCompareSource(participant)}
                        >
                          <Tooltip content="Comparar as respostas do avaliado com as respostas das 2ª fontes">
                            <IconButton
                              color="cyan"
                              radius="full"
                              variant="outline"
                              className="hover:cursor-pointer hover:translate-y-[3px] transition-all ease-in-out"
                            >
                              <Icon.ClipboardText size={20} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </AlertDialog.Trigger>
                      <AlertDialog.Content>
                        <EmptyState
                          icon={<Icon.Users size={40} />}
                          title="Aguardando resposta da 2ª fonte."
                          description="A comparação só será exibida após a 2ª fonte concluir o questionário. Assim que a resposta for registrada, você poderá visualizar as diferenças e semelhanças entre as percepções."
                        />
                        <Flex gap="3" mt="4" justify="end">
                          <AlertDialog.Cancel className="absolute top-2 right-2">
                            <Button
                              className="hover:cursor-pointer"
                              aria-label="Close modal"
                              title=""
                              color="red"
                              size="Small"
                            >
                              <Icon.X size={20} weight="bold" />
                            </Button>
                          </AlertDialog.Cancel>
                        </Flex>
                      </AlertDialog.Content>
                    </AlertDialog.Root>

                    <Box
                      className="flex gap-3"
                      onClick={() => handleEvaluateAutobiography(participant, sample)}
                    >
                      <Tooltip content="Visualizar Autobiografia do participante">
                        <IconButton
                          color="bronze"
                          radius="full"
                          variant="outline"
                          className="hover:cursor-pointer hover:translate-y-[3px] transition-all ease-in-out"
                        >
                          <Icon.IdentificationBadge size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Flex>
                </Table.Cell>
              </Table.Row>
            ));
          })()}
        </Table.Body>
      )}
    </Table.Root>
  );
};

export default DesktopTableView;