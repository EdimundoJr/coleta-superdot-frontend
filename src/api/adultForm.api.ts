import { AdultFormFamilyAndAddressInfoValues } from "../schemas/adultForm/familyAddressInfo.schema";
import { AdultFormPersonalInfoValues } from "../schemas/adultForm/personalInfo.schema";
import { AcceptSampleFile } from "../interfaces/sample.interface";
import { Relationships } from "../utils/consts.utils";

interface axiosExample3 {
    status: number;
    data: boolean;
}

/** FAMILY AND ADDRESS */
// Update the form fill with the address and family participant info
export const saveFamilyAndAddresInfo = async (
    sampleId: string,
    participantId: string,
    info: AdultFormFamilyAndAddressInfoValues
): Promise<axiosExample3> => {
    return { status: 200, data: true };
};

interface axiosExample4 {
    status: number;
    data: string;
}

/** PERSONAL INFO */
// Create a new participant object in the sample and return the participant id.
export const savePersonalInfo = async (sampleId: string, info: AdultFormPersonalInfoValues): Promise<axiosExample4> => {
    return {
        status: 200,
        data: "123",
    };
};

interface axiosExample1 {
    status: number;
    data: AcceptSampleFile[];
}

/** SAMPLE FILES */
// Get to retrieve all docs from sample that required a participant acceptation
export const getDocs = async (sampleId: string): Promise<axiosExample1> => {
    return {
        data: [
            {
                jsonFileKey: "tcleDoc",
                backendFileName: "teste.pdf",
                label: "Termo de Compromisso Livre e Esclarecido",
            },
            {
                jsonFileKey: "taleDoc",
                backendFileName: "teste2.pdf",
                label: "Termo de Anuência Livre e Esclarecido",
            },
        ],
        status: 200,
    };
};

interface axiosExample2 {
    status: number;
    data: boolean;
}

// Updating the backend to save the info that the participant accepted the docs
export const acceptDocs = async (
    sampleId: string,
    participantId: string,
    docs: AcceptSampleFile[]
): Promise<axiosExample2> => {
    return { status: 200, data: true };
};

/** SECOND SOURCE */

export interface ISecondSource {
    relationship: Relationships;
    fullName: string;
    email: string;
    teacherSubject: string;
}

export const indicateSecondSources = async (
    sampleId: string,
    participantId: string,
    secondSources: ISecondSource[]
): Promise<axiosExample2> => {
    return { status: 200, data: true };
};

export enum QuestionType {
    FIVE_OPTIONS = 0,
    FOUR_INPUTS = 1,
    MULTIPLE_OPTIONS = 2,
}

interface IQuestions {
    _id: string;
    number: number;
    statement: string;
    type: QuestionType;
    options?: string[];
}

interface axiosExample5 {
    status: number;
    data: IQuestions[];
}

/** GET QUESTIONS BY GROUP */

export enum AdultFormGroup {
    GENERAL_CHARACTERISTICS = "Características Gerais",
    HIGH_ABILITIES = "Habilidade Acima da Média",
    CRIATIVITY = "Criatividade",
    TASK_COMMITMENT = "Comprometimento da Tarefa",
    LEADERSHIP = "Liderança",
    ARTISTIC_ACTIVITIES = "Atividades Artísticas e Esportivas",
}

export const getQuestionsByGroup = async (groupName: AdultFormGroup): Promise<axiosExample5> => {
    return {
        status: 200,
        data: [
            {
                _id: "1",
                number: 5,
                statement: "Com quantos anos você começou a ler (Não só o seu nome, mas frases)?",
                type: 0,
                options: ["3 anos ou menos", "4 anos", "5 anos", "6 anos", "7 anos ou mais"],
            },
            {
                _id: "2",
                number: 6,
                statement: "Le por seu próprio interesse? Quantas horas/semana?",
                type: 0,
                options: [
                    "Não leio",
                    "Sim, entre 1 e 2 horas",
                    "Sim, entre 2 e 4 horas",
                    "Sim, entre 4 e 6 horas",
                    "Sim, mais de 6 horas",
                ],
            },
            {
                _id: "3",
                number: 7.1,
                statement: "Sobre quais assuntos mais gosta de conversar? (Informe 4 opções por favor)",
                type: 1,
            },
            {
                _id: "4",
                number: 7.2,
                statement: "Sobre quais assuntos mais gosta de estudar? (Informe 4 opções por favor)",
                type: 1,
            },
            {
                _id: "5",
                number: 7.3,
                statement: "Quais as atividades que mais gosta de fazer? (Informe 4 opções por favor)",
                type: 1,
            },
            {
                _id: "6",
                number: 8,
                statement: "Que idade têm seus/suas 4 melhores amigos/as?",
                type: 1,
            },
            {
                _id: "7",
                number: 9.1,
                statement:
                    "Em quais áreas você era ou é um/uma dos/das melhores da sua turma? Indique as 4 primeiras, por ordem de importância",
                type: 2,
                options: [
                    "Memória",
                    "Dança",
                    "História",
                    "Química",
                    "Física",
                    "Pintura",
                    "Biologia",
                    "Esportes",
                    "Astronomia",
                    "Liderança",
                    "Música",
                    "Criatividade",
                    "Cinema",
                    "Observação",
                    "Matemática",
                    "Abstração",
                    "Comunicação",
                    "Português",
                    "Planejamento",
                    "Fotografia",
                    "Geogradfia",
                    "Línguas estrangeiras",
                    "Escultura",
                    "Política",
                    "Mitologia",
                    "Arqueologia",
                    "Outro",
                ],
            },
            {
                _id: "9",
                number: 10,
                statement: "Sente-se deslocado/a ou percebe-se diferente das demais pessoas no pensar, sentir ou agir?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "10",
                number: 11,
                statement: "Prefere trabalhar/estudar/treinar/praticar sozinho(a)",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "11",
                number: 12,
                statement:
                    "Quando criança você preferia ler livros mais dificeis, ou enciclopédias, biografias ou atlas?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "12",
                number: 13,
                statement: "É independente na sua forma de pensar e agir?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "13",
                number: 14,
                statement:
                    "Tem senso de humor e às vezes encontra humor em stuações que não são humorísticas para os demais",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "14",
                number: 15,
                statement: "Preocupa-se muito com questões éticas, morais, sociais, politicas ou ambientais?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "15",
                number: 16,
                statement: "É perfeccionista?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "16",
                number: 17,
                statement: "É mais observador/a que as demais pessoas, percebendo coisas que os demais não percebem?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "17",
                number: 18,
                statement: "Gosta e prefere jogar xadrez ou jogos que exijam estratégia?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "18",
                number: 19,
                statement: "Tem principios éticos e morais próprios que aplica a todas suas ações e pensamentos?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "19",
                number: 20,
                statement: "Considera seu conceito de amizade ou seu(s) amigo(s) diferentes ao das demais pessoas?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "20",
                number: 21,
                statement: "É intolerante com pessoas ou atitudes que você não considera corretas ou adequadas?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "21",
                number: 22,
                statement:
                    "Quando criança preferia ter amigos mais velhos e/ou mais novos que você a amigos da sua idade?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
        ],
    };
};

interface axiosExample6 {
    status: number;
    data: boolean | IQuestions[];
}

export interface QuestionsAndAnswers {
    _id: string;
    number: number;
    statement: string;
    type: QuestionType;
    options?: string[];
    answer?: string | string[];
    otherAnswerValue?: string[];
}

export const submitQuestionsByGroup = async (
    questionsAndAnswers: QuestionsAndAnswers[],
    groupName: AdultFormGroup
): Promise<axiosExample6> => {
    return {
        status: 200,
        data: [
            {
                _id: "22",
                number: 23,
                statement:
                    "Tem memória muito destacada, especialmente em assuntos que lhe interessam, comparado a outras pessoas de sua idade?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "23",
                number: 24,
                statement: "Tem muitas informações sobre os temas que são de seu interesse?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "24",
                number: 25,
                statement:
                    "Tem vocabulário muito mais avançado e rico que seus colegas ou demais pessoas de sua idade, especialmente em relação a temas de interesse?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "25",
                number: 26,
                statement: "Tenta entender coisas complicadas examinando-as parte por parte?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "26",
                number: 27,
                statement: "Aprende rapidamente as relações entre as partes e todo?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "27",
                number: 28,
                statement: "Percebe rapidamente as relações entre as partes e o todo?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "28",
                number: 29,
                statement: "Normalmente aprende mais de uma história, um filme, etc do que as outras pessoas?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "29",
                number: 30,
                statement: "Tenta descobrir o 'como' e o 'porquê' das coisas fazendo perguntas inteligentes?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "30",
                number: 31,
                statement: "Suas notas ou conceitos na escola eram melhores que as dos demais colegas de sua turma?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "31",
                number: 32,
                statement: "Aprende mais rápido que as demais pessoas, especialmente aquilo que lhe interessa?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "32",
                number: 33,
                statement: "Adapta-se facilmente a situações novas ou as modifica?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
            {
                _id: "33",
                number: 34,
                statement: "Tem um pensamento abstrato muito desenvolvido?",
                type: 0,
                options: ["Nunca", "Raramente", "Ás vezes", "Frequentemente", "Sempre"],
            },
        ],
    };
};

interface axiosExample7 {
    status: number;
    data: boolean;
}

export const submitAutobiography = async (
    autobiographyText: string,
    autobiographyVideo: string
): Promise<axiosExample7> => {
    return {
        status: 200,
        data: true,
    };
};
