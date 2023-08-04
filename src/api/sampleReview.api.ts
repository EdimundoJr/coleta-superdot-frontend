import axios from "axios";
import { setAuthHeaders } from "../utils/tokensHandler";
import { SampleStatus } from "../utils/consts.utils";

interface ReviewValues {
    sample_id: string;
    next_status: SampleStatus;
    qtt_participants_authorized?: number;
    review_message: string;
}

export const createReview = async (reviewData: ReviewValues) => {
    setAuthHeaders();
    return axios.post(`${import.meta.env.VITE_BACKEND_HOST}/api/sampleReview/newReview`, reviewData);
};

export interface ISampleReview {
    _id?: string;
    previous_status?: SampleStatus;
    next_status: SampleStatus;
    qtt_participants_authorized?: number;
    review_message: string;
    reviewer_id: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface SampleReviewWithReviewerName {
    review_details: ISampleReview;
    reviewer_full_name: string;
}

export const findReviewsBySampleId = async (sampleId: string) => {
    setAuthHeaders();
    return axios.get<SampleReviewWithReviewerName[]>(
        `${import.meta.env.VITE_BACKEND_HOST}/api/sampleReview/findReviews/${sampleId}`
    );
};
