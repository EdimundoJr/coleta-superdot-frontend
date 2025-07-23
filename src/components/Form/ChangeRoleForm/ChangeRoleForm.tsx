import * as Form from "@radix-ui/react-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SelectField } from "../../SelectField/SelectField";
import { TextAreaField } from "../../TextAreaField/TextAreaField";
import { setUserRole } from "../../../api/auth.api";
import { USER_ROLE, USER_ROLES_ARRAY } from "../../../utils/consts.utils";
import { Button } from "../../Button/Button";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";
import * as Icon from "@phosphor-icons/react";


interface ChangeRoleFormProps {
    userId: string;
    onFinish: (newUserROle: USER_ROLE) => void;
    currentUserRole: USER_ROLE;
}

const ChangeRoleForm = ({ userId, onFinish, currentUserRole }: ChangeRoleFormProps) => {
    const [loading, setLoading] = useState(false);
    const usersPageSearchFormSchema = yup.object({
        newRole: yup
            .string()
            .oneOf(USER_ROLES_ARRAY, "Por favor, selecione um perfil.")
            .notOneOf([currentUserRole])
            .required(),
        emailMessage: yup.string(),
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(usersPageSearchFormSchema) });

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await setUserRole(userId, data.newRole, data.emailMessage);
            if (response.status === 200) {
                onFinish(data.newRole);
                return;
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    });

    return (
        <Form.Root onSubmit={onSubmit}>
            <Flex direction={"column"} gap={"3"}>
                <SelectField
                    defaultValue={currentUserRole}
                    errorMessage={errors?.newRole?.message}
                    label="Perfil"
                    {...register("newRole")}
                >

                    <option>Pesquisador</option>
                    <option>Revisor</option>
                    <option>Administrador</option>
                </SelectField>
                <TextAreaField
                    errorMessage={errors?.emailMessage?.message}
                    label="Mensagem (será enviada ao e-mail do usuário)"
                    {...register("emailMessage")}
                    className="border-2 border-gray-300"
                />
                <Form.Submit asChild>
                    <Button loading={loading} title={"Salvar alterações"} color={"green"} size={"Medium"} children={<Icon.FloppyDisk size={18} weight="bold" />} />
                </Form.Submit>
            </Flex>
        </Form.Root>
    );
};

export default ChangeRoleForm;
