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
        <Notify
            open={showSuccessNotify}
            onOpenChange={setShowSuccessNotify}
            title="Sucesso!"
            description="O perfil do usuário foi atualizado com sucesso!"
        >
            <header className="mt-6 text-2xl font-bold">Usuários</header>
            <div>
                <Form.Root
                    onSubmit={handleSubmit((data) => setFilters(data))}
                    className="mx-auto my-8 inline-block w-11/12"
                >
                    <div className="sm:flex">
                        <InputField
                            label="Pesquisar pelo nome do usuário"
                            placeholder="Digite o nome do usuário"
                            type="text"
                            errorMessage={errors.userName?.message}
                            {...register("userName")}
                        />
                        <InputField
                            label="Pesquisar pelo e-mail do usuário"
                            placeholder="Digite o e-mail do usuário"
                            type="email"
                            errorMessage={errors.userEmail?.message}
                            {...register("userEmail")}
                        />
                    </div>
                    <button
                        onClick={() => setFilters({})}
                        type="reset"
                        className="button-neutral-light float-right mr-3"
                    >
                        Limpar Campos
                    </button>
                    <Form.Submit asChild>
                        <button className="button-primary float-right mr-3">Pesquisar</button>
                    </Form.Submit>
                </Form.Root>
            </div>
            <div className="mb-8 overflow-x-scroll">
                <UsersTable
                    onClickPencil={onUserSelected}
                    currentPage={currentTablePage}
                    setCurrentPage={setCurrentTablePage}
                    data={tablePageData}
                />
            </div>
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
        </Notify>
    );
};

export default UsersPage;
