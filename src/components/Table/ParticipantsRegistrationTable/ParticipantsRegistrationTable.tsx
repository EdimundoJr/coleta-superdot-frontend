import { DateTime } from "luxon";
import { ISample } from "../../../interfaces/sample.interface";
import { TFormFillStatus } from "../../../utils/consts.utils";
import { IParticipant } from "../../../interfaces/participant.interface";
import Accordeon from "../../Accordeon/Accordeon";
import { Flex, IconButton, Table } from "@radix-ui/themes";
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

    return (
        <Accordeon
            title="Informações do(s) Participante(s):"
            content={
                <Table.Root variant="surface" className="w-full">
                    <Table.Header className="text-[16px]">
                        <Table.Row align="center" className="text-center">
                            <Table.ColumnHeaderCell className="border-l">Nome</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l">Andamento</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l">2ªs Fontes</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l">Data de início</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l">Data de fim</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l">Indicadores de AH/SD</Table.ColumnHeaderCell>
                            <Table.ColumnHeaderCell className="border-l">URL 2ª fonte</Table.ColumnHeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {data?.map((participant) => (
                            <Table.Row key={participant._id} align="center">
                                <Table.Cell justify="center">{participant.personalData.fullName}</Table.Cell>
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
                                <Table.Cell justify="center">{participant.adultForm?.startFillFormAt &&
                                    DateTime.fromISO(participant.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")}</Table.Cell>
                                <Table.Cell justify="center">{participant.adultForm?.endFillFormAt &&
                                    getParticipantProgress(participant) === "Finalizado" &&
                                    DateTime.fromISO(participant.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")}</Table.Cell>
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
            }
            className="mb-2"
            defaultValue="item-1"
        />  
    );
};

export default ParticipantsRegistrationTable;
