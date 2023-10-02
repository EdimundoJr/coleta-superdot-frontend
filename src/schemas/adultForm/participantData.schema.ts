import { InferType, array, date, number, object, string } from "yup";
import {
    DEVICES_ARRAY,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    MARITAL_STATUS_ARRAY,
} from "../../utils/consts.utils";

export const participantDataSchema = object({
    personalData: object({
        fullName: string().required("Nome completo é um campo obrigatório.").trim().uppercase(),
        phone: string().max(11).required("Número de telefone é um campo obrigatório.").trim(),
        email: string(),
        maritalStatus: string()
            .oneOf(MARITAL_STATUS_ARRAY, "Selecione uma opção válida.")
            .required("Estado civil é um campo obrigatório."),
        job: string().required("Profissão é um campo obrigatório."),
        occupation: string().required("Ocupação é um campo obrigatório."),
        educationLevel: string()
            .oneOf(EDUCATION_LEVEL_ARRAY, "Selecione uma opção válida.")
            .required("Grau de escolaridade é um campo obrigatório."),
        gender: string().oneOf(GENDER_ARRAY, "Selecione uma opção válida.").required("Sexo é um campo obrigatório."),
        birthDate: date().typeError("Insira uma data válida!").required("Data de nascimento é um campo obrigatório."),
    }),
    familyData: object({
        qttChildrens: number()
            .typeError("Informe um número válido.")
            .required("Número de filhos é um campo obrigatório."),
        qttSiblings: number()
            .typeError("Informe um número válido.")
            .required("Número de irmãos é um campo obrigatório."),
        qttFamilyMembers: string()
            .typeError("Informe um número válido.")
            .required("Número de pessoas que moram com você é um campo obrigatório."),
        familyMonthIncome: string()
            .oneOf(INCOME_LEVELS_ARRAY, "Selecione uma opção válida.")
            .required("Renda familiar é um campo obrigatório."),
        houseDevices: array().of(string().oneOf(DEVICES_ARRAY, "Selecione uma opção válida.")),
        outsideHouseDevices: array().of(string().oneOf(DEVICES_ARRAY, "Selecione uma opção válida.")),
    }),
    addressData: object({
        city: string().required("Cidade é um campo obrigatório."),
        district: string().required("Bairro é um campo obrigatório."),
        street: string().required("Nome da rua é um campo obrigatório."),
        houseNumber: string().required("Número da casa é um campo obrigatório."),
    }),
});

export type ParticipantDataValues = InferType<typeof participantDataSchema>;
