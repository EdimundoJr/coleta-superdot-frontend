import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";

export interface ResearchersPaginated {
    researchers: { _id: string; fullname: string; role: string; email: string }[];
    totalResearchers: number;
}

export interface Filters {
    userName?: string;
    userEmail?: string;
}

export interface Users {
    fullName: string,
    phone: string,
    profilePhoto: string,
    birthDate: Date,
    countryState: string,
}


export const PAGE_SIZE = 10;

export const paginateResearcher = async (currentPage: number, itemsPerPage: number, filters?: Filters) => {
    setAuthHeaders();
    return axios.get<ResearchersPaginated>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/researcher/paginate/${itemsPerPage}/page/${currentPage}?user_name=${filters?.userName || ""
        }&user_email=${filters?.userEmail || ""}`
    );
};

export const getResearcherNameBySampleId = (sampleId: string) => {
    setAuthHeaders();
    return axios.get<string>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/researcher/get-researcher-name-by-sample/${sampleId}`
    );
};

interface GetResearchDataBySampleIdAndParticipantIdParams {
    sampleId: string;
    participantId: string;
}

export const getResearchDataBySampleIdAndParticipantId = ({
    sampleId,
    participantId,
}: GetResearchDataBySampleIdAndParticipantIdParams) => {
    setAuthHeaders();
    return axios.get<{ researcherName: string; participantName: string }>(
        `${import.meta.env.VITE_BACKEND_HOST
        }/api/researcher/get-research-data-by/sample/${sampleId}/participant/${participantId}`
    );
};

export const getUser = async () => {
    try {
        setAuthHeaders();
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_HOST}/api/researcher/get-researcher`);

        console.log("Resposta da requisição para obter dados do pesquisador:", response.data);
        return response.data;
    } catch (error) {
        console.error("Erro ao fazer requisição para obter dados do pesquisador:", error);
        throw error;
    }
};
