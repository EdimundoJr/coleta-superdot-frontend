import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleStatus } from "../utils/consts.utils";

interface ReviewValues {
    sampleId: string;
    nextStatus: SampleStatus;
    qttParticipantsAuthorized?: number;
    reviewMessage: string;
}

export const createReview = async (reviewData: ReviewValues) => {
    setAuthHeaders();
    return axios.post(`${import.meta.env.VITE_BACKEND_HOST}/api/sample-review/newReview`, reviewData);
};

export interface ISampleReview {
    _id?: string;
    previousStatus?: SampleStatus;
    nextStatus: SampleStatus;
    qttParticipantsAuthorized?: number;
    reviewMessage: string;
    reviewerId: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface SampleReviewWithReviewerName {
    reviewDetails: ISampleReview;
    reviewerFullName: string;
}

export const findReviewsBySampleId = async (sampleId: string) => {
    setAuthHeaders();
    return axios.get<SampleReviewWithReviewerName[]>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sample-review/findReviews/${sampleId}`
    );
};
