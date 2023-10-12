import axios from "axios";
import { SecondSourceDTO } from "../schemas/adultForm/secondSourceData.schema";
import { ISecondSource } from "../interfaces/secondSource.interface";
import { setAuthHeaders } from "../utils/tokensHandler";

interface PostSendVerificationCodeParams {
    secondSourceEmail: string;
    sampleId: string;
    participantId: string;
}

export const postSendVerificationCode = async ({
    secondSourceEmail,
    sampleId,
    participantId,
}: PostSendVerificationCodeParams) => {
    return axios.post<boolean>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/second-source/send-verification-code/sample/${sampleId}/participant/${participantId}`,
        { secondSourceEmail: secondSourceEmail }
    );
};

interface PatchValidateVerificationCodeParams {
    secondSourceId: string;
    participantId: string;
    sampleId: string;
    verificationCode: string;
}

export const patchValidateVerificationCode = async ({
    secondSourceId,
    participantId,
    sampleId,
    verificationCode,
}: PatchValidateVerificationCodeParams) => {
    return axios.patch<{ token: string; secondSource: ISecondSource }>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/second-source/validate-verification-code/sample/${sampleId}/participant/${participantId}/second-source/${secondSourceId}/code/${verificationCode}`
    );
};

interface SecondSourceDataParams {
    sampleId: string;
    secondSourceData: SecondSourceDTO;
}

export const putSaveSecondSourceData = async ({ sampleId, secondSourceData }: SecondSourceDataParams) => {
    setAuthHeaders(); // Setting JWT with participant and second source ID
    return axios.put<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/second-source/save-second-source-data/sample/${sampleId}`,
        secondSourceData
    );
};

export const putSubmitSecondSourceData = async ({ sampleId, secondSourceData }: SecondSourceDataParams) => {
    setAuthHeaders(); // Setting JWT with participant and second source ID
    return axios.put<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/second-source/submit-second-source-data/sample/${sampleId}`,
        secondSourceData
    );
};

// Updating the backend to save the info that the participant accepted the docs
export const patchAcceptAllSampleDocs = async (sampleId: string, participantId: string) => {
    return axios.patch<boolean>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/secondSource/acceptAllSampleDocs/sample/${sampleId}/participant/${participantId}`
    );
};
