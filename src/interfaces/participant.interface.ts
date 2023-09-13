import { EAdultFormSteps } from "../pages/AdultForm/AdultForm";
import { TDevices, TEducationLevel, TGender, TIncomeLevel, TMaritalStatus } from "../utils/consts.utils";
import IQuestionsGroup from "./questionsGroup.interface";
import { ISecondSource } from "./secondSource.interface";

export interface IParticipant {
    _id?: string;
    personalData: {
        fullName: string;
        phone: string;
        email: string;
        maritalStatus: TMaritalStatus;
        job: string;
        occupation: string;
        educationLevel: TEducationLevel;
        gender: TGender;
        birthDate: Date;
    };
    familyData: {
        qttChildrens: number;
        qttSiblings: number;
        qttFamilyMembers: string;
        familyMonthIncome: TIncomeLevel;
        houseDevices?: TDevices[];
        outsideHouseDevices?: TDevices[];
    };
    addressData: {
        city: string;
        district: string;
        street: string;
        houseNumber: string;
    };
    acceptTcle?: boolean;
    acceptTale?: boolean;
    secondSources?: ISecondSource[];
    adultFormAnswers?: IQuestionsGroup[];
    adultFormCurrentStep?: EAdultFormSteps;
    autobiography?: {
        text?: string;
        videoUrl?: string;
    };
    endFillFormDate?: string;
    giftdnessIndicators?: boolean;
    createdAt: string;
    updatedAt: string;
}
