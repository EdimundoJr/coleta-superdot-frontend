import { EQuestionType } from "../utils/consts.utils";

export default interface IQuestion {
    _id: string;
    statement: string;
    questionType: EQuestionType;
    options?: {
        value: string;
        points?: number;
    }[];
    required?: boolean;
    parentQuestion?: {
        parentId: string;
        isRequiredOnParentValue: string;
    };
    answer?: string | string[]; // Participant answer
}
