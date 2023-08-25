import { InferType, date, object, string } from "yup";
import { EDUCATION_LEVEL_ARRAY, GENDER_ARRAY, MARITAL_STATUS_ARRAY } from "../../utils/consts.utils";

export const adultFormPersonalInfoSchema = object({
    personalData: object({
        fullName: string().required("Por favor, insira o nome completo.").trim().uppercase(),
        email: string().email("Insira um e-mail válido.").required("Por favor, insira o email.").trim(),
        phone: string().max(11).required("Por favor, insira o número de telefone.").trim(),
        maritalStatus: string()
            .oneOf(MARITAL_STATUS_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, infome o estado civil."),
        job: string().required("Por favor, informe sua profissão."),
        occupation: string().required("Por favor, informe a sua ocupação."),
        educationLevel: string()
            .oneOf(EDUCATION_LEVEL_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, informe o grau de escolaridade."),
        gender: string()
            .oneOf(GENDER_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, informe o sexo."),
        birthDate: date()
            .typeError("Por favor, insira uma data válida!")
            .required("Por favor, insira a data de nascimento."),
    }),
});

export type AdultFormPersonalInfoValues = InferType<typeof adultFormPersonalInfoSchema>;
