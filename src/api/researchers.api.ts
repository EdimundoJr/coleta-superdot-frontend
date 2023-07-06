import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";

export interface ResearchersPaginated {
    researchers: [{ _id: string; personal_data: { full_name: string }; email: string }];
    totalResearchers: number;
}

export interface Filters {
    userName?: string;
    userEmail?: string;
}

export const PAGE_SIZE = 10;

export const paginateResearcher = async (currentPage: number, itemsPerPage: number, filters?: Filters) => {
    setAuthHeaders();
    return axios.get<ResearchersPaginated>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/researcher/paginate/${itemsPerPage}/page/${currentPage}?user_name=${
            filters?.userName || ""
        }&user_email=${filters?.userEmail || ""}`
    );
};
