import axios from "axios";
import { SecondSourceValues } from "../schemas/adultForm/secondSourceData.schema";
import { ISecondSource } from "../interfaces/secondSource.interface";

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

/** SAVE PARTICIPANT DATA */
interface PostSecondSourceDataParams {
    sampleId: string;
    participantId: string;
    secondSourceData: SecondSourceValues;
}

export const postSecondSourceData = async ({
    sampleId,
    participantId,
    secondSourceData,
}: PostSecondSourceDataParams) => {
    return axios.post<string>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/secondSource/submitSecondSourceData/sample/${sampleId}/participant/${participantId}`,
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
