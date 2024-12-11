import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsersTable from "../../components/Table/UsersTable/UsersTable";
import { Filters, PAGE_SIZE, ResearchersPaginated, paginateResearcher } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal/Modal";
import ChangeRoleForm from "../../components/Form/ChangeRoleForm/ChangeRoleForm";
import { fetchUserRole } from "../../api/auth.api";
import Notify from "../../components/Notify/Notify";
import { usersPageSearchFormSchema } from "../../schemas/usersPage.schema";
import { USER_ROLE } from "../../utils/consts.utils";
import { Box, Container, Flex, Skeleton } from "@radix-ui/themes";
import { Header } from "../../components/Header/Header";
import { Button } from "../../components/Button/Button";
import * as Icon from "@phosphor-icons/react";

const UsersPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(usersPageSearchFormSchema) });

    const [tablePageData, setTablePageData] = useState<ResearchersPaginated>();
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [userSelected, setUserSelected] = useState<string | null>();
    const [filters, setFilters] = useState<Filters>();
    const [currentUserRole, setCurrentUserRole] = useState<USER_ROLE>("Pesquisador");
    const [loading, setLoading] = useState(true)
    const [showSuccessNotify, setShowSuccessNotify] = useState(false);

    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const getPage = async () => {
            const response = await paginateResearcher(currentTablePage, PAGE_SIZE, filters);
            if (response.status === 200) {
                setTablePageData(response.data);
            }
        };

        getPage();
        setLoading(false)
    }, [currentTablePage, filters]);

    const onUserSelected = async (userId: string) => {
        const role = await fetchUserRole(userId);
        setCurrentUserRole(role.data);
        setUserSelected(userId);
        setModalOpen(true);
    };

    const onUpdateUserRole = (newRole: USER_ROLE) => {
        setModalOpen(false);
        setShowSuccessNotify(true);
        const researchers = tablePageData?.researchers.map((data) => {
            if (data._id === userSelected) {
                return {
                    ...data,
                    role: newRole,
                };
            } else return data;
        });

        if (!researchers || !tablePageData) return;

        setTablePageData({
            totalResearchers: tablePageData?.totalResearchers,
            researchers,
        });
    };

    return (
        <>
            <Notify
                open={showSuccessNotify}
                onOpenChange={setShowSuccessNotify}
                title="Sucesso!"
                description="O perfil do usuário foi atualizado com sucesso!"
                icon={<Icon.CheckCircle size={30} color="white" />}
                className="bg-green-400"
            >
                <Header title="Usuários" icon={<Icon.UserGear size={24} />}></Header>
                <Box className="w-full pt-10 pb-10">
                    <Form.Root
                        onSubmit={handleSubmit((data) => setFilters(data))}
                        className="flex flex-col sm:flex-row items-center justify-between px-10 py-10 pt-0 pb-1 ">
                        <Form.Submit asChild>
                            <Button className="items-center w-[200px]" title="Filtrar" children={<Icon.Funnel size={20} color="white" />} color="primary">

                            </Button>
                        </Form.Submit>
                        <InputField
                            label="Pesquisar pelo nome do usuário"
                            placeholder="Digite o nome do usuário"
                            icon={<Icon.MagnifyingGlass />}
                            type="text"
                            errorMessage={errors.userName?.message}
                            {...register("userName")}
                        />
                        <InputField
                            label="Pesquisar pelo e-mail do usuário"
                            placeholder="Digite o e-mail do usuário"
                            type="email"
                            icon={<Icon.MagnifyingGlass />}
                            errorMessage={errors.userEmail?.message}
                            {...register("userEmail")}
                        />
                        <Button onClick={() => setFilters({})}
                            title="Limpar Filtro"
                            color="primary" />

                        <Flex >
                        </Flex>
                    </Form.Root>
                </Box>
                <Skeleton loading={loading}>
                    <Container className="mb-8">

                        <UsersTable
                            onClickPencil={onUserSelected}
                            currentPage={currentTablePage}
                            setCurrentPage={setCurrentTablePage}
                            data={tablePageData}
                        />

                    </Container>
                    <Modal
                        accessibleDescription="Selecione um novo perfil para o usuário escolhido."
                        title="Alterando Perfil"
                        open={modalOpen}
                        setOpen={setModalOpen}
                    >
                        <ChangeRoleForm
                            currentUserRole={currentUserRole}
                            onFinish={onUpdateUserRole}
                            userId={userSelected || ""}
                        />
                    </Modal>
                </Skeleton>
            </Notify>
        </>
    );
};

export default UsersPage;
