export const SAMPLE_STATUS_ARRAY = ["Pendente", "Autorizado", "Não Autorizado"] as const;
export type SampleStatus = (typeof SAMPLE_STATUS_ARRAY)[number];

export const INSTITUITION_TYPE_ARRAY = ["Pública", "Particular"] as const;
export type InstituitionType = (typeof INSTITUITION_TYPE_ARRAY)[number];

export const BRAZIL_REGIONS_ARRAY = ["Norte", "Nordeste", "Centro-Oeste", "Sudeste", "Sul"] as const;
export type brazilRegionsType = (typeof BRAZIL_REGIONS_ARRAY)[number];

export const MARITAL_STATUS_ARRAY = ["Solteiro(a)", "Casado(a)", "Divorciado(a)", "Viúvo(a)"] as const;
export type TMaritalStatus = (typeof MARITAL_STATUS_ARRAY)[number];

export const GENDER_ARRAY = ["Masculino", "Feminino"] as const;
export type TGender = (typeof GENDER_ARRAY)[number];

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

export type TEducationLevel = (typeof EDUCATION_LEVEL_ARRAY)[number];

export const INCOME_LEVELS_ARRAY = [
    "Até 1 salário mínimo",
    "De 1 à 3 salários mínimos",
    "De 3 à 5 salários mínimos",
    "De 5 à 7 salários mínimos",
    "De 7 à 10 salários mínimos",
    "De 10 à 15 salários mínimos",
    "+15 salários mínimos",
] as const;

export type TIncomeLevel = (typeof INCOME_LEVELS_ARRAY)[number];

export const DEVICES_ARRAY = ["TV", "TV Cabo", "Computador", "Telefone", "Celular", "Internet"] as const;

export type TDevices = (typeof DEVICES_ARRAY)[number];

export const USER_ROLES_ARRAY = ["Pesquisador", "Revisor", "Administrador"] as const;

export type USER_ROLE = (typeof USER_ROLES_ARRAY)[number];

export const DOTS = "...";

export const LIMIT_FILE_SIZE = 10 * 1024 * 1024;

export const FILES_AVAILABLE_TO_CREATE_SAMPLE = [
    {
        key: "researchCep[researchDocument]",
        jsonFileKey: "researchDocument",
        label: "Projeto de pesquisa*",
        required: true,
    },
    {
        key: "researchCep[tcleDocument]",
        jsonFileKey: "tcleDocument",
        label: "Termo de Compromisso Livre e Esclarecido*",
        required: true,
    },
    {
        key: "researchCep[taleDocument]",
        jsonFileKey: "taleDocument",
        label: "Termo de Anuência Livre e Esclarecido",
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

export enum EAdultFormSource {
    FIRST_SOURCE = 0,
    SECOND_SOURCE = 1,
}

export type TParticipantFormProgress = "Preenchendo" | "Aguardando 2ª fonte" | "Finalizado";

export const RELATIONSHIP_TIME_ARRAY = [
    "De 0 à 2 anos",
    "Entre 2 e 3 anos",
    "Entre 3 e 4 anos",
    "Entre 4 e 5 anos",
    "Mais de 5 anos",
] as const;

export type TRelationshipTime = (typeof RELATIONSHIP_TIME_ARRAY)[number];

export enum EQuestionType {
    ONE_INPUT = 0, // One simple HTML input text
    FOUR_INPUT = 1, // Four simple HTML input text
    FIVE_OPTION = 2, // Five HTML Radio boxes (or similary logic with buttons)
    MULTIPLE_SELECT = 3, // One HTML select with multiple attribute define
    FOUR_SELECT = 4, // Four HTML selects
}

export enum EAdultFormSteps {
    INTRODUCTION = 0,
    PARTICIPANT_DATA = 1,
    READ_AND_ACCEPT_DOCS = 2,
    INDICATE_SECOND_SOURCE = 3,
    GENERAL_CHARACTERISTICS = 4,
    HIGH_ABILITIES = 5,
    CRIATIVITY = 6,
    TASK_COMMITMENT = 7,
    LEADERSHIP = 8,
    ARTISTIC_ACTIVITIES = 9,
    AUTOBIOGRAPHY = 10,
    FINISHED = 11,
}

export enum EAdultFormGroup {
    GENERAL_CHARACTERISTICS = 0,
    HIGH_ABILITIES = 1,
    CRIATIVITY = 2,
    TASK_COMMITMENT = 3,
    LEADERSHIP = 4,
    ARTISTIC_ACTIVITIES = 5,
}

export const getAdultGroupSequenceByFormStep = (groupStep: EAdultFormSteps): EAdultFormGroup => {
    return groupStep - 4;
};
