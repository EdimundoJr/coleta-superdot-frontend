import * as Form from "@radix-ui/react-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SelectField } from "../../SelectField/SelectField";
import { TextAreaField } from "../../TextAreaField/TextAreaField";
import { setUserRole } from "../../../api/auth.api";

const usersPageSearchFormSchema = yup.object({
    newRole: yup
        .string()
        .oneOf(["Pesquisador", "Revisor", "Administrador"], "Por favor, selecione um perfil.")
        .required(),
    emailMessage: yup.string(),
});

interface ChangeRoleFormProps {
    userId: string;
    onFinish: () => void;
    currentUserRole: string;
}

const ChangeRoleForm = ({ userId, onFinish, currentUserRole }: ChangeRoleFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(usersPageSearchFormSchema) });

    console.log(currentUserRole);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await setUserRole(userId, data.newRole, data.emailMessage);
            if (response.status === 200) {
                onFinish();
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
                label="Mensagem"
                {...register("emailMessage")}
            />
            <Form.Submit asChild>
                <button className="float-right mr-3 text-white">Salvar</button>
            </Form.Submit>
        </Form.Root>
    );
};

export default ChangeRoleForm;
