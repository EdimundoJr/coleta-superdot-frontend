import {
  Table,
  Checkbox,
  Flex,
  Text,
  IconButton,
  AlertDialog,
  Button,
  HoverCard,
  Dialog,
  Tooltip,
  Box,
} from "@radix-ui/themes";
import * as Icon from "@radix-ui/react-icons";
import { useState } from "react";
import Select from "react-select";
import Modal from "../Modal/Modal";

type Participant = {
  _id: string;
  personalData: {
    fullName: string;
    birthDate: string;
  };
};

type ParticipantsTableProps = {
  participants: Participant[];
  startIndex: number;
  endIndex: number;
};

const ParticipantsTable = ({
  participants,
  startIndex,
  endIndex,
}: ParticipantsTableProps) => {
  // Estados
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [isChecked, setIsChecked] = useState<boolean[]>([]);
  const [openModalIAH, setOpenModalIAH] = useState(false);
  const [openModalKAG, setOpenModalKAG] = useState(false);
  const [openModalKAE, setOpenModalKAE] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedKA, setSelectedKA] = useState<string[]>([]);
  const [editingParticipantId, setEditingParticipantId] = useState<string | null>(null);

  // Handlers
  const handleCheckAll = () => {
    setIsCheckedAll(!isCheckedAll);
    const newChecked = new Array(participants.length).fill(!isCheckedAll);
    setIsChecked(newChecked);
  };

  const handleChange = (index: number) => {
    const newChecked = [...isChecked];
    newChecked[index] = !newChecked[index];
    setIsChecked(newChecked);
  };

  // Funções auxiliares (implementar conforme necessidade)
  const getFirstAndLastName = (fullName: string) => fullName.split(" ")[0] + " " + fullName.split(" ").pop();
  const getFormattedBirthDate = (date: string) => new Date(date).toLocaleDateString();

  return (
    <Table.Root variant="surface" className="card-container">

      <Table.Header className="text-[14px]">
        <Table.Header className="text-[14px] ">
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


        <Table.Row align="center" className="text-center">
          <Table.ColumnHeaderCell colSpan={1}>
            <Checkbox className="hover:cursor-pointer" onClick={handleCheckAll} color="violet" />
          </Table.ColumnHeaderCell>
          {/* ... demais colunas */}
        </Table.Row>
      </Table.Header>

      {/* Corpo da Tabela */}
      <Table.Body className="text-[14px]">
        {sample.participants?.slice(startIndex, endIndex).filter(participant => participant.adultForm?.totalPunctuation !== undefined).map((participant, idx) => (

          <Table.Row align={"center"}

            className={isChecked[startIndex + idx] ? 'bg-violet-100' : ''}
            key={startIndex + idx}>
            <Table.Cell justify="center">
              <Checkbox
                className="hover:cursor-pointer"
                checked={isChecked[startIndex + idx] ?? false}
                onCheckedChange={() => handleChange(startIndex + idx)}
                color="violet" />
            </Table.Cell>
            <Table.Cell justify="center"> {getFirstAndLastName(participant.personalData.fullName)}</Table.Cell>
            <Table.Cell justify="center" >{participant.adultForm?.totalPunctuation}</Table.Cell>
            <Table.Cell justify="center">{participant.secondSources?.length}</Table.Cell>
            <Table.Cell justify="center">{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</Table.Cell>
            <Table.Cell justify="center">
              <Modal
                open={openModalIAH}
                setOpen={setOpenModalIAH}
                title={"Indicadores de AH/SD"}
                accessibleDescription={"Essa área é destinada a identificar se a pessoa apresenta características de Altas Habilidades/Superdotação (AH/SD), com base nos critérios estabelecidos pelo pesquisador."}>

                <Flex direction="column" gap="2">

                  <Flex align="center" gap="2" className="text-[20px]">
                    <Checkbox
                      checked={selectedOption === "sim"}
                      onCheckedChange={() => handleCheckboxChange("sim")}
                      className="hover:cursor-pointer"
                    >
                    </Checkbox>
                    Sim
                  </Flex>
                  <Flex align="center" gap="2" className="text-[20px]">
                    <Checkbox
                      checked={selectedOption === "nao"}
                      onCheckedChange={() => handleCheckboxChange("nao")}
                      className="hover:cursor-pointer"
                    >
                    </Checkbox>
                    Não
                  </Flex>
                </Flex>
                <Flex align="center" justify="center" className="gap-4">
                  <Button
                    title={isSavingGift ? "Salvando..." : "Salvar"}
                    color="green"
                    size="Medium"
                    className="mt-5"
                    onClick={handleSaveGift}
                    disabled={isSavingGift}
                  >
                  </Button>
                </Flex>
              </Modal>
              <Flex direction={"row"} align={"center"} justify={"center"} gap={"4"}>
                {participant.giftdnessIndicatorsByResearcher ? 'Sim' : "Não"}

                <IconButton size="1" variant="surface" radius="full" >
                  <Icon.Pencil

                    onClick={() => participant._id && handleShowIAH(participant._id)}
                    className="cursor-pointer"
                  />
                </IconButton>
              </Flex>
            </Table.Cell>
            <Table.Cell justify="center">
              <Flex align="center" direction="row" justify="center" className="mb-0" >
                <Text as="label" className="pr-3">
                  {participant.adultForm?.knowledgeAreas?.[0]}{'...'}{''}
                </Text>

                <HoverCard.Root>
                  <HoverCard.Trigger >
                    <IconButton size="1" variant="surface" radius="full">
                      <Icon.Eye size={15} className="hover:cursor-pointer" />
                    </IconButton>
                  </HoverCard.Trigger>
                  <HoverCard.Content size="3" >
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
                title={"Selecione as Áreas Gerias:"}
                accessibleDescription={"Essas áreas gerais são utilizadas para compreender as habilidades e talentos amplos de um indivíduo, com o objetivo de fornecer suporte e orientação adequada, identificando o potencial de desenvolvimento em diversas dimensões da vida pessoal e acadêmica."} >

                <Select
                  isMulti
                  aria-hidden="false"
                  options={selectItensKA.map((iten) => ({
                    value: iten.value,
                    label: iten.label,
                  }))}
                  className="text-black"
                  placeholder="Selecione uma ou várias opções"
                  menuPosition="fixed"
                  onChange={handleChangeKA}

                />

                <Flex align="center" justify="center" className="gap-4 mt-0">
                  <Button
                    title={isSavingGift ? "Salvando..." : "Salvar"}
                    color="green"
                    size="Medium"
                    className="mt-5"
                    onClick={async () => await handleSubmitKA("KAG")}
                    disabled={isSavingGift}
                  >
                  </Button>
                </Flex>
              </Modal>
              <Flex align="center" direction="row" justify="center" className="gap-2" >
                <Text as="label" className="pr-3">
                  {participant.knowledgeAreasIndicatedByResearcher?.general[0]}{'...'}{''}
                </Text>

                <HoverCard.Root>
                  <HoverCard.Trigger >
                    <IconButton size="1" variant="surface" radius="full">
                      <Icon.Eye size={15} className="hover:cursor-pointer" />
                    </IconButton>
                  </HoverCard.Trigger>
                  <HoverCard.Content size="3" >
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
                  <IconButton size="1" variant="surface" radius="full" >
                    <Icon.Pencil

                      onClick={() => participant._id && handleShowKAG(participant._id)}
                      className="cursor-pointer"
                    />
                  </IconButton>
                </Tooltip>
              </Flex>


            </Table.Cell>
            <Table.Cell justify="center">
              <Modal
                open={openModalKAE}
                setOpen={setOpenModalKAE}
                title={"Selecione as Áreas Específicas:"}
                accessibleDescription={"Essas áreas específicas são utilizadas para identificar talentos excepcionais em diferentes campos, ajudando a orientar intervenções educacionais e sociais para promover o desenvolvimento e o reconhecimento de indivíduos com AH/SD."} >

                <Select
                  isMulti
                  options={selectItensKA.map((item) => ({
                    value: item.value,
                    label: item.label,
                  })) as any}
                  className="text-black"
                  placeholder="Selecione uma ou várias opções"
                  menuPosition="fixed"
                  onChange={handleChangeKA}
                />

                <Flex align="center" justify="center" className="gap-4">
                  <Button
                    title={isSavingGift ? "Salvando..." : "Salvar"}
                    color="green"
                    size="Medium"
                    className="mt-5"
                    onClick={async () => await handleSubmitKA("KAE")}
                    disabled={isSavingGift}
                  >
                  </Button>
                </Flex>
              </Modal>
              <Flex align="center" direction="row" justify="center" className="gap-2" >
                <Text as="label" className="pr-3">
                  {participant.knowledgeAreasIndicatedByResearcher?.specific[0]}{'...'}{''}
                </Text>

                <HoverCard.Root>
                  <HoverCard.Trigger >
                    <IconButton size="1" variant="surface" radius="full">
                      <Icon.Eye size={15} className="hover:cursor-pointer" />
                    </IconButton>
                  </HoverCard.Trigger>
                  <HoverCard.Content size="3" >
                    <Text as="div" size="3" trim="both">
                      {participant.knowledgeAreasIndicatedByResearcher?.specific.map((area, index) => (
                        <span key={index}>
                          {area}
                          {index !== (participant.knowledgeAreasIndicatedByResearcher?.specific.length ?? 0) - 1 && ", "}
                        </span>
                      ))}
                    </Text>
                  </HoverCard.Content>
                </HoverCard.Root>
                <Tooltip content="Definir/Editar Áreas Específicas">
                  <IconButton size="1" variant="surface" radius="full" >
                    <Icon.Pencil

                      onClick={() => participant._id && handleShowKAE(participant._id)}
                      className="cursor-pointer"
                    />
                  </IconButton>
                </Tooltip>
              </Flex>

            </Table.Cell>
            <Table.Cell justify="center">
              <Flex justify="center" align="center" className="gap-4">
                <Dialog.Root >
                  <Dialog.Trigger>
                    <Box>
                      <Tooltip content="Visualizar Informações completas do Participante">
                        <IconButton size="2" color="lime" radius="full" variant="outline" className="hover:cursor-pointer hover:translate-y-[3px] transition-all ease-in-out">
                          <Icon.IdentificationCard size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Dialog.Trigger>
                  <Dialog.Content style={{ maxWidth: 450 }}>
                    <Dialog.Title align="center" mb="5" >Informações Gerais do Participante</Dialog.Title>
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
                      <Text as="label" size="2" mb="1" weight="bold">
                        Ocupação
                        <TextField.Root
                          defaultValue={participant.personalData.occupation}
                          disabled
                        />
                      </Text>
                    </Flex>

                    <Flex gap="3" mt="4" justify="end">
                      <Dialog.Close>
                        <Button color="red" className="w-[100px]" title={"Fechar"} size={""}>

                        </Button>
                      </Dialog.Close>
                    </Flex>
                  </Dialog.Content>
                </Dialog.Root>
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Box className="flex gap-3" onClick={() => handleCompareSource(participant)}>
                      <Tooltip content="Comparar as respostas do avaliado com as respostas das 2ª fontes">
                        <IconButton color="cyan" radius="full" variant="outline" className="hover:cursor-pointer  hover:translate-y-[3px] transition-all ease-in-out">
                          <Icon.ClipboardText size={20} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content >
                    <AlertDialog.Title> Nenhuma pessoa foi identificada como segunda fonte desse avaliado. </AlertDialog.Title>
                    <AlertDialog.Description size="2">
                      Para mostrar as respostas do avaliado com as da(s) segunda(s) fonte(s), é necessário a finalização do questionário de uma pessoa adicional, atuando como a segunda fonte.
                    </AlertDialog.Description>

                    <Flex gap="3" mt="4" justify="end">
                      <AlertDialog.Cancel>
                        <Theme.Button variant="soft" color="red" className="hover:cursor-pointer">
                          Voltar
                        </Theme.Button>
                      </AlertDialog.Cancel>

                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>


                <Box className="flex gap-3" onClick={() => handleEvaluateAutobiography(participant, sample)}>
                  <Tooltip content="Visualizar Autobiaografia do participante">
                    <IconButton color="bronze" radius="full" variant="outline" className="hover:cursor-pointer  hover:translate-y-[3px] transition-all ease-in-out">
                      <Icon.IdentificationBadge size={20} />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Flex>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>


    // <AlertDialog.Root open={openModalIAH} onOpenChange={setOpenModalIAH}>
    //   <AlertDialog.Content>
    //     {/* Conteúdo do modal IAH */}
    //   </AlertDialog.Content>
    // </AlertDialog.Root>



  );
};

export default ParticipantsTable;