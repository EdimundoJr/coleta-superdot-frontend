import { TParticipantFormProgress } from "../utils/consts.utils";

export interface ISampleParticipantSummay {
    sampleId: string;
    participantId: string;
    fullName: string;
    progress: TParticipantFormProgress;
    qttSecondSources: number;
    startDate: string;
    endDate?: string;
    giftdnessIndicators?: boolean;
}
