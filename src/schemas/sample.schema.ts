import { InferType, number, object, string } from "yup";
import { BRAZIL_REGIONS_ARRAY, INSTITUITION_TYPE_ARRAY } from "../utils/consts.utils";

export const sampleSchema = object({
    researchTitle: string().required("Título da pesquisa é um campo obrigatório."),
    sampleTitle: string().required("Título da amostra é um campo obrigatório."),
    sampleGroup: string(),
    qttParticipantsRequested: number()
        .typeError("Número inválido.")
        .required("Número de participantes da amostra é um campo obrigatório."),
    researchCep: object({
        cepCode: string().required("Código fornecido pelo Comitê de Ética em Pesquisa é um campo obrigatório."),
        researchDocument: string(),
        tcleDocument: string(),
        taleDocument: string(),
    }),
    countryRegion: string()
        .oneOf(BRAZIL_REGIONS_ARRAY, "Região inválida.")
        .required("A região dos participantes da amostra é um campo obrigatório."),
    countryState: string().required("O estado dos participantes da amostra é um campo obrigatório."),
    countryCity: string().required("A cidade dos participantes da amostra é um campo obrigatório."),
    instituition: object({
        name: string().required("Nome da instituição dos participantes é um campo obrigatório."),
        instType: string()
            .oneOf(INSTITUITION_TYPE_ARRAY, "Tipo inválido.")
            .required("Tipo de instituição é um campo obrigatório."),
    }),
});

export type SampleValues = InferType<typeof sampleSchema>;
