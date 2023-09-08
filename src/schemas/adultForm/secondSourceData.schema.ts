import { InferType, date, object, string } from "yup";
import { EDUCATION_LEVEL_ARRAY, RELATIONSHIPS_ARRAY, RELATIONSHIP_TIME_ARRAY } from "../../utils/consts.utils";

export const secondSourceDataSchema = object({
    personalData: object({
        fullName: string().required("Por favor, digite seu nome completo."),
        email: string(),
        birthDate: date()
            .typeError("Por favor, insira uma data válida!")
            .required("Por favor, insira a data de nascimento."),
        relationship: string()
            .oneOf(RELATIONSHIPS_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, Informe o tipo de relação."),
        relationshipTime: string()
            .oneOf(RELATIONSHIP_TIME_ARRAY)
            .oneOf(RELATIONSHIP_TIME_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, Informe o tempo da relação."),
        job: string().required("Por favor, informe sua profissão."),
        occupation: string().required("Por favor, informe a sua ocupação."),
        street: string().required("Por favor, informe o nome da rua."),
        district: string().required("Por favor, informe o bairro."),
        countryCity: string().required("Por favor, informe a cidade."),
        phone: string().max(11).required("Por favor, insira o número de telefone.").trim(),
        educationLevel: string()
            .oneOf(EDUCATION_LEVEL_ARRAY, "Por favor, selecione uma opção válida.")
            .required("Por favor, informe o grau de escolaridade."),
    }),
});

export type SecondSourceValues = InferType<typeof secondSourceDataSchema>;
