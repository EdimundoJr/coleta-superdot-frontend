import Pagination from "../Pagination/Pagination";
import { PAGE_SIZE, ResearchersPaginated } from "../../../api/researchers.api";
import { DataList, IconButton, Separator, Table, Tooltip } from "@radix-ui/themes";
import * as Icon from '@phosphor-icons/react'
import SkeletonTableBody from "../../Skeletons/SkeletonTableBody";
import { useEffect, useState } from "react";
import SkeletonDataList from "../../Skeletons/SkeletonDataList";
import { Button } from "../../Button/Button";


interface UsersTableProps {
    data?: ResearchersPaginated;
    currentPage: number;
    setCurrentPage: (newPage: number) => void;
    onClickPencil: (itemId: string) => void;
}

const UsersTable = ({ data, currentPage, setCurrentPage, onClickPencil }: UsersTableProps) => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (data) {
            setLoading(false);
        }
    }, [data]);

    return (
        <>
            <Table.Root variant="surface" className="w-full truncate m-auto desktop" >

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
                {loading ? (
                    <SkeletonTableBody itens={PAGE_SIZE} columns={4} />
                ) : (
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
                )}

            </Table.Root>
            {loading ? (
                <SkeletonDataList itens={PAGE_SIZE} columns={4} titles={1} />
            ) : (
                <DataList.Root orientation="vertical" className="w-full mobo">
                    {data?.researchers?.map((user) => (
                        <DataList.Item
                            key={user._id}
                            className="w-full p-4 rounded-lg mb-5 border-2 card-container"
                        >
                            <p className="text-[18px] font-bold text-center mb-2">Dados do Usuário</p>

                            <DataList.Label>Nome:</DataList.Label>
                            <DataList.Value>{user.fullname}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>E-mail:</DataList.Label>
                            <DataList.Value>{user.email}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Perfil:</DataList.Label>
                            <DataList.Value>{user.role}</DataList.Value>
                            <Separator size="4" />

                            <DataList.Label>Ações:</DataList.Label>
                            <div className="flex justify-start mt-1">
                                <Tooltip content="Alterar perfil do usuário.">
                                    <Button
                                        onClick={() => onClickPencil(user._id)}
                                        className="hover:cursor-pointer w-full" title={"Alterar perfil do usuário"}>
                                        <Icon.Pencil />
                                    </Button>
                                </Tooltip>
                            </div>
                        </DataList.Item>
                    ))}

                    {/* Paginação */}
                    <div className="mt-4">
                        <Pagination
                            currentPage={currentPage}
                            pageSize={PAGE_SIZE}
                            totalCount={data?.totalResearchers || 1}
                            onPageChange={(page: number) => setCurrentPage(page)}
                        />
                    </div>
                </DataList.Root>
            )}
        </>
    );
};

export default UsersTable;
