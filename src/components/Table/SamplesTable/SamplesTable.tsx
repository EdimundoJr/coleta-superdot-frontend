import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE } from "../../../api/researchers.api";
import { PageSampleSummary, SampleSummary } from "../../../api/sample.api";
import { SampleStatus } from "../../../utils/consts.utils";
import { Box, Flex, IconButton, Select, Table, Tooltip } from "@radix-ui/themes";
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
        <Table.Root variant="surface" className="w-full truncate m-auto" >

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
        // <>
        //     <div className="mt-11 flex gap-5 text-alternative-text sm:justify-center ">
        //         <div
        //             onClick={() => onChangeFilterStatus("")}
        //             className={`w-fit cursor-pointer rounded-t-lg p-1 ${
        //                 !currentStatus ? "bg-primary" : "bg-gray-500"
        //             } hover:bg-primary-light`}
        //         >
        //             Todos
        //         </div>
        //         <div
        //             onClick={() => onChangeFilterStatus("Pendente")}
        //             className={`w-fit cursor-pointer rounded-t-lg ${
        //                 currentStatus === "Pendente" ? "bg-primary" : "bg-gray-500"
        //             } p-1 hover:bg-primary-light`}
        //         >
        //             Pendentes
        //         </div>
        //         <div
        //             onClick={() => onChangeFilterStatus("Autorizado")}
        //             className={`w-fit cursor-pointer rounded-t-lg ${
        //                 currentStatus === "Autorizado" ? "bg-primary" : "bg-gray-500"
        //             } p-1 hover:bg-primary-light`}
        //         >
        //             Autorizados
        //         </div>
        //         <div
        //             onClick={() => onChangeFilterStatus("Não Autorizado")}
        //             className={`w-fit cursor-pointer rounded-t-lg ${
        //                 currentStatus === "Não Autorizado" ? "bg-primary" : "bg-gray-500"
        //             } p-1 hover:bg-primary-light`}
        //         >
        //             Não autorizados
        //         </div>
        //     </div>
        //     <table className="bg-dark-gradient mx-auto w-11/12 border-collapse rounded-md text-alternative-text">
        //         <thead>
        //             <tr>
        //                 <th className="px-6 py-3">Nome do Pesquisador</th>
        //                 <th className="px-6 py-3">Nome da amostra</th>
        //                 <th className="px-6 py-3">
        //                     <span title="Certificado de Apresentação de Apreciação Ética">CAAE</span>
        //                 </th>
        //                 <th className="px-6 py-3">Participantes solicitados</th>
        //                 <th className="px-6 py-3">Participantes autorizados</th>
        //                 <th className="px-6 py-3">Status</th>
        //                 <th className="px-6 py-3">Ações</th>
        //             </tr>
        //         </thead>
        //         <tbody className="bg-white text-primary">
        //             {page?.data?.map((sample) => (
        //                 <tr key={sample.sampleId} className="odd:bg-gray-200">
        //                     <td className="border-x-2 border-gray-600 px-6 py-3">{sample.researcherName}</td>
        //                     <td className="border-x-2 border-gray-600 px-6 py-3">{sample.sampleName}</td>
        //                     <td className="border-x-2 border-gray-600 px-6 py-3">{sample.cepCode}</td>
        //                     <td className="border-x-2 border-gray-600 px-6 py-3">{sample.qttParticipantsRequested}</td>
        //                     <td className="border-x-2 border-gray-600 px-6 py-3">{sample.qttParticipantsAuthorized}</td>
        //                     <td className="border-x-2 border-gray-600 px-6 py-3">{sample.currentStatus}</td>
        //                     <td className="border-x-2 border-gray-600 px-6 py-3 text-center">
        //                         <div className="flex justify-center gap-2">
        //                             <span title="Alterar status.">
        //                                 <Pencil1Icon
        //                                     onClick={() => onClickToReviewSample(sample.sampleId)}
        //                                     className="cursor-pointer"
        //                                 />
        //                             </span>
        //                             <span title="Visualizar histórico de reivisões.">
        //                                 <MagnifyingGlassIcon
        //                                     onClick={() => onClickToViewSampleReviews(sample)}
        //                                     className="cursor-pointer"
        //                                 />
        //                             </span>
        //                             <span title="Visualizar documentos anexados.">
        //                                 <ClipboardIcon
        //                                     onClick={() => onClickToViewSampleAttachments(sample.files)}
        //                                     className="cursor-pointer"
        //                                 />
        //                             </span>
        //                         </div>
        //                     </td>
        //                 </tr>
        //             ))}
        //         </tbody>
        //         <tfoot>
        //             <tr className="text-right">
        //                 <td className="px-6 py-3" colSpan={3}>
        //                     <Pagination
        //                         currentPage={currentPage}
        //                         pageSize={PAGE_SIZE}
        //                         totalCount={page?.pagination?.totalItems || 0}
        //                         onPageChange={(page: number) => setCurrentPage(page)}
        //                     />
        //                 </td>
        //             </tr>
        //         </tfoot>
        //     </table>
        // </>
    );
};

export default SamplesTable;
