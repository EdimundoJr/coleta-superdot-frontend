import axios from "axios";
import { ParticipantDataDTO } from "../schemas/adultForm/participantData.schema";
import { ISecondSource } from "../interfaces/secondSource.interface";
import { IParticipant } from "../interfaces/participant.interface";
import { setAuthHeaders } from "../utils/tokensHandler";
import { DeepPartial } from "react-hook-form";

interface PostSendVerificationCodeParams {
    participantEmail: string;
    sampleId: string;
}

export const postSendVerificationCode = async ({ participantEmail, sampleId }: PostSendVerificationCodeParams) => {
    return axios.post<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/send-verification-code/sample/${sampleId}`,
        { participantEmail: participantEmail }
    );
};

interface ValidateVerificationCodeParams {
    participantId: string;
    sampleId: string;
    verificationCode: string;
}

interface ValidateVerificationCodeReturn {
    token: string;
    participant: IParticipant;
    researcherName: string;
}

export const patchValidateVerificationCode = async ({
    participantId,
    sampleId,
    verificationCode,
}: ValidateVerificationCodeParams) => {
    return axios.patch<ValidateVerificationCodeReturn>(
        `${import.meta.env.VITE_BACKEND_HOST
        }/api/participant/validate-verification-code/sample/${sampleId}/participant/${participantId}/code/${verificationCode}`
    );
};

interface ParticipantDataParams {
    sampleId: string;
    participantData: ParticipantDataDTO;
}

export const putSaveParticipantData = async ({ sampleId, participantData }: ParticipantDataParams) => {
    return axios.put<string>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-participant-data/sample/${sampleId}`,
        participantData
    );
};

export const putSubmitParticipantData = async ({ sampleId, participantData }: ParticipantDataParams) => {
    return axios.put<string>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/submit-participant-data/sample/${sampleId}`,
        participantData
    );
};

export const patchAcceptAllSampleDocs = async ({ sampleId }: { sampleId: string }) => {
    return axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/accept-all-sample-docs/sample/${sampleId}`
    );
};
interface PutSaveSecondSourcesParams {
    sampleId: string;
    secondSources: DeepPartial<ISecondSource>[];
}
export const putSaveSecondSources = async ({ sampleId, secondSources }: PutSaveSecondSourcesParams) => {
    return axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-second-sources/sample/${sampleId}`,
        { secondSources }
    );
};

interface PatchSaveAutobiographyParams {
    sampleId: string;
    autobiographyText: string;
    autobiographyVideo: string;
    submitForm?: boolean;
}

export const patchSaveAutobiography = async ({
    sampleId,
    autobiographyText,
    autobiographyVideo,
    submitForm,
}: PatchSaveAutobiographyParams) => {
    return axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-autobiography/sample/${sampleId}?submitForm=${String(
            submitForm
        )}`,
        { autobiographyText, autobiographyVideo }
    );
};




interface PatchSaveEvalueAutobiographyParams {
    sampleId?: string;
    participantId?: string;
    idEvalueAutobiography?: number;
    textEvalueAutobiography?: string;
    commentEvalueAutobiography?: string;
    markEvalueAutobiography?: string;
    startEvalueAutobiography?: number;
    endEvalueAutobiography?: number;
    backgroundEvalueAutobiography?: string;
    submitForm?: boolean;
}

export const patchSaveEvalueAutobiography = async ({
    sampleId,
    participantId,
    idEvalueAutobiography,
    textEvalueAutobiography,
    commentEvalueAutobiography,
    markEvalueAutobiography,
    startEvalueAutobiography,
    endEvalueAutobiography,
    backgroundEvalueAutobiography,
    submitForm,
}: PatchSaveEvalueAutobiographyParams): Promise<boolean> => {
    try {
        console.log("Sending data:", {
            sampleId,
            participantId,
            idEvalueAutobiography,
            textEvalueAutobiography,
            commentEvalueAutobiography,
            markEvalueAutobiography,
            startEvalueAutobiography,
            endEvalueAutobiography,
            backgroundEvalueAutobiography,
            submitForm
        });

        const response = await axios.patch<boolean>(
            `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-evalueAutobiography/sample/${sampleId}/participant/${participantId}?submitForm=${String(submitForm)}`,
            {
                idEvalueAutobiography,
                textEvalueAutobiography,
                commentEvalueAutobiography,
                markEvalueAutobiography,
                startEvalueAutobiography,
                endEvalueAutobiography,
                backgroundEvalueAutobiography
            }
        );

        console.log("Response data:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error saving evalue autobiography:", error);
        throw error;
    }
};


interface GetParticipantDataParams {
    sampleId: string;
}
export const getParticipantData = async ({ sampleId }: GetParticipantDataParams) => {
    setAuthHeaders();
    return axios.get<IParticipant>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/get-participant-info/sample/${sampleId}`
    );
};


interface GetParticipantDataBioParams {
    sampleId?: string;
    participantId?: string;
}

export const getParticipantDataBio = async ({ sampleId, participantId }: GetParticipantDataBioParams) => {
    setAuthHeaders();
    return axios.get<IParticipant>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/get-participant-info-bio/sample/${sampleId}/participant/${participantId}`
    );
};
