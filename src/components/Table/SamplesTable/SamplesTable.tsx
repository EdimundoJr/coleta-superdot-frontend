import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE } from "../../../api/researchers.api";
import { PageSampleSummary, SampleSummary } from "../../../api/sample.api";
import { SampleStatus } from "../../../utils/consts.utils";
import { Box, Flex, IconButton, Select, Table, Tooltip, Text, DataList, Separator } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import SkeletonTableBody from "../../Skeletons/SkeletonTableBody";
import SkeletonDataList from "../../Skeletons/SkeletonDataList";
import EmptyState from "../../EmptyState/EmptyState";
import { Button } from "../../Button/Button";

interface SamplesTableProps {
    page?: PageSampleSummary;
    currentPage: number;
    currentStatus: SampleStatus | "";
    setCurrentPage: (newPage: number) => void;
    onClickToReviewSample: (itemId: string) => void;
    onClickToViewSampleReviews: (sample: SampleSummary) => void;
    onClickToViewSampleAttachments: (files: SampleSummary["files"]) => void;
    onChangeFilterStatus: (filter: SampleStatus | "") => void;
    loading: boolean;
}

const SamplesTable = ({
    page,
    currentPage,
    currentStatus,
    setCurrentPage,
    onClickToReviewSample,
    onClickToViewSampleReviews,
    onClickToViewSampleAttachments,
    onChangeFilterStatus,
    loading,
}: SamplesTableProps) => {
    const handleValueChange = (newValue: string) => {
        const status = newValue === 'Todos' ? "" : newValue as SampleStatus;
        onChangeFilterStatus(status);
        setCurrentPage(1);
    };

    const hasData = page?.data && page.data.length > 0;
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
            <Flex direction="column" className="w-full mb-6 px-4 sm:px-6 lg:px-8">
                <Text className="text-sm text-gray-600">
                    Revise o status, visualize os documentos ou aprove as amostras solicitadas pelos pesquisadores.
                </Text>
            </Flex>

            {/* Versão Desktop */}
            <Table.Root variant="surface" className="w-full m-auto desktop">
                <Table.Header className="text-[15px]">
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> Nome do Pesquisador</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r">Nome da amostra</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r">
                        <Tooltip content="Certificado de Apresentação de Apreciação Ética">
                            <Box>CAAE</Box>
                        </Tooltip>
                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> Participantes solicitados </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r">Participantes autorizados</Table.ColumnHeaderCell>

                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r">
                        <Flex direction="column">
                            <Box className="mb-1">Status</Box>
                            <Select.Root defaultValue="Todos" size="1" onValueChange={handleValueChange}>
                                <Select.Trigger />

                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Status</Select.Label>
                                        <Select.Item value="Todos" >Todos</Select.Item>
                                        <Select.Item value="Pendente">Pendente</Select.Item>
                                        <Select.Item value="Autorizado">Autorizado</Select.Item>
                                        <Select.Item value="Não Autorizado">Não Autorizado</Select.Item>
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Flex>

                    </Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> Ações</Table.ColumnHeaderCell>


                </Table.Header>

                {loading ? (
                    <SkeletonTableBody itens={PAGE_SIZE} columns={7} />
                ) : hasData ? (
                    <>
                        <Table.Body>
                            {page.data.map((sample) => (
                                <Table.Row align="center" key={sample.sampleId}>
                                    <Table.Cell justify="center">{getFirstAndLastName(sample.researcherName)}</Table.Cell>
                                    <Table.Cell justify="center">{sample.sampleName}</Table.Cell>
                                    <Table.Cell justify="center">{sample.cepCode}</Table.Cell>
                                    <Table.Cell justify="center">{sample.qttParticipantsRequested}</Table.Cell>
                                    <Table.Cell justify="center">{sample.qttParticipantsAuthorized}</Table.Cell>
                                    <Table.Cell justify="center">{sample.currentStatus}</Table.Cell>
                                    <Table.Cell justify="center">
                                        <Flex justify="center" gap="4">
                                            <Tooltip content="Alterar status.">
                                                <IconButton size="1" variant="surface" radius="full">
                                                    <Icon.Pencil
                                                        onClick={() => onClickToReviewSample(sample.sampleId)}
                                                        className="cursor-pointer"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip content="Visualizar histórico de reivisões.">
                                                <IconButton size="1" variant="surface" radius="full">
                                                    <Icon.MagnifyingGlass
                                                        onClick={() => onClickToViewSampleReviews(sample)}
                                                        className="cursor-pointer"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip content="Visualizar documentos anexados.">
                                                <IconButton size="1" variant="surface" radius="full">
                                                    <Icon.Clipboard
                                                        onClick={() => onClickToViewSampleAttachments(sample.files)}
                                                        className="cursor-pointer"
                                                    />
                                                </IconButton>
                                            </Tooltip>
                                        </Flex>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                        <Table.Row>
                            <Pagination
                                currentPage={currentPage}
                                pageSize={PAGE_SIZE}
                                totalCount={page?.pagination?.totalItems || 0}
                                onPageChange={setCurrentPage}
                            />
                        </Table.Row>
                    </>
                ) : (
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell colSpan={7} className="text-center">
                                Nenhuma amostra encontrada.
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                )}
            </Table.Root>

            {/* Versão Mobile */}
            <DataList.Root orientation="vertical" className="w-full mobo">
                <Flex justify="center" align="center" gap="4" className="card-container w-fit p-4 m-auto mb-5">
                    <p>Filtrar Status por:</p>
                    <Select.Root
                        value={currentStatus || "Todos"}
                        size="1"
                        onValueChange={handleValueChange}
                    >
                        <Select.Trigger />
                        <Select.Content>
                            <Select.Group>
                                <Select.Label>Status</Select.Label>
                                <Select.Item value="Todos">Todos</Select.Item>
                                <Select.Item value="Pendente">Pendente</Select.Item>
                                <Select.Item value="Autorizado">Autorizado</Select.Item>
                                <Select.Item value="Não Autorizado">Não Autorizado</Select.Item>
                            </Select.Group>
                        </Select.Content>
                    </Select.Root>
                </Flex>

                {loading ? (
                    <SkeletonDataList itens={PAGE_SIZE} columns={7} titles={1} />
                ) : hasData ? (
                    page.data.map((sample) => (
                        <DataList.Item
                            key={sample.sampleId}
                            className="w-full p-4 rounded-lg mb-5 border-2 card-container"
                        >
                            <p className="text-[16px] font-bold text-center  border-b-black">Informações da Amostra</p>
                            <DataList.Label>Nome do Pesquisador:</DataList.Label>
                            <DataList.Value>{sample.researcherName}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Nome da Amostra:</DataList.Label>
                            <DataList.Value>{sample.sampleName}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>CAAE:</DataList.Label>
                            <DataList.Value>{sample.cepCode}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Participantes Solicitados:</DataList.Label>
                            <DataList.Value>{sample.qttParticipantsRequested}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Participantes Autorizados:</DataList.Label>
                            <DataList.Value>{sample.qttParticipantsAuthorized}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Status:</DataList.Label>
                            <DataList.Value>{sample.currentStatus}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Ações:</DataList.Label>
                            <Flex justify="center" gap="2" direction={"column"}>
                                <Button title={"Alterar status"} className="w-full" onClick={() => onClickToReviewSample(sample.sampleId)} >
                                    <Icon.Pencil

                                        className="cursor-pointer"
                                    />
                                </Button>

                                <Button title={"Visualizar Revisões"} className="w-full" onClick={() => onClickToViewSampleReviews(sample)} >
                                    <Icon.MagnifyingGlass

                                        className="cursor-pointer"
                                    />
                                </Button>

                                <Button title={"Visualizar Documentos"} className="w-full" onClick={() => onClickToViewSampleAttachments(sample.files)}>
                                    <Icon.Clipboard

                                        className="cursor-pointer"
                                    />
                                </Button>
                            </Flex>
                        </DataList.Item>
                    ))
                ) : (
                    <EmptyState icon={<Icon.FileX weight="thin" size={100} />} title={"Nenhuma Solicitação encontrada."} description={"Não foram encontradas solicitações que correspondam aos critérios de busca ou filtros aplicados. Verifique os parâmetros utilizados e tente novamente."} />
                )}
            </DataList.Root>
        </>
    );
};

export default SamplesTable;