import { InferType, date, object, string } from "yup";
import { EDUCATION_LEVEL_ARRAY, RELATIONSHIPS_ARRAY, RELATIONSHIP_TIME_ARRAY } from "../../utils/consts.utils";

export const secondSourceDataSchema = object({
    personalData: object({
        email: string().required(),
        fullName: string().required("Nome completo é um campo obrigatório."),
        birthDate: date().typeError("Insira uma data válida!").required("Data de nascimento é um campo obrigatório."),
        relationship: string()
            .oneOf(RELATIONSHIPS_ARRAY, "Selecione uma opção válida.")
            .required("Tipo de relação é um campo obrigatório."),
        relationshipTime: string()
            .oneOf(RELATIONSHIP_TIME_ARRAY, "Selecione uma opção válida.")
            .required("Tempo da relação é um campo obrigatório."),
        job: string().required("Profissão é um campo obrigatório."),
        street: string().required("Nome da rua é um campo obrigatório."),
        district: string().required("Bairro é um campo obrigatório."),
        countryCity: string().required("Cidade é um campo obrigatório."),
        phone: string().max(11).required("Número de telefone é um campo obrigatório.").trim(),
        educationLevel: string()
            .oneOf(EDUCATION_LEVEL_ARRAY, "Selecione uma opção válida.")
            .required("Grau de escolaridade é um campo obrigatório."),
    }),
});

export type SecondSourceDTO = InferType<typeof secondSourceDataSchema>;
