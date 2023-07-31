import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";
import { InstituitionType, SampleStatus } from "../utils/consts.utils";
import { MySamplesFilters } from "../schemas/mySample.Schema";
import { ISampleReview } from "./sampleReview.api";

export const FILES_TO_UPLOAD = [
    {
        key: "researchCep[researchDocument]",
        label: "Projeto de pesquisa",
    },
    {
        key: "researchCep[tcleDocument]",
        label: "TCLE",
    },
    {
        key: "researchCep[taleDocument]",
        label: "TALE",
    },
];

export const createSample = async (sampleData: FormData) => {
    setAuthHeaders();
    return axios.post<SampleValues>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/newSample`, sampleData);
};

export interface SampleSummary {
    researcher_id: string;
    sample_id: string;
    sample_name: string;
    researcher_name: string;
    cep_code: string;
    qtt_participants_requested: number;
    qtt_participants_authorized?: number;
    currentStatus: SampleStatus;
    files: {
        research_document: string;
        tcle_document: string;
        tale_document: string;
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
    countryRegion: string;
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
            filters?.researcherTitle
        }&sampleTitle=${filters?.sampleTitle}`
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
