import { TFormFillStatus } from "../utils/consts.utils";

export interface ISampleParticipantSummay {
    sampleId: string;
    participantId: string;
    fullName: string;
    progress: TFormFillStatus;
    qttSecondSources: number;
    startDate: string;
    endDate?: string;
    giftdnessIndicators?: boolean;
}
