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

export const getQuestionsByFormStep = (formStep: EAdultFormSteps, formSource: EAdultFormSource) => {
    const groupSequence = getAdultGroupSequenceByFormStep(formStep);
    return axios.get<IQuestionsGroup>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/adult-form/questions-by-group/group-sequence/${groupSequence}/source/${formSource}`
    );
};

export const patchSaveQuestionsByGroup = (sampleId: string, groupQuestionsAndAnswers: IQuestionsGroup) => {
    setAuthHeaders();
    return axios.patch<IQuestionsGroup | boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/adult-form/save-questions-by-group/sample/${sampleId}`,
        groupQuestionsAndAnswers
    );
};

interface PatchSaveSecondSourceQuestionsByGroupParams {
    sampleId: string;
    groupQuestionsWithAnswers: IQuestionsGroup;
}

export const patchSaveSecondSourceQuestionsByGroup = ({
    sampleId,
    groupQuestionsWithAnswers,
}: PatchSaveSecondSourceQuestionsByGroupParams) => {
    setAuthHeaders();
    return axios.patch<IQuestionsGroup | boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/adult-form/save-second-source-questions-by-group/sample/${sampleId}`,
        groupQuestionsWithAnswers
    );
};
