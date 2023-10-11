import { useEffect, useState } from "react";
import { Stepper } from "../../components/Stepper/Stepper";
import { StepStateType } from "../../components/Stepper/StepperStep";
import Notify from "../../components/Notify/Notify";
import ParticipantData from "./steps/ParticipantDataStep";
import { useNavigate, useParams } from "react-router-dom";
import IntroductionStep from "./steps/IntroductionStep";
import ReadAndAcceptDocsStep from "./steps/ReadAndAcceptDocsStep";
import IndicateSecondSourceStep from "./steps/IndicateSecondSourceStep";
import AutobiographyStep from "./steps/AutobiographyStep";
import { EAdultFormSource, EAdultFormSteps } from "../../utils/consts.utils";
import { IParticipant } from "../../interfaces/participant.interface";
import { clearTokens, saveParticipantToken } from "../../utils/tokensHandler";
import ReactLoading from "react-loading";
import { patchValidateVerificationCode } from "../../api/participant.api";
import { getResearcherNameBySampleId } from "../../api/researchers.api";
import FormGroupsStep from "./steps/FormGroupsStep";
import { AxiosError } from "axios";

const stepsInfo = [
    {
        step: EAdultFormSteps.PARTICIPANT_DATA,
        stepNumber: "01",
        title: "Pessoais",
        stepDescription: "Informações pessoais",
    },
    {
        step: EAdultFormSteps.READ_AND_ACCEPT_DOCS,
        stepNumber: "02",
        title: "Termos",
        stepDescription: "Leia e aceite os termos",
    },
    {
        step: EAdultFormSteps.INDICATE_SECOND_SOURCE,
        stepNumber: "03",
        title: "Segundas fontes",
        stepDescription: "Indique segundas fontes",
    },
    {
        step: EAdultFormSteps.GENERAL_CHARACTERISTICS,
        stepNumber: "04",
        title: "GRUPO 1",
        stepDescription: "Características Gerais",
    },
    {
        step: EAdultFormSteps.HIGH_ABILITIES,
        stepNumber: "05",
        title: "GRUPO 2",
        stepDescription: "Habilidade Acima da Média",
    },
    {
        step: EAdultFormSteps.CRIATIVITY,
        stepNumber: "06",
        title: "GRUPO 3",
        stepDescription: "Criatividade",
    },
    {
        step: EAdultFormSteps.TASK_COMMITMENT,
        stepNumber: "07",
        title: "GRUPO 4",
        stepDescription: "Comprometimento da Tarefa",
    },
    {
        step: EAdultFormSteps.LEADERSHIP,
        stepNumber: "08",
        title: "GRUPO 5",
        stepDescription: "Liderança",
    },
    {
        step: EAdultFormSteps.ARTISTIC_ACTIVITIES,
        stepNumber: "09",
        title: "GRUPO 6",
        stepDescription: "Atividades Artísticas e Esportivas",
    },
    {
        step: EAdultFormSteps.AUTOBIOGRAPHY,
        stepNumber: "10",
        title: "Autobigrafia",
        stepDescription: "Detalhes sobre você",
    },
];

/* It is a multi-step form that allows participants and second sources to fill out the AH/SD Form to Adults. */
const AdultForm = () => {
    const [formData, setFormData] = useState<IParticipant>({} as IParticipant);
    const [currentStep, setCurrentStep] = useState(EAdultFormSteps.INTRODUCTION);
    const [loading, setLoading] = useState(true);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
    });
    const [researcherName, setResearcherName] = useState<string>("");
    const { sampleId, participantId, verificationCode } = useParams();
    const navigate = useNavigate();

    /* It is used to fetch the researcher name based on a sample ID. */
    useEffect(() => {
        const getResearcherName = async (sampleId: string) => {
            const response = await getResearcherNameBySampleId(sampleId);
            if (response.status === 200) {
                setResearcherName(response.data);
            }
        };

        if (sampleId) {
            getResearcherName(sampleId);
        }
    }, [sampleId]);

    /* It is used to validate the URL (receive in the user email) by making an asynchronous request to a server endpoint. */
    useEffect(() => {
        const validateURL = async (participantId: string, sampleId: string, verificationCode: string) => {
            patchValidateVerificationCode({ participantId, sampleId, verificationCode })
                .then((res) => {
                    if (res.status === 200) {
                        setFormData(res.data.participant);
                        saveParticipantToken(res.data.token);
                        setCurrentStep(EAdultFormSteps.PARTICIPANT_DATA);
                        setResearcherName(res.data.researcherName);
                    }
                })
                .catch((err) => {
                    console.error(err);
                    setNotificationData({
                        title: "Link inválido!",
                        description: "Verifique se está utilizando o código que foi enviado para o seu e-mail.",
                    });
                })
                .finally(() => {
                    setLoading(false);
                });
        };

        // If the link haven't a verification code, ignore and continue
        if (!verificationCode) {
            setLoading(false);
            return;
        }

        if (sampleId && verificationCode && participantId) {
            validateURL(participantId, sampleId, verificationCode);
        }
    }, [verificationCode, participantId, sampleId]);

    /* If the `sampleId` variable is falsy (e.g. undefined, null, empty string), it will
    navigate to the root route ("/") and return null. Cannot fill out the form without a sampleId. */
    if (!sampleId) {
        navigate("/");
        return null;
    }

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

    const saveAndExit = () => {
        clearTokens();
        setCurrentStep(EAdultFormSteps.INTRODUCTION);
    };

    return (
        <Notify
            open={!!notificationData.title}
            onOpenChange={() => setNotificationData({ title: "", description: "" })}
            title={notificationData.title}
            description={notificationData.description}
        >
            {loading && (
                <div className="absolute flex h-full w-full bg-black opacity-60">
                    <ReactLoading className="m-auto" type="spinningBubbles"></ReactLoading>
                </div>
            )}
            <div
                id="bg-div"
                className="h-full overflow-y-scroll bg-slate-950 bg-opacity-50 bg-default-bg bg-cover bg-no-repeat bg-blend-multiply"
            >
                {/* HEADER */}
                <div className="flex justify-start p-4">
                    <h1>GRUPAC</h1>
                </div>

                {/* STEPPER WITH THREE ROWS */}
                {currentStep > EAdultFormSteps.INTRODUCTION && (
                    <>
                        <Stepper.Root>
                            {stepsInfo.slice(0, 4).map((step) => (
                                <Stepper.Step
                                    stepState={getStepState(step.step)}
                                    stepNumber={step.stepNumber}
                                    stepTitle={step.title}
                                    stepDescription={step.stepDescription}
                                />
                            ))}
                        </Stepper.Root>
                        <Stepper.Root>
                            {stepsInfo.slice(4, 7).map((step) => (
                                <Stepper.Step
                                    stepState={getStepState(step.step)}
                                    stepNumber={step.stepNumber}
                                    stepTitle={step.title}
                                    stepDescription={step.stepDescription}
                                />
                            ))}
                        </Stepper.Root>
                        <Stepper.Root>
                            {stepsInfo.slice(7, 10).map((step) => (
                                <Stepper.Step
                                    stepState={getStepState(step.step)}
                                    stepNumber={step.stepNumber}
                                    stepTitle={step.title}
                                    stepDescription={step.stepDescription}
                                />
                            ))}
                        </Stepper.Root>
                    </>
                )}

                {currentStep === EAdultFormSteps.INTRODUCTION && (
                    <IntroductionStep
                        researcherName={researcherName}
                        sourceForm={EAdultFormSource.FIRST_SOURCE}
                        sampleId={sampleId}
                        setNotificationData={setNotificationData}
                    />
                )}

                {currentStep === EAdultFormSteps.PARTICIPANT_DATA && (
                    <ParticipantData
                        formData={formData}
                        setFormData={setFormData}
                        nextStep={handleNextStep}
                        sampleId={sampleId}
                        setNotificationData={setNotificationData}
                        saveAndExit={saveAndExit}
                    />
                )}
                {currentStep === EAdultFormSteps.READ_AND_ACCEPT_DOCS && (
                    <ReadAndAcceptDocsStep
                        formData={formData}
                        setFormData={setFormData}
                        sourceForm={EAdultFormSource.FIRST_SOURCE}
                        setNotificationData={setNotificationData}
                        nextStep={handleNextStep}
                        previousStep={handlePreviousStep}
                        sampleId={sampleId}
                        saveAndExit={saveAndExit}
                    />
                )}
                {currentStep === EAdultFormSteps.INDICATE_SECOND_SOURCE && (
                    <IndicateSecondSourceStep
                        formData={formData}
                        setFormData={setFormData}
                        setNotificationData={setNotificationData}
                        nextStep={handleNextStep}
                        previousStep={handlePreviousStep}
                        sampleId={sampleId}
                        saveAndExit={saveAndExit}
                    />
                )}
                {currentStep >= EAdultFormSteps.GENERAL_CHARACTERISTICS &&
                    currentStep <= EAdultFormSteps.ARTISTIC_ACTIVITIES && (
                        <FormGroupsStep
                            formData={formData}
                            previousStep={handlePreviousStep}
                            saveAndExit={saveAndExit}
                            setFormData={setFormData}
                            sourceForm={EAdultFormSource.FIRST_SOURCE}
                            sampleId={sampleId}
                            currentStep={currentStep}
                            nextStep={handleNextStep}
                            setNotificationData={setNotificationData}
                        />
                    )}
                {currentStep === EAdultFormSteps.AUTOBIOGRAPHY && (
                    <AutobiographyStep
                        formData={formData}
                        previousStep={handlePreviousStep}
                        sampleId={sampleId}
                        nextStep={handleNextStep}
                        setNotificationData={setNotificationData}
                    />
                )}
            </div>
        </Notify>
    );
};

export default AdultForm;
