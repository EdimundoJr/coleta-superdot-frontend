import { SampleReviewWithReviewerName } from "../../api/sampleReview.api";

const ReviewCard = ({ reviewer_full_name, review_details }: SampleReviewWithReviewerName) => {
    return (
        <div className="my-4 bg-blue-950 p-4 text-white">
            <ul>
                <li>Revisor: {reviewer_full_name}</li>
                <li>Data e hora da revisão: {review_details.createdAt?.toString()}</li>
                <li>Quantidade de participantes autorizados: {review_details.qtt_participants_authorized}</li>
                <li>Status anterior: {review_details.previous_status}</li>
                <li>Status posterior: {review_details.next_status}</li>
                <li>Mensagem do revisor: {review_details.review_message}</li>
            </ul>
        </div>
    );
};

export default ReviewCard;
