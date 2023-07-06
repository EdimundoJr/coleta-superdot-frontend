import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import Button from "../../components/Inner/Button/Button";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import UsersTable from "../../components/Inner/Table/UsersTable/UsersTable";
import { Filters, PAGE_SIZE, ResearchersPaginated, paginateResearcher } from "../../api/researchers.api";
import { useEffect, useState } from "react";
import Modal from "../../components/Inner/Modal/Modal";
import ChangeRoleForm from "../../components/Inner/Form/ChangeRoleForm/ChangeRoleForm";
import * as Toast from "@radix-ui/react-toast";
import { fetchUserRole } from "../../api/auth.api";

const usersPageSearchFormSchema = yup.object({
    userName: yup.string(),
    userEmail: yup.string().email("Por favor, insira um e-mail válido!"),
});

const UsersPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(usersPageSearchFormSchema) });

    const [tablePageData, setTablePageData] = useState<ResearchersPaginated>();
    const [currentTablePage, setCurrentTablePage] = useState(1);
    const [userSelected, setUserSelected] = useState<string | null>();
    const [showSuccessNotify, setShowSuccessNotify] = useState(false);
    const [filters, setFilters] = useState<Filters>();
    const [currentUserRole, setCurrentUserRole] = useState("");

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
        setCurrentUserRole(role.data || "");
        setUserSelected(userId);
        setModalOpen(true);
    };

    const onUpdateUserRole = () => {
        setModalOpen(false);
        setShowSuccessNotify(true);
    };

    return (
        <Toast.Provider swipeDirection="left">
            <header className="mt-6 text-2xl font-bold text-blue-950">Usuários</header>
            <div>
                <Form.Root
                    onSubmit={handleSubmit((data) => setFilters(data))}
                    className="mx-auto my-8 inline-block w-11/12"
                >
                    <div className="sm:flex">
                        <InputField
                            label="Pesquisar pelo nome do usuário"
                            placeholder="Digite o nome do usuário"
                            scope="INNER"
                            type="text"
                            errorMessage={errors.userName?.message}
                            {...register("userName")}
                        />
                        <InputField
                            label="Pesquisar pelo e-mail do usuário"
                            placeholder="Digite o e-mail do usuário"
                            scope="INNER"
                            type="email"
                            errorMessage={errors.userEmail?.message}
                            {...register("userEmail")}
                        />
                    </div>
                    <Button
                        onClick={() => setFilters({})}
                        type="reset"
                        className="float-right mr-3"
                        placeholder="Limpar Campos"
                        scope="INNER"
                    />
                    <Form.Submit asChild>
                        <Button className="float-right mr-3" placeholder="Pesquisar" scope="INNER" />
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
            <Toast.Root
                className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md border border-blue-800 bg-white p-[15px] text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
                open={showSuccessNotify}
                onOpenChange={setShowSuccessNotify}
            >
                <Toast.Title className="mb-[5px] text-[15px] font-medium text-slate12 [grid-area:_title]">
                    Sucesso!
                </Toast.Title>
                <Toast.Description className="m-0 text-[13px] leading-[1.3] text-slate11 [grid-area:_description]">
                    <p>O perfil do usuário foi atualizado com sucesso!</p>
                </Toast.Description>
            </Toast.Root>
            <Toast.Viewport className="fixed right-0 top-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />
        </Toast.Provider>
    );
};

export default UsersPage;
