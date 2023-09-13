import axios from "axios";
import { EAdultFormSteps } from "../pages/AdultForm/AdultForm";
import { SecondSourceValues } from "../schemas/adultForm/secondSourceData.schema";

interface requestVerificationCodeParams {
    secondSourceEmail: string;
    sampleId: string;
    participantId: string;
    startFilling: boolean;
}

export const requestVerificationCode = async ({
    secondSourceEmail,
    sampleId,
    participantId,
    startFilling,
}: requestVerificationCodeParams) => {
    return axios.post<boolean>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/secondSource/verifySecondSourceEmail/sample/${sampleId}/participant/${participantId}`,
        { secondSourceEmail: secondSourceEmail, startFilling }
    );
};

/** VALIDATE VERIFICATION CODE */
interface validateVerificationCodeParams {
    secondSourceEmail: string;
    participantId: string;
    verificationCode: number;
}

interface CodeValidated {
    participantToken: string;
    adultFormStepToReturn: EAdultFormSteps;
}

export const validateVerificationCode = async ({
    secondSourceEmail,
    participantId,
    verificationCode,
}: validateVerificationCodeParams) => {
    return axios.patch<CodeValidated>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/secondSource/validateSecondSourceVerificationCode/participant/${participantId}`,
        {
            secondSourceEmail,
            verificationCode,
        }
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
