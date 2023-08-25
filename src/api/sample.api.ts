import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";
import { FormFillStatusType, InstituitionType, SampleStatus, brazilRegionsType } from "../utils/consts.utils";
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
    return axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${fileName}`, {
        responseType: "blob",
    });
};

export const deleteSample = async (sampleId: string | undefined) => {
    setAuthHeaders();
    return axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/deleteSample/${sampleId}`);
};

export interface ParticipantFormSummary {
    _id: string;
    fullName: string;
    formFillStatus: FormFillStatusType;
    qttSecondSources: number;
    formFillStartDate: string;
    formFillEndDate?: string;
    giftednessIndicators?: boolean;
}

export interface AxiosExample {
    status: number;
    data: Page<ParticipantFormSummary>;
}

export const paginateParticipantFormSummary = async (sampleId: string): Promise<AxiosExample> => {
    setAuthHeaders();
    return {
        status: 200,
        data: {
            pagination: {
                totalItems: 3,
                page: 1,
            },
            data: [
                {
                    _id: "1",
                    fullName: "Fulano de Tal",
                    formFillStatus: "Preenchendo",
                    qttSecondSources: 0,
                    formFillStartDate: "2022-12-14",
                    formFillEndDate: undefined,
                    giftednessIndicators: undefined,
                },
                {
                    _id: "2",
                    fullName: "Beltrano de Tal",
                    formFillStatus: "Aguardando 2ª fonte",
                    qttSecondSources: 1,
                    formFillStartDate: "2022-12-16",
                    formFillEndDate: undefined,
                    giftednessIndicators: undefined,
                },
                {
                    _id: "3",
                    fullName: "Cicrano de Tal",
                    formFillStatus: "Finalizado",
                    qttSecondSources: 3,
                    formFillStartDate: "2022-12-10",
                    formFillEndDate: "2022-12-19",
                    giftednessIndicators: true,
                },
            ],
        },
    };
};
