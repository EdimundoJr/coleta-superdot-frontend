import React from 'react';
import {
  DataList,
  Separator,
  Flex,
  IconButton,
  Tooltip,
  Checkbox,
  Text
} from '@radix-ui/themes';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { ISample } from '../../interfaces/sample.interface';
import ActionButtonExplain from '../../components/ActionButtonExplain/ActionButtonExplain';
import SkeletonDataList from '../../components/Skeletons/SkeletonDataList';

interface MobileDataListViewProps {
  sample: ISample;
  loading: boolean;
  currentPage: number;
  startIndex: number;
  endIndex: number;
  isChecked: boolean[];
  handleChange: (index: number) => void;
  filterParticipants: (participant: IParticipant) => boolean;
  expandedParticipants: Record<string, boolean>;
  setExpandedParticipants: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  getFirstAndLastName: (fullName: string) => string;
  handleCompareSource: (participant: IParticipant) => void;
  handleEvaluateAutobiography: (participant: IParticipant, sample: ISample) => void;
  handleShowIAH: (participantId: string) => void;
  handleShowKAG: (participantId: string) => void;
  handleShowKAE: (participantId: string) => void;
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
  handleShowIAH,
  handleShowKAG,
  handleShowKAE
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
                    ${isExpanded ? 'max-h-[1000px]' : 'max-h-[300px]'}`}
                  onClick={() => handleChange(startIndex + idx)}
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
                      <DataList.Label>Pelo Questionário:</DataList.Label>
                      <DataList.Value className="gap-2">
                        {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                      </DataList.Value>
                      <Separator size="4" />

                      <DataList.Label>Pelo Pesquisador:</DataList.Label>
                      <DataList.Value className="gap-2">
                        {participant.giftdnessIndicatorsByResearcher ? "Sim" : "Não"}
                        <IconButton
                          size="1"
                          variant="surface"
                          radius="full"
                          className="ml-2"
                          onClick={() => participant._id && handleShowIAH(participant._id)}
                        >
                          <Icon.Pencil size={15} />
                        </IconButton>
                      </DataList.Value>
                      <Separator size="4" className="my-2" />

                      <p className="text-[16px] font-bold text-center">Áreas do saber:</p>
                      <Flex direction="column" gap="2">
                        <DataList.Label>Indicadas pelo Questionário:</DataList.Label>
                        <DataList.Value className="gap-[1px] flex-wrap">
                          {participant.adultForm?.knowledgeAreas?.map((area, index) => (
                            <span key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
                        </DataList.Value>
                        <Separator size="4" className="my-2" />

                        <DataList.Label>Indicadas pelo Pesquisador:</DataList.Label>
                        <DataList.Label>Áreas Gerais</DataList.Label>
                        <DataList.Value className="gap-2 flex-wrap">
                          {participant.knowledgeAreasIndicatedByResearcher?.general?.map((area, index) => (
                            <span key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
                          <IconButton
                            size="1"
                            variant="surface"
                            radius="full"
                            onClick={() => participant._id && handleShowKAG(participant._id)}
                          >
                            <Icon.Pencil size={15} />
                          </IconButton>
                        </DataList.Value>
                        <Separator size="4" />

                        <DataList.Label>Áreas Específicas</DataList.Label>
                        <DataList.Value className="gap-2">
                          {participant.knowledgeAreasIndicatedByResearcher?.specific?.map((area, index) => (
                            <span key={index}>
                              {area}
                              {index !== (participant.adultForm?.knowledgeAreas?.length ?? 0) - 1 && ",\u00A0"}
                            </span>
                          ))}
                          <IconButton
                            size="1"
                            variant="surface"
                            radius="full"
                            onClick={() => participant._id && handleShowKAE(participant._id)}
                          >
                            <Icon.Pencil size={15} />
                          </IconButton>
                        </DataList.Value>
                        <Separator size="4" />
                      </Flex>

                      {/* Ações */}
                      <Flex gap="2" direction="row" align="center" className="mt-2 mb-0">
                        <p className="text-[16px] font-bold text-center">Ações </p>
                        <ActionButtonExplain />
                        <Flex align="center" gap="3" className="!justify-end w-full">
                          <Tooltip content="Informações completas">
                            <IconButton
                              variant="outline"
                              color="lime"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompareSource(participant);
                              }}
                            >
                              <Icon.IdentificationCard size={20} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="Comparar fontes">
                            <IconButton
                              variant="outline"
                              color="cyan"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCompareSource(participant);
                              }}
                            >
                              <Icon.ClipboardText size={20} />
                            </IconButton>
                          </Tooltip>

                          <Tooltip content="Autobiografia">
                            <IconButton
                              variant="outline"
                              color="bronze"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEvaluateAutobiography(participant, sample);
                              }}
                            >
                              <Icon.IdentificationBadge size={20} />
                            </IconButton>
                          </Tooltip>
                        </Flex>
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