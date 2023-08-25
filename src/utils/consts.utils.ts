export const SAMPLE_STATUS_ARRAY = ["Pendente", "Autorizado", "Não Autorizado"] as const;
export type SampleStatus = (typeof SAMPLE_STATUS_ARRAY)[number];

export const INSTITUITION_TYPE_ARRAY = ["Pública", "Particular"] as const;
export type InstituitionType = (typeof INSTITUITION_TYPE_ARRAY)[number];

export const BRAZIL_REGIONS_ARRAY = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;
export type brazilRegionsType = (typeof BRAZIL_REGIONS_ARRAY)[number];

export const MARITAL_STATUS_ARRAY = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"] as const;
export type maritalStatus = (typeof MARITAL_STATUS_ARRAY)[number];

export const GENDER_ARRAY = ["Masculino", "Feminino"] as const;
export type gender = (typeof GENDER_ARRAY)[number];

export const EDUCATION_LEVEL_ARRAY = [
    "Nenhum",
    "Fundamental",
    "Médio",
    "Profissionalizante",
    "Graduação",
    "Pós-graduação",
    "Mestrado",
    "Doutorado",
] as const;

export type educationLevel = (typeof EDUCATION_LEVEL_ARRAY)[number];

export const INCOME_LEVELS_ARRAY = [
    "Até 1 salário mínimo",
    "De 1 à 3 salários mínimos",
    "De 3 à 5 salários mínimos",
    "De 5 à 7 salários mínimos",
    "De 7 à 10 salários mínimos",
    "De 10 à 15 salários mínimos",
    "+15 salários mínimos",
] as const;

export type incomeLevels = (typeof INCOME_LEVELS_ARRAY)[number];

export const DEVICES_ARRAY = ["TV", "TV Cabo", "Computador", "Telefone", "Celular", "Internet"] as const;

export type devices = (typeof DEVICES_ARRAY)[number];

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

export enum Relationships {
    FRIEND = "Amigo",
    KIN = "Parente",
    TEACHER = "Professor",
}

export const RELATIONSHIPS_ARRAY = ["Amigo", "Parente", "Professor"];

export const FORM_FILL_STATUS = ["Preenchendo", "Aguardando 2ª fonte", "Finalizado"] as const;
export type FormFillStatusType = (typeof FORM_FILL_STATUS)[number];
