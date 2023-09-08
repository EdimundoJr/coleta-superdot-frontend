import { EAdultFormGroup } from "../utils/consts.utils";
import IQuestion from "./question.interface";

export default interface IQuestionsGroup {
    groupName: string;
    sequence: EAdultFormGroup;
    questions: IQuestion[];
}
