import IQuestionsGroup from "../interfaces/questionsGroup.interface";
import { AcceptSampleFile } from "../interfaces/sample.interface";
import { EAdultFormSource, EAdultFormSteps, getAdultGroupSequenceByFormStep } from "../utils/consts.utils";
import { setAuthHeaders } from "../utils/tokensHandler";
import axios from "axios";

// Get to retrieve all docs from sample that required a participant acceptation
export const getAllSampleRequiredDocs = async (sampleId: string) => {
    setAuthHeaders();
    return axios.get<AcceptSampleFile[]>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample/listRequiredDocs/${sampleId}`
    );
};

export enum QuestionType {
    FIVE_OPTIONS = 0,
    FOUR_INPUTS = 1,
    MULTIPLE_OPTIONS = 2,
}

/** GET QUESTIONS BY GROUP */

export const getQuestionsByFormStep = (formStep: EAdultFormSteps, formSource: EAdultFormSource) => {
    const groupSequence = getAdultGroupSequenceByFormStep(formStep);
    return axios.get<IQuestionsGroup>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/adultForm/questions-by-group/${groupSequence}/source/${formSource}`
    );
};

/** SAVE QUESTIONS BY GROUP */

export const patchSaveQuestionsByGroup = (sampleId: string, groupQuestionsAndAnswers: IQuestionsGroup) => {
    return axios.patch<IQuestionsGroup | boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/adultForm/save-questions-by-group/sample/${sampleId}`,
        groupQuestionsAndAnswers
    );
};
