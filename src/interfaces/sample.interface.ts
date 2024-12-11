import { ISampleReview } from "../api/sampleReview.api";
import { InstituitionType, SampleStatus, brazilRegionsType } from "../utils/consts.utils";
import { IParticipant } from "./participant.interface";

export interface SampleFile {
    key: string; // FormData field
    jsonFileKey?: string; // JSON backend field
    backendFileName?: string;
    label: string; // Display name to user
    required?: boolean;
    uploadedFile?: File;
}

export interface AcceptSampleFile {
    jsonFileKey: string;
    backendFileName: string;
    label: string;
    accepted?: boolean;
    url?: string;
}

export interface ISample {
    id: string;
    _id?: string;
    researchTitle: string;
    sampleTitle: string;
    sampleGroup: string;
    qttParticipantsRequested: number;
    qttParticipantsAuthorized?: number;
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
    reviews?: ISampleReview[];
    participants?: IParticipant[];
    approvedAt?: string;
    createdAt?: string;
    updatedAt?: string;
}
