import { useEffect, useState } from "react";
import { Stepper } from "../../components/Stepper/Stepper";
import { StepStateType } from "../../components/Stepper/StepperStep";
import Notify from "../../components/Notify/Notify";
import { useParams } from "react-router-dom";
import { EAdultFormSource, EAdultFormSteps } from "../../utils/consts.utils";
import SecondSourceDataStep from "./steps/SecondSourceDataStep";
import IntroductionStep from "../AdultForm/steps/IntroductionStep";
import { getResearchDataBySampleIdAndParticipantId } from "../../api/researchers.api";
import { patchValidateVerificationCode } from "../../api/secondSource.api";
import { ISecondSource } from "../../interfaces/secondSource.interface";
import { clearTokens, saveParticipantToken } from "../../utils/tokensHandler";
import ReadAndAcceptDocsStep from "../AdultForm/steps/ReadAndAcceptDocsStep";
import FormGroupsStep from "../AdultForm/steps/FormGroupsStep";
import { IParticipant } from "../../interfaces/participant.interface";
import ReactLoading from "react-loading";

const AdultFormSecondSourcePage = () => {
    const [currentStep, setCurrentStep] = useState(EAdultFormSteps.INTRODUCTION);
    const [researchData, setResearchData] = useState({ researcherName: "", participantName: "" });
    const [formData, setFormData] = useState({} as ISecondSource);
    const [loading, setLoading] = useState(true);

    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
    });

    const { sampleId = "", participantId = "", secondSourceId = "", verificationCode = "" } = useParams();

    /* It is used to fetch the research data based on a sample and participant ID. */
    useEffect(() => {
        const getResearchData = async (sampleId: string, participantId: string) => {
            const response = await getResearchDataBySampleIdAndParticipantId({ sampleId, participantId });
            if (response.status === 200) {
                setResearchData(response.data);
            }
        };

        if (sampleId && participantId) {
            getResearchData(sampleId, participantId);
        }
    }, [sampleId, participantId]);

    /* It is used to validate the URL received in the second source email. */
    useEffect(() => {
        const validateURL = async (
            secondSourceId: string,
            participantId: string,
            sampleId: string,
            verificationCode: string
        ) => {
            patchValidateVerificationCode({ secondSourceId, participantId, sampleId, verificationCode })
                .then((res) => {
                    if (res.status === 200) {
                        setFormData(res.data.secondSource);
                        saveParticipantToken(res.data.token);
                        setCurrentStep(EAdultFormSteps.READ_AND_ACCEPT_DOCS);
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

        if (sampleId && verificationCode && participantId && secondSourceId) {
            validateURL(secondSourceId, participantId, sampleId, verificationCode);
        }
    }, [verificationCode, participantId, sampleId, secondSourceId]);

    const getStepState = (stepToCompare: EAdultFormSteps): StepStateType => {
        if (currentStep > stepToCompare) return "DONE";
        else if (currentStep === stepToCompare) return "HOLD";
        else return "DISABLED";
    };

    const handleNextStep = () => {
        // Last step to second source
        if (currentStep === EAdultFormSteps.ARTISTIC_ACTIVITIES) {
            setNotificationData({
                title: "Questionário finalizado!",
                description: "Agradecemos pelas respostas. Em breve o pesquisador entrará em contato.",
            });
            setCurrentStep(EAdultFormSteps.INTRODUCTION);
            return;
        }

        if (currentStep === EAdultFormSteps.READ_AND_ACCEPT_DOCS) {
            // Jump indicate second steps
            setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
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

                {/* STEPPER */}
                {currentStep > EAdultFormSteps.INTRODUCTION &&
                    currentStep < EAdultFormSteps.GENERAL_CHARACTERISTICS && (
                        <Stepper.Root>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.READ_AND_ACCEPT_DOCS)}
                                stepNumber="01"
                                stepTitle="Termos"
                                stepDescription="Leia e aceite os termos"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.PARTICIPANT_DATA)}
                                stepNumber="02"
                                stepTitle="Pessoais"
                                stepDescription="Informações pessoais"
                            ></Stepper.Step>
                            <Stepper.Step
                                stepState="DISABLED"
                                stepNumber="03"
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
                        </Stepper.Root>
                        <Stepper.Root>
                            <Stepper.Step
                                stepState={getStepState(EAdultFormSteps.TASK_COMMITMENT)}
                                stepNumber="04"
                                stepTitle="GRUPO 4"
                                stepDescription="Comprometimento da Tarefa"
                            ></Stepper.Step>
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
                        </Stepper.Root>
                    </div>
                )}

                {currentStep === EAdultFormSteps.INTRODUCTION && (
                    <IntroductionStep
                        sourceForm={EAdultFormSource.SECOND_SOURCE}
                        participantId={participantId}
                        sampleId={sampleId}
                        researcherName={researchData.researcherName}
                        participantName={researchData.participantName}
                        setNotificationData={setNotificationData}
                    />
                )}
                {currentStep === EAdultFormSteps.PARTICIPANT_DATA && (
                    <SecondSourceDataStep
                        formData={formData}
                        saveAndExit={saveAndExit}
                        setFormData={setFormData}
                        nextStep={handleNextStep}
                        sampleId={sampleId}
                        setNotificationData={setNotificationData}
                    />
                )}
                {currentStep === EAdultFormSteps.READ_AND_ACCEPT_DOCS && (
                    <ReadAndAcceptDocsStep
                        formData={formData}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore DONT WORRY TYPESCRIPT, KEEP CALM OK?
                        setFormData={setFormData}
                        previousStep={handlePreviousStep}
                        saveAndExit={saveAndExit}
                        sourceForm={EAdultFormSource.SECOND_SOURCE}
                        nextStep={handleNextStep}
                        sampleId={sampleId}
                        setNotificationData={setNotificationData}
                    />
                )}
                {currentStep >= EAdultFormSteps.GENERAL_CHARACTERISTICS &&
                    currentStep <= EAdultFormSteps.ARTISTIC_ACTIVITIES && (
                        <FormGroupsStep
                            formData={formData}
                            setFormData={setFormData as (data: ISecondSource | IParticipant) => void}
                            previousStep={handlePreviousStep}
                            saveAndExit={saveAndExit}
                            sourceForm={EAdultFormSource.SECOND_SOURCE}
                            sampleId={sampleId}
                            currentStep={currentStep}
                            nextStep={handleNextStep}
                            setNotificationData={setNotificationData}
                        />
                    )}
            </div>
        </Notify>
    );
};

export default AdultFormSecondSourcePage;
