import React, { useMemo } from 'react';
import { Box, Flex, Strong } from '@radix-ui/themes';
import * as Form from '@radix-ui/react-form';
import * as Icon from '@phosphor-icons/react';
import { InputField } from '../InputField/InputField';
import { SelectField } from '../SelectField/SelectField';
import { Button } from '../Button/Button';
import Modal from '../Modal/Modal';
import EmptyState from '../EmptyState/EmptyState';
import InstrumentResponsesTable from '../InstrumentResponsesTable/InstrumentResponsesTable';
import WordCloudGenerator from '../WordCloud/WordCloudGenerator';
import * as Switch from '@radix-ui/react-switch';

interface AnalysisHeaderAndFiltersProps {
  sample: any;
  isDesktop: boolean;
  showSearch: boolean;
  setShowSearch: (show: boolean) => void;
  showFilters: boolean;
  handleSubmit: any;
  onSubmit: (data: any) => void;
  register: any;
  clearFilters: () => void;
  selectItensKA: any[];
  selectItensPM: any[];
  openModalCompare: boolean;
  setOpenModalCompare: (open: boolean) => void;
  handleCompareSelected: () => void;
  openModal: boolean;
  setOpenModal: (open: boolean) => void;
  handleShowPunctuation: () => void;
  openModalCloud: boolean;
  setOpenModalCloud: (open: boolean) => void;
  CloudWord: any[];
  isCheckedWC: boolean[];
  handleChangeWC: (index: number) => void;
  cloudWords: () => void;
  showNewComponent: boolean;
  selectedParticipants: any[];
  handleShowCloud: () => void;
  getRangeForPercentage: (percentage: number) => any;
}

const AnalysisHeaderAndFilters: React.FC<AnalysisHeaderAndFiltersProps> = ({
  sample,
  isDesktop,
  showSearch,
  setShowSearch,
  showFilters,
  handleSubmit,
  onSubmit,
  register,
  clearFilters,
  selectItensKA,
  selectItensPM,
  openModalCompare,
  setOpenModalCompare,
  handleCompareSelected,
  openModal,
  setOpenModal,
  handleShowPunctuation,
  openModalCloud,
  setOpenModalCloud,
  CloudWord,
  isCheckedWC,
  handleChangeWC,
  cloudWords,
  showNewComponent,
  selectedParticipants,
  handleShowCloud,
  getRangeForPercentage
}) => {

  // Memoize os options para evitar re-renderizações
  const knowledgeAreaOptions = useMemo(() =>
    selectItensKA.map(option => (
      <option key={option.label} value={option.label}>
        {option.label}
      </option>
    )), [selectItensKA]);

  const punctuationOptions = useMemo(() =>
    selectItensPM.map(option => (
      <option key={option.value} value={option.value}>
        {option.label}
      </option>
    )), [selectItensPM]);

  // Handler para toggle de search
  const toggleSearch = () => setShowSearch(!showSearch);

  return (
    <>
      <header className="pt-8 pb-6 border-b border-gray-200 mb-8">
        <h2 className="heading-2 font-semibold text-gray-900">
          Análise de Participantes
        </h2>
        <p className="text-lg text-gray-600">
          Amostra: <Strong className="text-primary-600 !font-roboto">{sample?.sampleGroup}</Strong>
        </p>
      </header>

      <Box className="hidden lg:grid grid-cols-4 gap-4">
        <Form.Root
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center xl:flex-row xl:justify-between xl:p-0 pt-0 pb-1 gap-2"
        >
          {!isDesktop && (
            <Button
              type="button"
              onClick={toggleSearch}
              className="block xl:hidden"
              title={showSearch ? "Fechar Filtros" : "Mostrar Filtros"}
              color="primary"
              size="Medium"
            >
              {showSearch ? <Icon.X size={20} /> : <Icon.Funnel size={20} />}
            </Button>
          )}

          {/* Substituição do AnimatePresence por CSS transitions nativas */}
          <div
            className={`
              flex flex-col xl:flex-row xl:items-end gap-3 w-full 
              transition-all duration-300 ease-in-out overflow-hidden
              ${showFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
            `}
          >
            <Form.Submit asChild className="desktop xl:block">
              <Button
                size="Large"
                className="items-center w-full xl:w-[300px]"
                title="Filtrar"
                color="primary"
              >
                <Icon.Funnel size={20} color="white" />
              </Button>
            </Form.Submit>

            <InputField
              icon={<Icon.MagnifyingGlass />}
              placeholder="Pesquisar pelo nome do avaliado..."
              {...register("searchName")}
            />

            <Flex align="center" className="gap-2 flex-col xl:flex-row w-full xl:w-auto">
              <SelectField
                label="Área do Saber"
                {...register("knowledgeArea")}
                defaultValue="default"
                className="p-2 w-full xl:w-auto truncate"
              >
                <option value='default'>Selecionar</option>
                {knowledgeAreaOptions}
              </SelectField>

              <SelectField
                label="Pontuação Mínima"
                {...register("minPunctuation", { valueAsNumber: true })}
                className="w-full xl:w-auto truncate"
                defaultValue={99}
              >
                <option value={99} className="text-gray-99">Selecionar</option>
                {punctuationOptions}
              </SelectField>
            </Flex>

            <Form.Submit asChild className="desktop xl:mobo">
              <Button
                size="Large"
                className="items-center w-full xl:w-[300px]"
                title="Filtrar"
                color="primary"
              >
                <Icon.Funnel size={20} color="white" />
              </Button>
            </Form.Submit>

            <Button
              size="Large"
              onClick={clearFilters}
              type="button"
              className="items-center w-full xl:w-[300px]"
              color="primary"
              title="Limpar Filtro"
            />
          </div>
        </Form.Root>
      </Box>

      <Flex
        direction={isDesktop ? "row" : "column"}
        justify="between"
        className="gap-4 m-auto w-[90%] max-w-4xl mt-5 px-4"
      >
        <Modal
          open={openModalCompare}
          setOpen={setOpenModalCompare}
          title={""}
          accessibleDescription={""}
        >
          <EmptyState
            icon={<Icon.UserGear size={40} />}
            title="Você não selecionou nenhum participante."
            description="Para comparar as respostas entre os avaliados ou gerar a nuvem de palavras, você deve selecionar pelo menos um participante."
          />
        </Modal>

        <Button
          size="Medium"
          title={"Comparar Selecionados"}
          color={"primary"}
          onClick={handleCompareSelected}
          className="btn-primary"
        >
          <Icon.ChartBar size={20} color="white" weight="bold" />
        </Button>

        <Modal
          open={openModal}
          setOpen={setOpenModal}
          title={"Pontuação:"}
          accessibleDescription={""}
        >
          <InstrumentResponsesTable />
        </Modal>

        <Button
          size="Medium"
          onClick={handleShowPunctuation}
          title={"Pontuação do Questionário"}
          color={"primary"}
          className="btn-primary"
        >
          <Icon.Trophy size={20} color="white" weight="bold" />
        </Button>

        <Modal
          open={openModalCloud}
          setOpen={setOpenModalCloud}
          title={"Selecione as fontes de palavras:"}
          accessibleDescription={""}
        >
          <Flex justify={isDesktop ? "between" : "center"} direction={isDesktop ? "column" : "column"} className="gap-3 xl:pt-4 pb-4">
            {CloudWord.map((itens, index) => (
              <label key={index}>
                <Flex gap="2" className="card-container p-2" direction={isDesktop ? "row" : "row"}>
                  <Switch.Root
                    className="w-11 h-6 rounded-full relative data-[state=checked]:bg-primary bg-gray-300 transition-colors duration-200"
                    checked={isCheckedWC[index]}
                    onCheckedChange={() => handleChangeWC(index)}
                    value={itens.value}
                  >
                    <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
                  </Switch.Root>
                  {itens.title}
                </Flex>
              </label>
            ))}
          </Flex>
          <Flex justify="end">
            <Button
              onClick={cloudWords}
              className={showNewComponent ? 'hidden' : 'items-end'}
              color="green"
              title={"Confirmar"}
              size={"Medium"}
            />
          </Flex>
          {showNewComponent && (
            <>
              {CloudWord.map((item, index) => {
                if (isCheckedWC[index]) {
                  switch (item.value) {
                    case "RES-SUB":
                      return (
                        <Box key={index} className="xl:w-full m-auto">
                          <p className="text-lg font-bold text-center mb-4">
                            Respostas Subjetivas / Quantidade de Avaliados: {selectedParticipants.length}
                          </p>
                          <WordCloudGenerator
                            textBio={selectedParticipants.map((participant) => {
                              const combinedSubjective = [
                                ...Array.from({ length: 8 }, (_, i) =>
                                  participant.adultForm?.answersByGroup?.[0]?.questions[i]?.answer || []
                                ).flat(),
                                ...Array.from({ length: 5 }, (_, i) =>
                                  participant.adultForm?.answersByGroup?.[5]?.questions[i]?.answer || []
                                ).flat(),
                              ];
                              return combinedSubjective.join(', ') || '';
                            })}
                          />
                        </Box>
                      );
                    case "AUT-BIO":
                      return (
                        <Box key={index} className="xl:w-full m-auto">
                          <p className="text-lg font-bold text-center mb-4">
                            Autobiografia / Quantidade de Avaliados: {selectedParticipants.length}
                          </p>
                          <WordCloudGenerator
                            textBio={selectedParticipants.map((participant) => participant.autobiography?.text || '')}
                          />
                        </Box>
                      );
                    case "ARE-SAB":
                      return (
                        <Box key={index} className="xl:w-full m-auto">
                          <p className="text-lg font-bold text-center mb-4">
                            Áreas do Saber / Quantidade de Avaliados: {selectedParticipants.length}
                          </p>
                          <WordCloudGenerator
                            textBio={selectedParticipants.map((participant) => {
                              const combinedAreas = [
                                ...(participant.knowledgeAreasIndicatedByResearcher?.general || []),
                                ...(participant.knowledgeAreasIndicatedByResearcher?.specific || []),
                                ...(participant.adultForm?.knowledgeAreas || []),
                              ];
                              return combinedAreas.join(', ') || '';
                            })}
                          />
                        </Box>
                      );
                    default:
                      return (
                        <Box key={index}>
                          <p className="text-lg font-bold text-center mb-4">
                            Valor não reconhecido: {item.title}
                          </p>
                        </Box>
                      );
                  }
                }
                return null;
              })}
            </>
          )}
        </Modal>

        <Button
          size="Medium"
          onClick={handleShowCloud}
          title={"Gerar Nuvem de Palavras"}
          color={"primary"}
          className="btn-primary"
        >
          <Icon.Cloud size={20} color="white" weight="bold" />
        </Button>
      </Flex>
    </>
  );
};

export default React.memo(AnalysisHeaderAndFilters);