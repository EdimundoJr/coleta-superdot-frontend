import { InferType, number, object, string } from "yup";
import { BRAZIL_REGIONS_ARRAY, INSTITUITION_TYPE_ARRAY } from "../utils/consts.utils";

export const sampleSchema = object({
    research_title: string().required("Por favor, insira o título da pesquisa."),
    sample_title: string().required("Por favor, insira título da amostra."),
    sample_group: string(),
    qtt_participants_requested: number()
        .typeError("Por favor, insira um número válido.")
        .required("Por favor, informe o número de participantes da amostra."),
    research_cep: object({
        cep_code: string().required("Por favor, informe o código fornecido pelo Comitê de Ética em Pesquisa"),
        research_document: string(),
        tcle_document: string(),
        tale_document: string(),
    }),
    country_region: string()
        .oneOf(BRAZIL_REGIONS_ARRAY, "Por favor, selecione uma região válida.")
        .required("Por favor, informe a região dos participantes da amostra."),
    country_state: string().required("Por favor, informe o estado dos participantes da amostra."),
    country_city: string().required("Por favor, informe a cidade dos participantes da amostra."),
    instituition: object({
        name: string().required("Por favor, informe o nome da instituição dos participantes."),
        instType: string()
            .oneOf(INSTITUITION_TYPE_ARRAY, "Por favor, selecione um tipo válido.")
            .required("Por favor, informe o tipo de instituição."),
    }),
});

export type SampleValues = InferType<typeof sampleSchema>;
