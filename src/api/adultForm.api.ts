import IQuestion from "../interfaces/question.interface";
import IQuestionsGroup from "../interfaces/questionsGroup.interface";
import { AcceptSampleFile } from "../interfaces/sample.interface";
import { EAdultFormSteps } from "../pages/AdultForm/AdultForm";
import { EAdultFormGroup, EAdultFormSource } from "../utils/consts.utils";
import { setAuthHeaders } from "../utils/tokensHandler";
import axios from "axios";

/** SAMPLE FILES */
interface IRequiredDoc {
    jsonFileKey: string;
    backendFileName: string;
    label: string;
    url?: string;
}

// Get to retrieve all docs from sample that required a participant acceptation
export const getAllSampleRequiredDocs = async (sampleId: string) => {
    setAuthHeaders();
    return axios.get<IRequiredDoc[]>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/listRequiredDocs/${sampleId}`);
};

export enum QuestionType {
    FIVE_OPTIONS = 0,
    FOUR_INPUTS = 1,
    MULTIPLE_OPTIONS = 2,
}

/** GET QUESTIONS BY GROUP */

export const getAllGroupQuestionsByFormStep = (formStep: EAdultFormSteps, formSource: EAdultFormSource) => {
    // Converting the form step to group sequence
    // Form Step 4 -> Group Sequence 0
    // Form Step 5 -> Group Sequence 1
    const groupSequence = formStep - 4;
    return axios.get<IQuestionsGroup>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/adultForm/allQuestionsByGroup/${groupSequence}/source/${formSource}`
    );
};

/** SUBMIT QUESTIONS BY GROUP */

export const patchQuestionsAnswersByGroup = (
    sampleId: string,
    groupQuestionsAndAnswers: IQuestionsGroup,
    participantId?: string
) => {
    return axios.patch<IQuestionsGroup | boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/adultForm/submitGroupQuestions/sample/${sampleId}${
            participantId ? "/participant/" + participantId : ""
        }`,
        groupQuestionsAndAnswers
    );
};
