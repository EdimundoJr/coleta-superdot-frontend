import { DateTime } from "luxon";
import { ISample } from "../../../interfaces/sample.interface";
import { TFormFillStatus } from "../../../utils/consts.utils";
import { IParticipant } from "../../../interfaces/participant.interface";
import Accordeon from "../../Accordeon/Accordeon";
import { DataList, Flex, IconButton, Separator, Table } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";

interface ParticipantsRegistrationTableProps {
    sampleId: string;
    data?: ISample["participants"];
    // currentPage: number;
    // setCurrentPage: (newPage: number) => void;
    onClickToViewSecondSources: (participant: IParticipant) => void;
    onClickToCopySecondSourceURL: (text: string) => void;
}

const ParticipantsRegistrationTable = ({
    sampleId,
    data,
    // currentPage,
    // setCurrentPage,
    onClickToViewSecondSources,
    onClickToCopySecondSourceURL,
}: ParticipantsRegistrationTableProps) => {
    const getParticipantProgress = (participant: IParticipant): TFormFillStatus => {
        if (!participant.adultForm?.startFillFormAt) {
            return "Não iniciado";
        }

        if (!participant.adultForm?.endFillFormAt) {
            return "Preenchendo";
        }

        const oneSecSourceFinishTheForm = participant.secondSources?.some(
            (secSource) => secSource.adultForm?.endFillFormAt
        );

        if (!oneSecSourceFinishTheForm) {
            return "Aguardando 2ª fonte";
        }

        return "Finalizado";
    };
    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };
    return (
        <>

            <Accordeon
                title="Informações do(s) Participante(s):"
                content={
                    <>
                        <Table.Root variant="surface" className="w-full desktop">
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Nome</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Andamento</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">2ªs Fontes</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Data de início</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Data de finalização</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Indicadores de AH/SD</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">URL 2ª fonte</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {data?.map((participant) => (
                                    <Table.Row key={participant._id} align="center">
                                        <Table.Cell justify="center">{getFirstAndLastName(participant.personalData.fullName)}</Table.Cell>
                                        <Table.Cell justify="center">{getParticipantProgress(participant)}</Table.Cell>
                                        <Table.Cell justify="center">
                                            <IconButton
                                                onClick={() => onClickToViewSecondSources(participant)}
                                                size="3"
                                                className="hover:cursor-pointer"
                                                variant="ghost"
                                                radius="large">
                                                <Flex gap="1" align="center">
                                                    {participant.secondSources?.length}
                                                    <Icon.MagnifyingGlass
                                                        className="cursor-pointer"

                                                    />
                                                </Flex>
                                            </IconButton>

                                        </Table.Cell>
                                        <Table.Cell justify="center">{participant.adultForm?.startFillFormAt
                                            ? DateTime.fromISO(participant.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                            : "Não iniciado"}</Table.Cell>
                                        <Table.Cell justify="center">{participant.adultForm?.endFillFormAt && getParticipantProgress(participant) === "Finalizado"
                                            ? DateTime.fromISO(participant.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                            : "Não Finalizado"}</Table.Cell>
                                        <Table.Cell justify="center">
                                            {participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}
                                        </Table.Cell>
                                        <Table.Cell justify="center">
                                            <IconButton
                                                onClick={() =>
                                                    onClickToCopySecondSourceURL(
                                                        `${import.meta.env.VITE_FRONTEND_URL
                                                        }/formulario-adulto-segunda-fonte/${sampleId}/${participant._id}`
                                                    )}
                                                size="3"
                                                className="hover:cursor-pointer"
                                                variant="ghost"
                                                radius="large">
                                                <Flex gap="2" align="center">
                                                    Copiar
                                                    <Icon.Copy
                                                        className="cursor-pointer"

                                                    />
                                                </Flex>
                                            </IconButton>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                        <div className="mobo m-4">
                            <DataList.Root orientation={"vertical"} className="!font-roboto" >
                                <DataList.Item >
                                    {data?.map((participant) => (
                                        <div className="w-full p-2  mb-5 card-container" key={participant._id}>
                                            <p className="text-[16px] font-bold text-center  border-b-black">{getFirstAndLastName(participant.personalData.fullName)}</p>



                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label minWidth="88px">Andamento</DataList.Label>

                                            <DataList.Value >{getParticipantProgress(participant)}
                                            </DataList.Value>

                                            <Separator size={"4"} className="mb-2 mt-2" />


                                            <DataList.Label minWidth="88px">2ªs Fontes</DataList.Label>

                                            <DataList.Value ><IconButton
                                                onClick={() => onClickToViewSecondSources(participant)}
                                                size="3"
                                                className="hover:cursor-pointer"
                                                variant="ghost"
                                                radius="large">
                                                <Flex gap="1" align="center">
                                                    {participant.secondSources?.length} Participantes
                                                    <Icon.MagnifyingGlass
                                                        className="cursor-pointer"

                                                    />
                                                </Flex>
                                            </IconButton></DataList.Value>
                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label minWidth="88px">Data de início</DataList.Label>

                                            <DataList.Value >{participant.adultForm?.startFillFormAt
                                                ? DateTime.fromISO(participant.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                : "Não iniciado"}
                                            </DataList.Value>
                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label minWidth="88px">Data de Finalização</DataList.Label>

                                            <DataList.Value >{participant.adultForm?.endFillFormAt && getParticipantProgress(participant) === "Finalizado"
                                                ? DateTime.fromISO(participant.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                : "Não Finalizado"}
                                            </DataList.Value>
                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label minWidth="88px">Indicadores de AH/SD</DataList.Label>

                                            <DataList.Value >{participant.adultForm?.giftednessIndicators ? "Sim" : "Não"}</DataList.Value>
                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label minWidth="88px">URL 2ª fonte</DataList.Label>

                                            <DataList.Value ><IconButton
                                                onClick={() =>
                                                    onClickToCopySecondSourceURL(
                                                        `${import.meta.env.VITE_FRONTEND_URL
                                                        }/formulario-adulto-segunda-fonte/${sampleId}/${participant._id}`
                                                    )}
                                                size="3"
                                                className="hover:cursor-pointer"
                                                variant="ghost"
                                                radius="large">
                                                <Flex gap="2" align="center">
                                                    Copiar
                                                    <Icon.Copy
                                                        className="cursor-pointer"

                                                    />
                                                </Flex>
                                            </IconButton></DataList.Value>

                                        </div>

                                    ))}
                                </DataList.Item>

                            </DataList.Root>
                        </div>
                    </>
                }
                className="mb-2"
                defaultValue="item-1"
            />

        </>
    );
};

export default ParticipantsRegistrationTable;
