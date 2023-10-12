import * as yup from "yup";

export const usersPageSearchFormSchema = yup.object({
    userName: yup.string(),
    userEmail: yup.string().email("E-mail inválido!"),
});
