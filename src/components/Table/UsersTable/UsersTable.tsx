import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE, ResearchersPaginated } from "../../../api/researchers.api";
import { IconButton, Table, Tooltip } from "@radix-ui/themes";
import * as Icon from '@phosphor-icons/react'


interface UsersTableProps {
    data?: ResearchersPaginated;
    currentPage: number;
    setCurrentPage: (newPage: number) => void;
    onClickPencil: (itemId: string) => void;
}

const UsersTable = ({ data, currentPage, setCurrentPage, onClickPencil }: UsersTableProps) => {
    return (
        <Table.Root variant="surface" className="w-full truncate m-auto" >

            <Table.Header className="text-[18px]">
                <Table.Row>
                    <Table.ColumnHeaderCell align="center" colSpan={4} className="border-r" > Dados do usuário</Table.ColumnHeaderCell>

                </Table.Row>

            </Table.Header>
            <Table.Header className="text-[15px]">
                <Table.Row>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> Nome</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> E-mail</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> Perfil</Table.ColumnHeaderCell>
                    <Table.ColumnHeaderCell align="center" colSpan={1} className="border-r"> Ações</Table.ColumnHeaderCell>

                </Table.Row>

            </Table.Header>

            <Table.Body>
                {data?.researchers?.map((user) => (
                    <Table.Row
                        align="center"
                        key={user._id}>

                        <Table.Cell justify="center">{user.fullname} </Table.Cell>
                        <Table.Cell justify="center" >{user.email}</Table.Cell>
                        <Table.Cell justify="center">{user.role}</Table.Cell>
                        <Table.Cell justify="center">
                            <div className="flex justify-center">
                                <Tooltip content="Alterar perfil do usuário.">
                                    <IconButton variant="surface" radius="full" onClick={() => onClickPencil(user._id)} className="hover:cursor-pointer">
                                        <Icon.Pencil />
                                    </IconButton>
                                </Tooltip>
                            </div>
                        </Table.Cell>


                    </Table.Row>
                ))}
                <Table.Row>
                    <Pagination
                        currentPage={currentPage}
                        pageSize={PAGE_SIZE}
                        totalCount={data?.totalResearchers || 1}
                        onPageChange={(page: number) => setCurrentPage(page)}
                    />

                </Table.Row>
            </Table.Body>
        </Table.Root>
    );
};

export default UsersTable;
