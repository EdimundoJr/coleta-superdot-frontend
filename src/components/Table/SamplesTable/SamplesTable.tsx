import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE } from "../../../api/researchers.api";
import { PageSampleSummary, SampleSummary } from "../../../api/sample.api";
import { SampleStatus } from "../../../utils/consts.utils";
import { Box, Flex, IconButton, Select, Table, Tooltip, Text, DataList, Separator } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react"

interface SamplesTableProps {
    page?: PageSampleSummary;
    currentPage: number;
    currentStatus: SampleStatus | "";
    setCurrentPage: (newPage: number) => void;
    onClickToReviewSample: (itemId: string) => void;
    onClickToViewSampleReviews: (sample: SampleSummary) => void;
    onClickToViewSampleAttachments: (files: SampleSummary["files"]) => void;
    onChangeFilterStatus: (filter: SampleStatus | "") => void;
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

}: SamplesTableProps) => {
    const handleValueChange = (newValue: String) => {
        const status = newValue === 'Todos' ? "" : newValue as SampleStatus;
        onChangeFilterStatus(status);
    };
    return (
        <>
            <Flex
                direction="column"
                className="w-full mb-6 px-4 sm:px-6 lg:px-8"
            >

                <Text className="text-sm text-gray-600">
                    Revise o estatus, visualize os documentos ou aprove as amostras solicitadas pelos pesquisadores.
                </Text>
            </Flex>
            <Table.Root variant="surface" className="w-full m-auto desktop" >

                <Table.Header className="text-[15px]">
                    <Table.Row>
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

                    </Table.Row>

                </Table.Header>

                <Table.Body>
                    {page?.data?.map((sample) => (
                        <Table.Row
                            align="center"
                            key={sample.sampleId}>

                            <Table.Cell justify="center">{sample.researcherName} </Table.Cell>
                            <Table.Cell justify="center" >{sample.sampleName}</Table.Cell>
                            <Table.Cell justify="center" >{sample.cepCode}</Table.Cell>
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
                    <Table.Row>
                        <Pagination
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            totalCount={page?.pagination?.totalItems || 0}
                            onPageChange={(page: number) => setCurrentPage(page)}
                        />



                    </Table.Row>
                </Table.Body>
            </Table.Root>
            <DataList.Root orientation="vertical" className="w-full mobo">
                {page?.data?.map((sample) => (

                    <DataList.Item
                        key={sample.sampleId}
                        className="w-full p-4 rounded-lg mb-5 border-2  card-container"
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
                        <Flex justify="start" gap="4">
                            <Tooltip content="Alterar status.">
                                <IconButton size="1" variant="surface" radius="full">
                                    <Icon.Pencil
                                        onClick={() => onClickToReviewSample(sample.sampleId)}
                                        className="cursor-pointer"
                                    />
                                </IconButton>
                            </Tooltip>
                            <Tooltip content="Visualizar histórico de revisões.">
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
                    </DataList.Item>
                ))}

                {/* Paginação */}
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        totalCount={page?.pagination?.totalItems || 0}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />
                </div>
            </DataList.Root>

        </>
    );
};

export default SamplesTable;
