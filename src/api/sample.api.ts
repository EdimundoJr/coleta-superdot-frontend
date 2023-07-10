import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";
import { SampleStatus } from "../utils/consts.utils";

export const FILES_TO_UPLOAD = [
    {
        key: "research_cep[research_document]",
        label: "Projeto de pesquisa",
    },
    {
        key: "research_cep[tcle_document]",
        label: "TCLE",
    },
    {
        key: "research_cep[tale_document]",
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

export interface Page {
    pagination: {
        totalItems: number;
        page: 1;
    };
    data: [SampleSummary];
}

export const paginateAllSamples = async (currentPage: number, itemsPerPage: number, filterStatus = "") => {
    setAuthHeaders();
    return axios.get<Page>(
        `${
            import.meta.env.VITE_BACKEND_HOST
        }/api/sample/paginateAll/${itemsPerPage}/page/${currentPage}?status=${filterStatus}`
    );
};

export const seeAttachment = async (fileName: string) => {
    setAuthHeaders();
    return axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${fileName}`, {
        responseType: "blob",
    });
};
