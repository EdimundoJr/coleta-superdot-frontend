import { useState } from "react";
import { Stepper } from "../../components/Stepper/Stepper";
import { StepStateType } from "../../components/Stepper/StepperStep";
import Notify from "../../components/Notify/Notify";
import ParticipantData from "./steps/ParticipantDataStep";
import { useParams } from "react-router-dom";
import IntroductionStep from "./steps/IntroductionStep";
import ReadAndAcceptDocsStep from "./steps/ReadAndAcceptDocsStep";
import IndicateSecondSourceStep from "./steps/IndicateSecondSourceStep";
import AnsweringAdultFormStep from "./steps/AnsweringAdultFormStep";
import AutobiographyStep from "./steps/Autobiography";
import { EAdultFormSource, EAdultFormSteps } from "../../utils/consts.utils";

const AdultForm = () => {
    const [currentStep, setCurrentStep] = useState(EAdultFormSteps.INTRODUCTION);

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const { sampleId } = useParams();

    const getStepState = (stepToCompare: EAdultFormSteps): StepStateType => {
        if (currentStep > stepToCompare) return "DONE";
        else if (currentStep === stepToCompare) return "HOLD";
        else return "DISABLED";
    };

    const handleNextStep = () => {
        if (currentStep === EAdultFormSteps.AUTOBIOGRAPHY) {
            setCurrentStep(EAdultFormSteps.INTRODUCTION);
            return;
        }
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        if (currentStep === EAdultFormSteps.INTRODUCTION) {
            return;
        }
        setCurrentStep(currentStep - 1);
    };

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <div
                id="bg-div"
                className="h-full overflow-y-scroll bg-slate-950 bg-opacity-50 bg-default-bg bg-cover bg-no-repeat bg-blend-multiply"
            >
                {/* HEADER */}
                <div className="flex justify-start p-4">
                    <h1>GRUPAC</h1>
                </div>

                {/* STEPPER */}
                {currentStep > EAdultFormSteps.INTRODUCTION &&
                    currentStep < EAdultFormSteps.GENERAL_CHARACTERISTICS && (
                        <Stepper.Root>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.PARTICIPANT_DATA)}
                                stepNumber="01"
                                stepTitle="Pessoais"
                                stepDescription="Informações pessoais"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.READ_AND_ACCEPT_DOCS)}
                                stepNumber="02"
                                stepTitle="Termos"
                                stepDescription="Leia e aceite os termos"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.INDICATE_SECOND_SOURCE)}
                                stepNumber="03"
                                stepTitle="Segundas fontes"
                                stepDescription="Indique segundas fontes"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState="DISABLED"
                                stepNumber="04"
                                stepTitle="Questionário"
                                stepDescription="Responda o questionário"
                            ></Stepper.Step>
                        </Stepper.Root>
                    )}
                {currentStep >= EAdultFormSteps.GENERAL_CHARACTERISTICS && (
                    <div>
                        <Stepper.Root>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.GENERAL_CHARACTERISTICS)}
                                stepNumber="01"
                                stepTitle="GRUPO 1"
                                stepDescription="Características Gerais"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.HIGH_ABILITIES)}
                                stepNumber="02"
                                stepTitle="GRUPO 2"
                                stepDescription="Habilidade Acima da Média"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.CRIATIVITY)}
                                stepNumber="03"
                                stepTitle="GRUPO 3"
                                stepDescription="Criatividade"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.TASK_COMMITMENT)}
                                stepNumber="04"
                                stepTitle="GRUPO 4"
                                stepDescription="Comprometimento da Tarefa"
                            ></Stepper.Step>
                        </Stepper.Root>
                        <Stepper.Root>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.LEADERSHIP)}
                                stepNumber="05"
                                stepTitle="GRUPO 5"
                                stepDescription="Liderança"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.ARTISTIC_ACTIVITIES)}
                                stepNumber="06"
                                stepTitle="GRUPO 6"
                                stepDescription="Atividades Artísticas e Esportivas"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.AUTOBIOGRAPHY)}
                                stepNumber="07"
                                stepTitle="Autobigrafia"
                                stepDescription="Detalhes sobre você"
                            ></Stepper.Step>
                        </Stepper.Root>
                    </div>
                )}

                {currentStep === EAdultFormSteps.INTRODUCTION && (
                    <IntroductionStep
                        sourceForm={EAdultFormSource.FIRST_SOURCE}
                        setCurrentStep={setCurrentStep}
                        sampleId={sampleId || ""}
                        setNotificationDescription={setNotificationDescription}
                        setNotificationTitle={setNotificationTitle}
                    />
                )}

                {currentStep === EAdultFormSteps.PARTICIPANT_DATA && (
                    <ParticipantData
                        nextStep={handleNextStep}
                        sampleId={sampleId || ""}
                        setNotificationDescription={setNotificationDescription}
                        setNotificationTitle={setNotificationTitle}
                    />
                )}
                {currentStep === EAdultFormSteps.READ_AND_ACCEPT_DOCS && (
                    <ReadAndAcceptDocsStep
                        sourceForm={EAdultFormSource.FIRST_SOURCE}
                        setNotificationTitle={setNotificationTitle}
                        setNotificationDescription={setNotificationDescription}
                        nextStep={handleNextStep}
                        sampleId={sampleId || ""}
                    />
                )}
                {currentStep === EAdultFormSteps.INDICATE_SECOND_SOURCE && (
                    <IndicateSecondSourceStep
                        setNotificationTitle={setNotificationTitle}
                        setNotificationDescription={setNotificationDescription}
                        nextStep={handleNextStep}
                        sampleId={sampleId || ""}
                    />
                )}
                {currentStep >= EAdultFormSteps.GENERAL_CHARACTERISTICS &&
                    currentStep <= EAdultFormSteps.ARTISTIC_ACTIVITIES && (
                        <AnsweringAdultFormStep
                            sourceForm={EAdultFormSource.FIRST_SOURCE}
                            sampleId={sampleId || ""}
                            currentStep={currentStep}
                            nextStep={handleNextStep}
                            setNotificationTitle={setNotificationTitle}
                            setNotificationDescription={setNotificationDescription}
                        />
                    )}
                {currentStep === EAdultFormSteps.AUTOBIOGRAPHY && (
                    <AutobiographyStep
                        sampleId={sampleId || ""}
                        nextStep={handleNextStep}
                        setNotificationTitle={setNotificationTitle}
                        setNotificationDescription={setNotificationDescription}
                    />
                )}
            </div>
        </Notify>
    );
};

export default AdultForm;
