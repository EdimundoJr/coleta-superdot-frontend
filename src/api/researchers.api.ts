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
    personalData: {
        fullName: string,
        phone: string,
        profilePhoto?: string,
        birthDate: Date,
        countryState: string
    },
    email: string,
    role: string,
    instituition?: string,
    createdAt?: Date,
    updatedAt?: Date
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
        const response = await axios.get<Users>(`${import.meta.env.VITE_BACKEND_HOST}/api/researcher/get-researcher`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export interface UpdateUserData {
    personalData?: {
        fullName?: string;
        profilePhoto?: string | null;
    };
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
}

export const updateUser = async (data: FormData) => {
    try {
        setAuthHeaders();
        const response = await axios.put<Users>(
            `${import.meta.env.VITE_BACKEND_HOST}/api/researcher/update-researcher`,
            data,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        throw error;
    }
};


