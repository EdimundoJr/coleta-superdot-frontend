import { EQuestionType } from "../utils/consts.utils";

export default interface IQuestion {
    _id: string;
    sequence: number;
    statement: string;
    questionType: EQuestionType;
    options?: string[];
    notRequired?: boolean
    answer?: string | string[]; // Participant answer
}
