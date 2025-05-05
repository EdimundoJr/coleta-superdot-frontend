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
import IBio from "./evaluateAutobiography.interface";

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
        state: string;
        city: string;
        district: string;
        street: string;
        houseNumber: string;
    };
    acceptTcleAt?: Date;
    acceptTaleAt?: Date;
    giftdnessIndicatorsByResearcher?: boolean;
    knowledgeAreasIndicatedByResearcher?: {
        general: [String],
        specific: [String]
    },
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
    evaluateAutobiography: IBio[];
    secondSources?: DeepPartial<ISecondSource>[];
    createdAt?: string;
    updatedAt?: string;
}

export type { ISecondSource };
