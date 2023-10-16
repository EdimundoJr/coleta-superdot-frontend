import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";

export interface SampleGroup {
    _id?: string;
    title: string;
    forms: [string];
    available: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export const findAllSampleGroups = async () => {
    setAuthHeaders();
    return axios.get<SampleGroup[]>(`${import.meta.env.VITE_BACKEND_HOST}/api/sample-group/findAll`);
};
