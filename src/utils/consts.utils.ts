
export const SAMPLE_STATUS_ARRAY = ["Pendente", "Autorizado", "Não Autorizado"] as const;
export type SampleStatus = "Pendente" | "Autorizado" | "Não Autorizado";

export const INSTITUITION_TYPE_ARRAY = ["Pública", "Particular"] as const;
export type InstituitionType = "Pública" | "Particular";

export const BRAZIL_REGIONS_ARRAY = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;
export type brazilRegionsType = "Norte" | "Nordeste" | "Centro-Oeste" | "Sudeste" | "Sul";

export type USER_ROLE = "Pesquisador" | "Revisor" | "Administrador";

export const DOTS = "...";

export const LIMIT_FILE_SIZE = 10 * 1024 * 1024;

export const FILES_AVAILABLE_TO_CREATE_SAMPLE = [
    {
        key: "researchCep[researchDocument]",
        jsonFileKey: "researchDocument",
        label: "Projeto de pesquisa",
        required: true,
    },
    {
        key: "researchCep[tcleDocument]",
        jsonFileKey: "tcleDocument",
        label: "TCLE",
        required: true,
    },
    {
        key: "researchCep[taleDocument]",
        jsonFileKey: "taleDocument",
        label: "TALE",
    },
];
