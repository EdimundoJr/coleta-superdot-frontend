import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";
import { SampleStatus } from "../utils/consts.utils";
import { MySamplesFilters } from "../schemas/mySample.schema";
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
        `${import.meta.env.VITE_BACKEND_HOST
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
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample/paginate/${itemsPerPage}/page/${currentPage}?researchTitle=${filters?.researcherTitle || ""
        }&sampleTitle=${filters?.sampleTitle || ""}`
    );
};


export const seeAttachment = async (fileName: string) => {
    setAuthHeaders();
    return axios.get<Blob>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${fileName}`, {
        responseType: "blob",
    });
};

export const seeAttachmentImage = async (fileName: string) => {
    setAuthHeaders();
    try {
        const response = await axios.get<Blob>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${fileName}`, {
            responseType: "blob",
        });

        if (response.status === 200) {
            const blob = new Blob([response.data], { type: response.headers["content-type"] });
            const imageUrl = URL.createObjectURL(blob);
            return imageUrl;
        } else {
            throw new Error("Erro ao recuperar o anexo");
        }
    } catch (error) {
        console.error("Erro ao recuperar o anexo:", error);
        throw error;
    }
};

export const deleteSample = async (sampleId: string | undefined) => {
    setAuthHeaders();
    return axios.delete(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/deleteSample/${sampleId}`);
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

export const getSampleById = async ({ sampleId }: { sampleId: string }) => {
    setAuthHeaders();
    return axios.get<ISample>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/get-sample-by-id/${sampleId}`);
};

export interface DashboardInfo {
    result: {
        count_female: number,
        count_male: number,
        total_unique_instituition: number,
        total_samples: number,
        total_participants: number
    }
}
export const getinfoDashboard = async () => {
    try {
        setAuthHeaders();
        const response = await axios.get<DashboardInfo>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/load-Information-dashboard`);

        return response.data;
    } catch (error) {
        console.error("Erro ao fazer requisição para obter dados: ", error);
        throw error;
    }
};
export interface AnswerByGender {
    result: {
        feminino: {
            frequentemente: number,
            sempre: number,
            asVezes: number,
            raramente: number,
            nunca: number
        },
        masculino: {
            frequentemente: number,
            sempre: number,
            asVezes: number,
            raramente: number,
            nunca: number
        }
    }
}

export const answerByGender = async () => {
    try {
        setAuthHeaders();
        const response = await axios.get<AnswerByGender>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample/answer-by-gender`);

        return response.data;
    } catch (error) {
        console.error("Erro ao fazer requisição para obter dados: ", error);
        throw error;
    }
};
