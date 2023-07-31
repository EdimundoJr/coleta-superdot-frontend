import { InferType, number, object, string } from "yup";
import { BRAZIL_REGIONS_ARRAY, INSTITUITION_TYPE_ARRAY } from "../utils/consts.utils";

export const sampleSchema = object({
    researchTitle: string().required("Por favor, insira o título da pesquisa."),
    sampleTitle: string().required("Por favor, insira título da amostra."),
    sampleGroup: string(),
    qttParticipantsRequested: number()
        .typeError("Por favor, insira um número válido.")
        .required("Por favor, informe o número de participantes da amostra."),
    researchCep: object({
        cepCode: string().required("Por favor, informe o código fornecido pelo Comitê de Ética em Pesquisa"),
        researchDocument: string(),
        tcleDocument: string(),
        taleDocument: string(),
    }),
    countryRegion: string()
        .oneOf(BRAZIL_REGIONS_ARRAY, "Por favor, selecione uma região válida.")
        .required("Por favor, informe a região dos participantes da amostra."),
    countryState: string().required("Por favor, informe o estado dos participantes da amostra."),
    countryCity: string().required("Por favor, informe a cidade dos participantes da amostra."),
    instituition: object({
        name: string().required("Por favor, informe o nome da instituição dos participantes."),
        instType: string()
            .oneOf(INSTITUITION_TYPE_ARRAY, "Por favor, selecione um tipo válido.")
            .required("Por favor, informe o tipo de instituição."),
    }),
});

export type SampleValues = InferType<typeof sampleSchema>;
