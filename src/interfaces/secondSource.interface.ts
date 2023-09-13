import { EAdultFormSteps } from "../pages/AdultForm/AdultForm";
import { Relationships, TEducationLevel } from "../utils/consts.utils";

export interface ISecondSource {
    _id?: string;
    personalData: {
        fullName: string;
        email: string;
        birthDate?: Date;
        relationship: Relationships;
        job?: string;
        occupation?: string;
        phone?: string;
        educationLevel?: TEducationLevel;
    };
    teacherSubject?: string;
    adultFormCurrentStep?: EAdultFormSteps;
    createdAt?: string;
    endFillFormDate?: string;
}
