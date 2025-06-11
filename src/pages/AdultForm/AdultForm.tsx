import { useEffect, useRef, useState } from "react";
import Notify from "../../components/Notify/Notify";
import ParticipantData from "./steps/ParticipantDataStep";
import { useNavigate, useParams } from "react-router-dom";
import IntroductionStep from "./steps/IntroductionStep";
import ReadAndAcceptDocsStep from "./steps/ReadAndAcceptDocsStep";
import IndicateSecondSourceStep from "./steps/IndicateSecondSourceStep";
import AutobiographyStep from "./steps/AutobiographyStep";
import { EAdultFormSource, EAdultFormSteps } from "../../utils/consts.utils";
import { IParticipant } from "../../interfaces/participant.interface";
import { saveParticipantToken } from "../../utils/tokensHandler";
import { patchValidateVerificationCode } from "../../api/participant.api";
import { getResearcherNameBySampleId } from "../../api/researchers.api";
import FormGroupsStep from "./steps/FormGroupsStep";
import { ISecondSource } from "../../interfaces/secondSource.interface";
import { Flex } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import Stepper, { Step } from "../../components/NewStepper/NewStteper";
import { Button } from "../../components/Button/Button";
import logo from "../../assets/Logo-GRUPAC.png"
import React from "react";
import { PageLoader } from "../../components/Loading/Loading";
import QuestionnaireCompleted from "../../components/QuestionnaireCompleted/QuestionnaireCompleted";

const stepsInfo = [
    {
        step: EAdultFormSteps.READ_AND_ACCEPT_DOCS,
        stepNumber: "01",
        title: "Termos",
        stepDescription: "Leia e Aceite os Termos",
        icon: <Icon.FileText size={32} />
    },
    {
        step: EAdultFormSteps.PARTICIPANT_DATA,
        stepNumber: "02",
        title: "Pessoais",
        stepDescription: "Dados Cadastrais",
        icon: <Icon.FolderSimpleUser size={32} />
    },
    {
        step: EAdultFormSteps.INDICATE_SECOND_SOURCE,
        stepNumber: "03",
        title: "Segundas fontes",
        stepDescription: "Indique Segundas Fontes",
        icon: <Icon.UserPlus size={32} />
    },
    {
        step: EAdultFormSteps.GENERAL_CHARACTERISTICS,
        stepNumber: "04",
        title: "Questionário",
        stepDescription: `Formulário - Adulto`,
        icon: <Icon.ClipboardText size={32} />
    },
    {
        step: EAdultFormSteps.AUTOBIOGRAPHY,
        stepNumber: "05",
        title: "Autobiografia",
        stepDescription: "Escreva sobre você",
        icon: < Icon.UserFocus size={32} />
    },
];
type FormGroupSteps =
    | EAdultFormSteps.GENERAL_CHARACTERISTICS
    | EAdultFormSteps.HIGH_ABILITIES
    | EAdultFormSteps.CREATIVITY
    | EAdultFormSteps.TASK_COMMITMENT
    | EAdultFormSteps.LEADERSHIP
    | EAdultFormSteps.ARTISTIC_ACTIVITIES;

/* It is a multi-step form that allows participants and second sources to fill out the AH/SD Form to Adults. */
const AdultForm = () => {
    const [formData, setFormData] = useState<IParticipant>({} as IParticipant);
    const [currentStep, setCurrentStep] = useState(EAdultFormSteps.INTRODUCTION);
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const [researcherName, setResearcherName] = useState<string>("");
    const { sampleId, participantId, verificationCode } = useParams();
    const navigate = useNavigate();
    const stepperRef = useRef<{
        handleNext: () => void;
        handleBack: () => void;
    }>(null);
    // const [showFooter, setShowFooter] = useState(false);
    const [completedSteps, setCompletedSteps] = useState<Record<FormGroupSteps, boolean>>({
        [EAdultFormSteps.GENERAL_CHARACTERISTICS]: false,
        [EAdultFormSteps.HIGH_ABILITIES]: false,
        [EAdultFormSteps.CREATIVITY]: false,
        [EAdultFormSteps.TASK_COMMITMENT]: false,
        [EAdultFormSteps.LEADERSHIP]: false,
        [EAdultFormSteps.ARTISTIC_ACTIVITIES]: false
    });
    const handleStepCompletion = (step: FormGroupSteps, isCompleted: boolean) => {
        setCompletedSteps(prev => ({
            ...prev,
            [step]: isCompleted
        }));
    };

    const allStepsCompleted = Object.values(completedSteps).every(Boolean);

    useEffect(() => {
        const savedStep = localStorage.getItem(`adult-form-step-${participantId}`);
        if (savedStep) {
            setCurrentStep(Number(savedStep));
        }
    }, [participantId]);

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

    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };




    /* It is used to validate the URL (receive in the user email) by making an asynchronous request to a server endpoint. */
    useEffect(() => {
        const validateURL = async (participantId: string, sampleId: string, verificationCode: string) => {
            try {
                const res = await patchValidateVerificationCode({ participantId, sampleId, verificationCode });
                if (res.status === 200) {
                    setFormData(res.data.participant);
                    saveParticipantToken(res.data.token);
                    setResearcherName(res.data.researcherName);

                    const savedStep = localStorage.getItem(`adult-form-step-${participantId}`);
                    const restoredStep = savedStep ? Number(savedStep) : EAdultFormSteps.READ_AND_ACCEPT_DOCS;
                    if (restoredStep === EAdultFormSteps.AUTOBIOGRAPHY) {
                        setCurrentStep(4);
                    } else {
                        setCurrentStep(restoredStep);
                    }
                }
            } catch (err) {
                console.error(err);
                setNotificationData({
                    title: "Link inválido!",
                    description: "Verifique se está utilizando o código que foi enviado para o seu e-mail.",
                    type: "erro"
                });
            } finally {
                setTimeout(() => {
                    setIsPageLoading(false);
                }, 2000);
            }
        };


        // If the link haven't a verification code, ignore and continue
        if (!verificationCode) {
            setIsPageLoading(false);
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

    // const getStepState = (stepToCompare: EAdultFormSteps): StepStateType => {
    //     if (currentStep > stepToCompare) return "DONE";
    //     else if (currentStep === stepToCompare) return "HOLD";
    //     else return "DISABLED";
    // };

    const handleNextStep = () => {
        scrollToTop();
        const nextStep =
            currentStep === EAdultFormSteps.AUTOBIOGRAPHY
                ? EAdultFormSteps.FINISHED
                : currentStep === EAdultFormSteps.GENERAL_CHARACTERISTICS
                    ? EAdultFormSteps.AUTOBIOGRAPHY
                    : currentStep + 1;

        localStorage.setItem(`adult-form-step-${participantId}`, nextStep.toString());
        setCurrentStep(nextStep);
        stepperRef.current?.handleNext();
    };

    const handlePreviousStep = () => {
        scrollToTop();
        if (currentStep === EAdultFormSteps.INTRODUCTION) {
            return;
        }
        if (currentStep === EAdultFormSteps.AUTOBIOGRAPHY) {
            setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
            stepperRef.current?.handleBack();
            return;
        }
        setCurrentStep(currentStep - 1);
        stepperRef.current?.handleBack();
    };

    const saveAndExit = () => {
        localStorage.setItem(`adult-form-step-${participantId}`, currentStep.toString());
        setCurrentStep(EAdultFormSteps.INTRODUCTION);
    };



    return (

        <Notify
            open={!!notificationData.title}
            onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
            title={notificationData.title}
            description={notificationData.description}
            icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
            className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
        >

            {isPageLoading && (
                <PageLoader />
            )}

            {!isPageLoading && (
                <>
                    {currentStep != EAdultFormSteps.INTRODUCTION && (
                        <div className="absolute inset-0 z-10 bg-default-bg max-xl:bg-default-bg-mobo bg-cover">
                            <Flex direction={"column"} className="w-full max-xl:w-[90%] max-sm:w-full m-auto max-w-3xl bg-glass relative h-screen card-container-border-variant">

                                <header className="z-10 ml-7 mr-8 max-xl:ml-5 max-xl:mr-6 mt-4 rounded-md card-container-border-variant bg-off-white">
                                    <Flex
                                        direction={"row"}
                                        justify={"center"}
                                        align={"center"}
                                        className="max-w-3xl m-auto px-4 py-4 gap-4"
                                    >
                                        <img
                                            className="w-24 h-auto flex-shrink-0"
                                            src={logo}
                                            alt="Logo"
                                        />


                                        <div className="h-8 w-px bg-gray-200 mx-2" />


                                        <div className="flex items-center gap-3 max-sm:flex-col">
                                            {stepsInfo[currentStep - 1]?.icon && (
                                                <div className="text-primary flex-shrink-0">
                                                    {React.cloneElement(stepsInfo[currentStep - 1]?.icon, {
                                                        className: "w-6 h-6"
                                                    })}

                                                </div>
                                            )}

                                            {currentStep === 10 && (
                                                <div className="text-primary flex-shrink-0">

                                                    {React.cloneElement(stepsInfo[4].icon, { className: "w-6 h-6" })
                                                    }

                                                </div>)
                                            }

                                            <div className="flex flex-col gap-0.5">
                                                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                                                    {stepsInfo[currentStep - 1]?.title}
                                                    {currentStep === 10 ? stepsInfo[4].title : ""}
                                                </h1>

                                            </div>
                                        </div>
                                    </Flex>
                                </header>

                                <div className="flex-1 overflow-y-auto z-10 mt-2">
                                    <Stepper
                                        ref={stepperRef}
                                        className="w-[100%] max-sm:w-full m-auto "
                                        initialStep={currentStep}
                                        footerClassName="hidden"
                                        disableStepIndicators
                                        onStepChange={(step) => {
                                            if (step === EAdultFormSteps.HIGH_ABILITIES) {
                                                setCurrentStep(EAdultFormSteps.AUTOBIOGRAPHY);
                                            } else {
                                                setCurrentStep(step as EAdultFormSteps);
                                            }
                                        }}
                                    >

                                        {stepsInfo.map((stepInfo) => (
                                            <Step key={stepInfo.step}>
                                                <Flex className="w-full card-container-variante-border  font-roboto rounded-lg mb-5  mt-2">
                                                    <Flex direction="column" className={`w-full p-6 max-sm:p-4 space-y-4 bg-glass`}>
                                                        {currentStep === EAdultFormSteps.PARTICIPANT_DATA && (
                                                            <ParticipantData
                                                                header={stepsInfo[currentStep - 1]?.stepDescription}
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
                                                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                                                // @ts-ignore DONT WORRY TYPESCRIPT, KEEP CALM OK?
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
                                                                header={stepsInfo[currentStep - 1]?.stepDescription}
                                                                formData={formData}
                                                                setFormData={setFormData}
                                                                setNotificationData={setNotificationData}
                                                                nextStep={handleNextStep}
                                                                previousStep={handlePreviousStep}
                                                                sampleId={sampleId}
                                                                saveAndExit={saveAndExit}
                                                            />
                                                        )}

                                                        {currentStep === EAdultFormSteps.GENERAL_CHARACTERISTICS && (
                                                            <Flex direction="column" className="bg-off-white p-5 font-roboto text-slate-950 rounded-2xl w-[100%] gap-y-5 m-auto max-sm:p-0">
                                                                <header className="text-primary">
                                                                    <h3 className="text-xl max-sm:text-lg md:text-xl lg:text-2xl font-bold">
                                                                        {stepsInfo[currentStep - 1]?.stepDescription}
                                                                    </h3>

                                                                </header>
                                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 mb-5">

                                                                    {[
                                                                        EAdultFormSteps.GENERAL_CHARACTERISTICS,
                                                                        EAdultFormSteps.HIGH_ABILITIES,
                                                                        EAdultFormSteps.CREATIVITY,
                                                                        EAdultFormSteps.TASK_COMMITMENT,
                                                                        EAdultFormSteps.LEADERSHIP,
                                                                        EAdultFormSteps.ARTISTIC_ACTIVITIES
                                                                    ].map((step) => (
                                                                        <FormGroupsStep
                                                                            key={step}
                                                                            formData={formData}
                                                                            setFormData={setFormData as (data: ISecondSource | IParticipant) => void}
                                                                            sourceForm={EAdultFormSource.FIRST_SOURCE}
                                                                            sampleId={sampleId}
                                                                            currentStep={step}
                                                                            completed={completedSteps[step as FormGroupSteps]}
                                                                            onCompletionChange={(isCompleted) =>
                                                                                handleStepCompletion(step as FormGroupSteps, isCompleted)
                                                                            }
                                                                            setNotificationData={setNotificationData}
                                                                        />
                                                                    ))}
                                                                </div>
                                                                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100 max-sm:flex-col ">
                                                                    <Button
                                                                        onClick={handlePreviousStep}
                                                                        size="Full"
                                                                        title="Voltar"
                                                                        color="gray"
                                                                        className="hover:bg-gray-50 border border-gray-200"
                                                                    />
                                                                    <Button
                                                                        size="Full"
                                                                        onClick={saveAndExit}
                                                                        title="Salvar e Sair"
                                                                        color="primary"
                                                                        className="hover:bg-gray-50 border border-gray-200"
                                                                    />
                                                                    <Button
                                                                        // loading={loading}
                                                                        size="Full"
                                                                        onClick={handleNextStep}
                                                                        className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                                                                        title="Salvar e Continuar"
                                                                        disabled={!allStepsCompleted} color={!allStepsCompleted ? "gray" : "green"} />
                                                                </div>
                                                            </Flex>
                                                        )}

                                                        {currentStep === EAdultFormSteps.AUTOBIOGRAPHY && (
                                                            <AutobiographyStep
                                                                formData={formData}
                                                                previousStep={handlePreviousStep}
                                                                sampleId={sampleId}
                                                                nextStep={handleNextStep}
                                                                setNotificationData={setNotificationData} header={stepsInfo[4]?.stepDescription} />
                                                        )}
                                                    </Flex>
                                                </Flex>

                                            </Step>

                                        )
                                        )}

                                    </Stepper>

                                </div>

                            </Flex>
                        </div>
                    )}
                    {
                        currentStep === EAdultFormSteps.INTRODUCTION && (

                            <Flex
                                direction={"column"}
                                className="relative h-screen w-full overflow-hidden"
                            >
                                <div className="fixed inset-0 bg-default-bg max-sm:bg-default-bg-mobo bg-cover bg-center bg-no-repeat"></div>

                                <div className="relative z-10 h-full w-full overflow-y-auto">

                                    <div className="min-h-full w-full flex items-center justify-center">
                                        <div className="fixed inset-0 bg-glass opacity-90 w-[90%] max-sm:border-none max-sm:!rounded-none max-sm:w-full pointer-events-none m-auto"></div>
                                        <IntroductionStep
                                            researcherName={researcherName}
                                            sourceForm={EAdultFormSource.FIRST_SOURCE}
                                            sampleId={sampleId}
                                            setNotificationData={setNotificationData}
                                        />
                                    </div>
                                </div>
                            </Flex>
                        )
                    }
                    {

                        currentStep === EAdultFormSteps.FINISHED && (
                            <Flex
                                align={"center"}
                                id="bg-div"
                                className={`font-roboto w-full text-white m-auto relative z-10`}
                            >
                                <QuestionnaireCompleted />
                            </Flex>
                        )
                    }

                </>
            )}
        </Notify >

    );
};

export default AdultForm;
