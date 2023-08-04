import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";
import { InstituitionType, SampleStatus, brazilRegionsType } from "../utils/consts.utils";
import { MySamplesFilters } from "../schemas/mySample.schema";
import { ISampleReview } from "./sampleReview.api";

export const createSample = async (sampleData: FormData) => {
    setAuthHeaders();
    return axios.post<SampleValues>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/newSample`, sampleData);
};

export const editSample = async (sampleId: string | undefined, newSampleData: FormData) => {
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

export default interface ISample {
    _id?: string;
    researchTitle: string;
    sampleTitle: string;
    sampleGroup: string;
    qttParticipantsRequested: number;
    qttParticipantsAuthorized?: number;
    qttParticipantsRegistered: number;
    researchCep: {
        cepCode: string;
        researchDocument?: string;
        tcleDocument?: string;
        taleDocument?: string;
    };
    status?: SampleStatus;
    countryRegion: brazilRegionsType;
    countryState: string;
    countryCity: string;
    instituition: {
        name: string;
        instType: InstituitionType;
    };
    reviews?: [ISampleReview];
    participants?: [];
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;
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

export interface PageSample {
    pagination?: {
        totalItems: number;
        page: number;
    };
    data?: ISample[];
}

export const paginateSamples = async (currentPage: number, itemsPerPage: number, filters?: MySamplesFilters) => {
    setAuthHeaders();
    return axios.get<PageSample>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample/paginate/${itemsPerPage}/page/${currentPage}?researchTitle=${
            filters?.researcherTitle || ""
        }&sampleTitle=${filters?.sampleTitle || ""}`
    );
};

export const seeAttachment = async (fileName: string) => {
    setAuthHeaders();
    return axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${fileName}`, {
        responseType: "blob",
    });
};

export const deleteSample = async (sampleId: string | undefined) => {
    setAuthHeaders();
    return axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/deleteSample/${sampleId}`);
};
