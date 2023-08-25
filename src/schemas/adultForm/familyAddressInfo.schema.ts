import { InferType, array, number, object, string } from "yup";
import { DEVICES_ARRAY, INCOME_LEVELS_ARRAY } from "../../utils/consts.utils";

export const adultFormFamilyAndAddressInfoSchema = object({
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

export type AdultFormFamilyAndAddressInfoValues = InferType<typeof adultFormFamilyAndAddressInfoSchema>;
