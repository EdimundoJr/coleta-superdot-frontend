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

interface SaveGiftdnessIndicatorsByResearcherParams {
    sampleId: string;
    participantId: string;
    giftdnessIndicatorsByResearcher: boolean;
    submitForm?: boolean;
}



export const patchSaveGiftdnessIndicatorsByResearcher = async ({
    sampleId,
    participantId,
    giftdnessIndicatorsByResearcher,
    submitForm,
}: SaveGiftdnessIndicatorsByResearcherParams) => {
    const response = await axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-giftdness-indicators-by-researcher/sample/${sampleId}/participant/${participantId}?submitForm=${String(submitForm)}`,
        { giftdnessIndicatorsByResearcher }
    );
    return response.data;
};

interface SaveKnowledgeAreasIndicatedByResearcherParams {
    sampleId: string;
    participantId: string;
    knowledgeAreasIndicatedByResearcher: {
        general: string[];
        specific: string[];
    };
    submitForm?: boolean;
}

export const patchSaveKnowledgeAreasIndicatedByResearcher = async ({
    sampleId,
    participantId,
    knowledgeAreasIndicatedByResearcher,
    submitForm,
}: SaveKnowledgeAreasIndicatedByResearcherParams) => {

    const response = await axios.patch<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-knowledge-areas-indicated-by-researcher/sample/${sampleId}/participant/${participantId}?submitForm=${String(submitForm)}`,
        { knowledgeAreasIndicatedByResearcher }
    );
    return response.data;
};
export interface MarkedText {
    id: number;
    text: string;
    comment: string;
    mark: string;
    start: number;
    end: number;
    background: string;
}

// Modifique a interface dos parâmetros
interface PatchSaveEvalueAutobiographyParams {
    sampleId?: string;
    participantId?: string;
    markedTexts: MarkedText[];
    submitForm?: boolean;
}

export const patchSaveEvalueAutobiography = async ({
    sampleId,
    participantId,
    markedTexts,
    submitForm,
}: PatchSaveEvalueAutobiographyParams): Promise<boolean> => {
    try {
        const response = await axios.patch<boolean>(
            `${import.meta.env.VITE_BACKEND_HOST}/api/participant/save-evalueAutobiography/sample/${sampleId}/participant/${participantId}?submitForm=${String(submitForm)}`,
            { markedTexts }
        );
        return response.data;
    } catch (error) {
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
