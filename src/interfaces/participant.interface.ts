import { DeepPartial } from "react-hook-form";
import {
    EAdultFormGroup,
    TDevices,
    TEducationLevel,
    TGender,
    TIncomeLevel,
    TMaritalStatus,
} from "../utils/consts.utils";
import IQuestion from "./question.interface";
import { ISecondSource } from "./secondSource.interface";

export interface IParticipant {
    _id?: string;
    personalData: {
        fullName: string;
        phone: string;
        email: string;
        maritalStatus: TMaritalStatus;
        job: string;
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
    acceptTcleAt?: Date;
    acceptTaleAt?: Date;
    adultForm?: {
        endFillFormAt?: string;
        startFillFormAt?: string;
        answersByGroup?: { groupName: string; sequence: EAdultFormGroup; questions: IQuestion[] }[];
        totalPunctuation?: number;
        giftednessIndicators?: boolean;
        knowledgeAreas?: string[];
    };
    autobiography?: {
        text?: string;
        videoUrl?: string;
    };
    secondSources?: DeepPartial<ISecondSource>[];
    createdAt?: string;
    updatedAt?: string;
}
