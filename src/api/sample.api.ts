import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";
import { SampleStatus } from "../utils/consts.utils";
import { MySamplesFilters } from "../schemas/mySample.schema";
import { ISampleParticipantSummay } from "../interfaces/sampleParticipantSummary";
import { ISample } from "../interfaces/sample.interface";
import { IParticipant } from "../interfaces/participant.interface";
import { DeepPartial } from "react-hook-form";

export const createSample = async (sampleData: FormData) => {
    setAuthHeaders();
    return axios.post<SampleValues>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/newSample`, sampleData);
};

export const editSample = async (sampleId: string, newSampleData: FormData) => {
    setAuthHeaders();
    return axios.put<boolean>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample/updateSample/${sampleId}`,
        newSampleData
    );
};

export interface SampleSummary {
    researcherId: string;
    sampleId: string;
    sampleName: string;
    researcherName: string;
    cepCode: string;
    qttParticipantsRequested: number;
    qttParticipantsAuthorized?: number;
    currentStatus: SampleStatus;
    files: {
        researchDocument: string;
        tcleDocument: string;
        taleDocument: string;
    };
}

export interface PageSampleSummary {
    pagination: {
        totalItems: number;
        page: number;
    };
    data: [SampleSummary];
}

export const paginateAllSamples = async (currentPage: number, itemsPerPage: number, filterStatus = "") => {
    setAuthHeaders();
    return axios.get<PageSampleSummary>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/sample/paginateAll/${itemsPerPage}/page/${currentPage}?status=${filterStatus}`
    );
};

export interface Page<T> {
    pagination?: {
        totalItems: number;
        page: number;
    };
    data?: T[];
}

export const paginateSamples = async (currentPage: number, itemsPerPage: number, filters?: MySamplesFilters) => {
    setAuthHeaders();
    return axios.get<Page<ISample>>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample/paginate/${itemsPerPage}/page/${currentPage}?researchTitle=${
            filters?.researcherTitle || ""
        }&sampleTitle=${filters?.sampleTitle || ""}`
    );
};

export const seeAttachment = async (fileName: string) => {
    setAuthHeaders();
    return axios.get<Blob>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${fileName}`, {
        responseType: "blob",
    });
};

export const deleteSample = async (sampleId: string | undefined) => {
    setAuthHeaders();
    return axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/deleteSample/${sampleId}`);
};

export const getSampleParticipantRegistrationProgress = async (sampleId: string) => {
    setAuthHeaders();
    return axios.get<ISampleParticipantSummay[]>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample/participantRegistrationProgress/${sampleId}`
    );
};

interface PostAddParticipantsParams {
    sampleId: string;
    participants: DeepPartial<IParticipant>[];
}

export const postAddParticipants = async ({ sampleId, participants }: PostAddParticipantsParams) => {
    setAuthHeaders();
    return axios.post<boolean>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/add-participants/sample/${sampleId}`, {
        participants,
    });
};
