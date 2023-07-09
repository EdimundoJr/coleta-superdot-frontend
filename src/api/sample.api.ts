import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleValues } from "../schemas/sample.schema";

export const FILES_TO_UPLOAD = [
    {
        key: "research_cep[research_document]",
        label: "Projeto de pesquisa",
        required: true,
    },
    {
        key: "research_cep[tcle_document]",
        label: "TCLE",
        required: true,
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
