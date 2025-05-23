import { DateTime } from "luxon";
import { SampleReviewWithReviewerName } from "../../api/sampleReview.api";
import { Badge } from "@radix-ui/themes";

const ReviewCard = ({ reviewerFullName, reviewDetails }: SampleReviewWithReviewerName) => {
    return (
        <div className="my-4 p-4 border-2 border-[#baa7ff] bg-[#f9f6ffcc] rounded-xl text-gray-700 text-sm font-roboto">
            <ul className="space-y-2">
                <li className="flex gap-2">
                    <span className="font-medium text-gray-900">Revisor:</span>
                    <span>{reviewerFullName}</span>
                </li>
                <li className="flex gap-2">
                    <span className="font-medium text-gray-900">Data e hora da revisão:</span>
                    <span>
                        {reviewDetails.createdAt &&
                            DateTime.fromISO(reviewDetails.createdAt || "").toFormat("dd/LL/yyyy - HH:mm")}
                    </span>
                </li>
                <li className="flex gap-2">
                    <span className="font-medium text-gray-900">Quantidade autorizada:</span>
                    <span>{reviewDetails.qttParticipantsAuthorized}</span>
                </li>
                <li className="flex gap-2">
                    <span className="font-medium text-gray-900">Status anterior:</span>
                    <span className="flex items-center">
                        {reviewDetails.previousStatus === "Autorizado" ? (
                            <Badge color="green" className="rounded-full px-2 py-0.5 text-xs">Autorizado</Badge>
                        ) : reviewDetails.previousStatus === "Pendente" ? (
                            <Badge color="orange" className="rounded-full px-2 py-0.5 text-xs">Pendente</Badge>
                        ) : (
                            <Badge color="red" className="rounded-full px-2 py-0.5 text-xs">{reviewDetails.previousStatus}</Badge>
                        )}
                    </span>
                </li>
                <li className="flex gap-2">
                    <span className="font-medium text-gray-900">Status posterior:</span>
                    <span className="flex items-center">
                        {reviewDetails.nextStatus === "Autorizado" ? (
                            <Badge color="green" className="rounded-full px-2 py-0.5 text-xs">Autorizado</Badge>
                        ) : reviewDetails.nextStatus === "Pendente" ? (
                            <Badge color="orange" className="rounded-full px-2 py-0.5 text-xs">Pendente</Badge>
                        ) : (
                            <Badge color="red" className="rounded-full px-2 py-0.5 text-xs">{reviewDetails.nextStatus}</Badge>
                        )}
                    </span>
                </li>
                <li className="flex flex-col gap-1">
                    <span className="font-medium text-gray-900">Mensagem do revisor:</span>
                    <div className="bg-white p-3 rounded-lg border border-gray-200 text-gray-700">
                        {reviewDetails.reviewMessage || "Nenhuma mensagem foi deixada pelo revisor."}
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default ReviewCard;
