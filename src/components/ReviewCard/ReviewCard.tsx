import { DateTime } from "luxon";
import { SampleReviewWithReviewerName } from "../../api/sampleReview.api";

const ReviewCard = ({ reviewerFullName, reviewDetails }: SampleReviewWithReviewerName) => {
    return (
        <div className="my-4 p-4 border-2 border-[#baa7ff] bg-[#f9f6ffcc]  text-black  font-roboto rounded-xl">
            <ul>
                <li>Revisor: {reviewerFullName}</li>
                <li>
                    Data e hora da revisão:
                    {reviewDetails.createdAt &&
                        DateTime.fromISO(reviewDetails.createdAt || "").toFormat("dd/LL/yyyy - HH:mm")}
                </li>
                <li>Quantidade de participantes autorizados: {reviewDetails.qttParticipantsAuthorized}</li>
                <li>Status anterior: {reviewDetails.previousStatus}</li>
                <li>Status posterior: {reviewDetails.nextStatus}</li>
                <li>Mensagem do revisor: {reviewDetails.reviewMessage}</li>
            </ul>
        </div>
    );
};

export default ReviewCard;
