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
        occupation: string;
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
        endFillFormAt?: Date;
        startFillFormAt?: Date;
        answersByGroup?: { groupName: string; sequence: EAdultFormGroup; questions: IQuestion[] }[];
    };
    teacherSubject?: string;
    createdAt?: string;
}
