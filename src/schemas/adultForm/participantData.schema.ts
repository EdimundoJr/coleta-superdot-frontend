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
        fullName: string().required("Por favor, insira o nome completo.").trim().uppercase(),
        phone: string().max(11).required("Por favor, insira o número de telefone.").trim(),
        email: string(),
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
    familyData: object({
        qttChildrens: number()
            .typeError("Por favor, informe um número válido.")
            .required("Por favor, informe o número de filhos."),
        qttSiblings: number()
            .typeError("Por favor, informe um número válido.")
            .required("Por favor, informe o número de irmãos."),
        qttFamilyMembers: string()
            .typeError("Por favor, informe um número válido.")
            .required("Por favor, informe o número de pessoas que moram com você."),
        familyMonthIncome: string()
            .oneOf(INCOME_LEVELS_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, informe a renda familiar."),
        houseDevices: array().of(string().oneOf(DEVICES_ARRAY, "Por favor, selecione uma opção válida.")),
        outsideHouseDevices: array().of(string().oneOf(DEVICES_ARRAY, "Por favor, selecione uma opção válida.")),
    }),
    addressData: object({
        city: string().required("Por favor, informe a cidade."),
        district: string().required("Por favor, informe o bairro."),
        street: string().required("Por favor, informe o nome da rua."),
        houseNumber: string().required("Por favor, informe o número da casa."),
    }),
});

export type ParticipantDataValues = InferType<typeof participantDataSchema>;
