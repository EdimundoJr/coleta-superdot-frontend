import * as Form from "@radix-ui/react-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SelectField } from "../../SelectField/SelectField";
import { TextAreaField } from "../../TextAreaField/TextAreaField";
import { setUserRole } from "../../../api/auth.api";
import { USER_ROLE, USER_ROLES_ARRAY } from "../../../utils/consts.utils";
import { Button } from "../../Button/Button";


interface ChangeRoleFormProps {
    userId: string;
    onFinish: (newUserROle: USER_ROLE) => void;
    currentUserRole: USER_ROLE;
}

const ChangeRoleForm = ({ userId, onFinish, currentUserRole }: ChangeRoleFormProps) => {
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
        try {
            const response = await setUserRole(userId, data.newRole, data.emailMessage);
            if (response.status === 200) {
                onFinish(data.newRole);
                return;
            }
            console.log(response);
        } catch (e) {
            console.error(e);
        }
    });

    return (
        <Form.Root onSubmit={onSubmit}>
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
            />
            <Form.Submit asChild>
                <Button  title={"Salvar"} color={"green"} />
            </Form.Submit>
        </Form.Root>
    );
};

export default ChangeRoleForm;
