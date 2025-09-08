import { EAdultFormGroup, TEducationLevel, TRelationship, TRelationshipTime } from "../utils/consts.utils";
import IQuestion from "./question.interface";

export interface ISecondSource {
    _id?: string;
    personalData: {
        email: string;
        fullName: string;
        birthDate: Date;
        relationship: TRelationship;
        relationshipTime: TRelationshipTime;
        job: string;
        street: string;
        district: string;
        countryCity: string;
        phone: string;
        educationLevel: TEducationLevel;
    };
    verification?: {
        code: string;
        generatedAt: Date;
    };
    acceptTcleAt?: Date;
    acceptTaleAt?: Date;
    adultForm?: {
        endFillFormAt?: string;
        startFillFormAt?: string;
        answersByGroup?: { groupName: string; sequence: EAdultFormGroup; questions: IQuestion[] }[];
        totalPunctuation?: number;
    };
    teacherSubject?: string;
    createdAt?: string;
}
