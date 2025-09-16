import React from 'react';
import {
  DataList,
  Separator,
  Flex,
  IconButton,
  Tooltip,
  Checkbox,
  Text,
  Dialog,
  TextField,
  Box,
  Badge,
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { ISample } from '../../interfaces/sample.interface';
import ActionButtonExplain from '../../components/ActionButtonExplain/ActionButtonExplain';
import SkeletonDataList from '../../components/Skeletons/SkeletonDataList';
import { Button } from '../Button/Button';
import Modal from '../Modal/Modal';
import Select from 'react-select';

interface MobileDataListViewProps {
  sample: ISample;
  loading: boolean;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  isChecked: boolean[];
  openModalIAH: boolean;
  setOpenModalIAH: (open: boolean) => void;
  openModalKAG: boolean;
  setOpenModalKAG: (open: boolean) => void;
  openModalKAE: boolean;
  setOpenModalKAE: (open: boolean) => void;
  selectedOption: string | null;
  handleChange: (index: number) => void;
  filterParticipants: (participant: IParticipant) => boolean;
  expandedParticipants: Record<string, boolean>;
  setExpandedParticipants: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getFirstAndLastName: (fullName: string) => string;
  getFormattedBirthDate: (birthDate: Date | string | undefined) => string;
  handleCompareSource: (participant: IParticipant) => void;
  handleShowIAH: (participantId: string) => void;
  handleShowKAG: (participantId: string) => void;
  handleShowKAE: (participantId: string) => void;
  handleSaveGift: () => void;
  handleChangeKA: (selectedOptions: any) => void;
  handleSubmitKA: (type: string) => Promise<void>;
  selectItensKA: { label: string; value: string }[];
  isSavingItem: boolean;
  isCheckedAll: boolean;
  handleCheckAll: () => void;
  handleCheckboxChange: (option: string | null) => void;
  selectedItems: { value: string }[];
  handleEvaluateAutobiography: (participant: IParticipant, sample: ISample) => void;
}

const MobileDataListView: React.FC<MobileDataListViewProps> = ({
  sample,
  loading,
  currentPage,
  startIndex,
  endIndex,
  isChecked,
  handleChange,
  filterParticipants,
  expandedParticipants,
  setExpandedParticipants,
  getFirstAndLastName,
  handleCompareSource,
  handleEvaluateAutobiography,
  getFormattedBirthDate,
  handleShowIAH,
  handleShowKAG,
  handleShowKAE,
  handleSaveGift,
  handleChangeKA,
  handleSubmitKA,
  openModalIAH,
  setOpenModalIAH,
  openModalKAG,
  setOpenModalKAG,
  openModalKAE,
  setOpenModalKAE,
  selectedOption,
  selectItensKA,
  isSavingItem,
  isCheckedAll,
  handleCheckAll,
  handleCheckboxChange,
  selectedItems,


}) => {
  return (
    <div className="mobo">
      <DataList.Root orientation="vertical" className="!font-roboto">
        {loading ? (
          <SkeletonDataList itens={3} titles={1} columns={3} actionButton={true} />
        ) : (
          (() => {
            const filteredParticipants = sample.participants
              ?.slice(startIndex, endIndex)
              .filter(filterParticipants);

            return filteredParticipants?.map((participant, idx) => {
              const isExpanded = participant._id ? expandedParticipants[participant._id] : false;
              const isSelected = isChecked[startIndex + idx];
              const participantId = String(participant._id) ?? '';

              return (
                <DataList.Item
                  key={startIndex + idx}
                  className={`w-full p-3 card-container rounded-lg mb-5 border-2 border-[#baa7ff] bg-[#f9f6ffcc] transition-all duration-300 ease-in-out 
                    ${isSelected ? '!bg-violet-100 !border-primary' : ''} 
                    ${isExpanded ? 'max-h-[1100px]' : 'max-h-[300px]'}`}
                // onClick={() => handleChange(startIndex + idx)}
                >
                  {/* Informações Básicas */}
                  <p className="text-[16px] font-bold text-center border-b-black">
                    Informações do participante
                  </p>

                  <DataList.Label>Nome:</DataList.Label>
                  <DataList.Value>{getFirstAndLastName(participant.personalData.fullName)}</DataList.Value>
                  <Separator size="4" />

                  <DataList.Label>Pontuação do questionário:</DataList.Label>
                  <DataList.Value>{participant.adultForm?.totalPunctuation}</DataList.Value>
                  <Separator size="4" />

                  <DataList.Label>Quantidade de 2ªs Fontes:</DataList.Label>
                  <DataList.Value>{participant.secondSources?.length}</DataList.Value>
                  <Separator size="4" className="mb-2" />

                  {isExpanded && (
                    <>
                      <p className="text-[16px] font-bold text-center">Indicadores de AH/SD:</p>

                      <DataList.Label className='mt-2 !items-center'>Pelo Questionário: <Badge size={"3"} className='ml-2 !px2' color={participant.adultForm?.giftednessIndicators ? "green" : "red"}>{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Badge> </DataList.Label>
                      <Separator size="4" className='mt-2' />
                      <DataList.Label className='mt-1 !items-center'>Pelo Pesquisador: <Badge size={"3"} className='ml-2 !px2' color={participant.giftdnessIndicatorsByResearcher ? "green" : "red"}>{participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}</Badge> </DataList.Label>
                      <DataList.Value className="justify-center">
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
                        <Button
                          onClick={() => participant._id && handleShowIAH(participant._id)} title={'Editar Indicador de AH/SD'}
                          color='white'
                          className='w-full  my-2'
                        >
                          <Icon.Pencil size={15} />
                        </Button>
                      </DataList.Value>
                      <Separator size="4" className="my-2" />

                      <p className="text-[16px] font-bold text-center">Áreas do saber:</p>
                      <Flex direction="column" gap="2">
                        <DataList.Label>Indicadas pelo Questionário:</DataList.Label>
                        <DataList.Value className="gap-[1px] flex-wrap">
                          {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                            <span className='bg-violet-100 p-1 border border-violet-500 rounded-sm mr-1' key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
                        </DataList.Value>
                        <Separator size="4" className="my-2" />

                        <DataList.Label>Indicadas pelo Pesquisador:</DataList.Label>
                        <DataList.Label>Áreas Gerais:</DataList.Label>
                        <DataList.Value className="flex-wrap">
                          {participant.knowledgeAreasIndicatedByResearcher?.general?.map((area, index) => (
                            <span className='bg-violet-100 p-1 border border-violet-500 rounded-sm mr-1' key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
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

                          <Button
                            onClick={() => participant._id && handleShowKAG(participant._id)} title={'Editar Áreas Gerais'}
                            color='white'
                            className='w-full my-1'
                          >
                            <Icon.Pencil size={15} />
                          </Button>
                        </DataList.Value>
                        <Separator size="4" />

                        <DataList.Label>Áreas Específicas:</DataList.Label>
                        <DataList.Value className="flex-wrap">
                          {participant.knowledgeAreasIndicatedByResearcher?.specific?.map((area, index) => (
                            <span className='bg-violet-100 p-1 border border-violet-500 rounded-sm mr-1' key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
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
                          <Button

                            onClick={() => participant._id && handleShowKAE(participant._id)} title={'Editar Áreas Específicas'}
                            color='white'
                            className='w-full my-1'
                          >
                            <Icon.Pencil size={15} />
                          </Button>
                        </DataList.Value>
                        <Separator size="4" />
                      </Flex>

                      {/* Ações */}
                      <Flex gap="2" direction="row" align="center" className="mt-2 mb-0">
                        <p className="text-[16px] font-bold text-center">Ações </p>
                        <ActionButtonExplain />
                      </Flex>

                      <Flex gap="2" direction="column" align="center" className="mt-2 mb-0">

                        <Dialog.Root>
                          <Dialog.Trigger className='w-full'>
                            <Box>
                              <Tooltip content="Visualizar Informações completas do Participante">
                                <Button
                                  color="yellow"
                                  className="w-full" title={'Info Participante'}                                  >
                                  <Icon.IdentificationCard size={24} />
                                </Button>
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

                        <Tooltip content="Comparar 2ª fontes">
                          <Button
                            className='w-full'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCompareSource(participant);
                            }} title={'Comparar 2ª fontes'}                            >
                            <Icon.ClipboardText size={24} />
                          </Button>
                        </Tooltip>

                        <Tooltip content="Autobiografia">
                          <Button
                            className='w-full'
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEvaluateAutobiography(participant, sample);
                            }} title={'Autobiografia'}                          >
                            <Icon.IdentificationBadge size={24} />
                          </Button>
                        </Tooltip>
                      </Flex>
                      <Separator size="4" className="my-2" />
                    </>
                  )}

                  <DataList.Label className="justify-end">
                    <Flex direction="row" justify="center" gap="2" align="center" className="mb-0">
                      <p className="text-[12px] font-bold text-center">
                        {isSelected ? "Desmarcar" : "Selecionar"} participante
                      </p>
                      <Checkbox
                        className="hover:cursor-pointer justify-end"
                        checked={isSelected ?? false}
                        onCheckedChange={() => handleChange(startIndex + idx)}
                        color="violet"
                      />
                    </Flex>
                  </DataList.Label>

                  <button
                    className="justify-end items-center leading-none flex gap-2 mt-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedParticipants(prev => ({
                        ...prev,
                        [participantId]: !prev[participantId]
                      }));
                    }}
                  >
                    {isExpanded ? "Veja menos" : "Ver mais"}
                    <Icon.CaretDown
                      size={15}
                      className={`transition-all duration-300 ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </DataList.Item>
              );
            });
          })()
        )}
      </DataList.Root>
    </div>
  );
};

export default MobileDataListView;