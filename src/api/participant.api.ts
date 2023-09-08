import axios from "axios";
import { EAdultFormSteps } from "../pages/AdultForm/AdultForm";
import { ParticipantDataValues } from "../schemas/adultForm/participantData.schema";
import { ISecondSource } from "../interfaces/secondSource.interface";

interface requestVerificationCodeParams {
    participantEmail: string;
    sampleId: string;
    startFilling: boolean;
}

export const requestVerificationCode = async ({
    participantEmail,
    sampleId,
    startFilling,
}: requestVerificationCodeParams) => {
    return axios.post<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/verifyParticipantEmail/sample/${sampleId}`,
        { participantEmail: participantEmail, startFilling }
    );
};

/** VALIDATE VERIFICATION CODE */
interface validateVerificationCodeParams {
    participantEmail: string;
    sampleId: string;
    verificationCode: number;
    startFilling: boolean;
}

export interface CodeValidated {
    participantToken: string;
    adultFormStepToReturn: EAdultFormSteps;
}

export const validateVerificationCode = async ({
    participantEmail,
    sampleId,
    verificationCode,
    startFilling,
}: validateVerificationCodeParams) => {
    return axios.patch<CodeValidated>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/validateVerificationCode/sample/${sampleId}`,
        {
            participantEmail,
            verificationCode,
            startFilling,
        }
    );
};

/** SAVE PARTICIPANT DATA */
interface PostParticipantDataParams {
    sampleId: string;
    participantData: ParticipantDataValues;
}

export const postParticipantData = async ({ sampleId, participantData }: PostParticipantDataParams) => {
    return axios.post<string>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/submitParticipantData/sample/${sampleId}`,
        participantData
    );
};

// Updating the backend to save the info that the participant accepted the docs
export const patchAcceptAllSampleDocs = async (sampleId: string) => {
    return axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/acceptAllSampleDocs/sample/${sampleId}`
    );
};

export const postIndicateSecondSources = async (sampleId: string, secondSources: ISecondSource[]) => {
    return axios.post<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/indicateSecondSources/sample/${sampleId}`,
        { secondSources }
    );
};

interface submitAutobiographyParams {
    sampleId: string;
    autobiographyText: string;
    autobiographyVideo: string;
}

export const submitAutobiography = async ({
    sampleId,
    autobiographyText,
    autobiographyVideo,
}: submitAutobiographyParams) => {
    return axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/submitAutobiography/sample/${sampleId}`,
        { autobiographyText, autobiographyVideo }
    );
};
