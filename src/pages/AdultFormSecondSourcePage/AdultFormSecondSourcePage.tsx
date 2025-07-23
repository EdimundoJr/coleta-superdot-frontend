import { useEffect, useRef, useState } from "react";
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
import * as Icon from "@phosphor-icons/react";
import { Flex } from "@radix-ui/themes";
import { Button } from "../../components/Button/Button";
import Stepper, { Step } from "../../components/NewStepper/NewStteper";
import logo from "../../assets/Logo-GRUPAC.png"
import QuestionnaireCompleted from "../../components/QuestionnaireCompleted/QuestionnaireCompleted";
import { PageLoader } from "../../components/Loading/Loading";
import React from "react";


const stepsInfo = [
    {
        step: EAdultFormSteps.READ_AND_ACCEPT_DOCS,
        stepNumber: "01",
        title: "Termos",
        stepDescription: "Leia e aceite os termos",
        icon: <Icon.FileText size={32} />
    },
    {
        step: EAdultFormSteps.PARTICIPANT_DATA,
        stepNumber: "02",
        title: "Pessoais",
        stepDescription: "Dados cadastrais",
        icon: <Icon.FolderSimpleUser size={32} />
    },
    {
        step: EAdultFormSteps.GENERAL_CHARACTERISTICS,
        stepNumber: "03",
        title: "QUESTIONÁRIO",
        stepDescription: `Formulário - Adulto - Segundas fontes`,
        icon: <Icon.ClipboardText size={32} />
    }
];

type FormGroupSteps =
    | EAdultFormSteps.GENERAL_CHARACTERISTICS
    | EAdultFormSteps.HIGH_ABILITIES
    | EAdultFormSteps.CREATIVITY
    | EAdultFormSteps.TASK_COMMITMENT
    | EAdultFormSteps.LEADERSHIP
    | EAdultFormSteps.ARTISTIC_ACTIVITIES;

const AdultFormSecondSourcePage = () => {
    const [currentStep, setCurrentStep] = useState(EAdultFormSteps.INTRODUCTION);
    const [researchData, setResearchData] = useState({ researcherName: "", participantName: "" });
    const [completedSteps, setCompletedSteps] = useState<Record<FormGroupSteps, boolean>>({
        [EAdultFormSteps.GENERAL_CHARACTERISTICS]: false,
        [EAdultFormSteps.HIGH_ABILITIES]: false,
        [EAdultFormSteps.CREATIVITY]: false,
        [EAdultFormSteps.TASK_COMMITMENT]: false,
        [EAdultFormSteps.LEADERSHIP]: false,
        [EAdultFormSteps.ARTISTIC_ACTIVITIES]: false
    });
    const stepperRef = useRef<{
        handleNext: () => void;
        handleBack: () => void;
    }>(null);
    const [formData, setFormData] = useState({} as ISecondSource);
    const [loading, setLoading] = useState(true);
    const [isPageLoading, setIsPageLoading] = useState(true);


    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
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
                        type: "erro"
                    });
                })
                .finally(() => {
                    setTimeout(() => {
                        setIsPageLoading(false);
                    }, 2000);
                    setLoading(false);
                });
        };

        // If the link haven't a verification code, ignore and continue
        if (!verificationCode) {
            setLoading(false);
            setIsPageLoading(false);
            return;
        }

        if (sampleId && verificationCode && participantId && secondSourceId) {
            validateURL(secondSourceId, participantId, sampleId, verificationCode);
        }
    }, [verificationCode, participantId, sampleId, secondSourceId]);


    const allStepsCompleted = Object.values(completedSteps).every(Boolean);
    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };
    const handleNextStep = () => {
        scrollToTop();
        if (currentStep === EAdultFormSteps.GENERAL_CHARACTERISTICS) {
            setNotificationData({
                title: "Questionário finalizado!",
                description: "Agradecemos pelas respostas. Em breve o pesquisador entrará em contato.",
                type: "success"
            });
            setCurrentStep(EAdultFormSteps.FINISHED);
            return;
        }

        if (currentStep === EAdultFormSteps.INDICATE_SECOND_SOURCE) {
            setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
            stepperRef.current?.handleNext();

            return;
        }
        if (currentStep === EAdultFormSteps.PARTICIPANT_DATA) {
            setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
            stepperRef.current?.handleNext();
            return;
        }

        stepperRef.current?.handleNext();
        setCurrentStep(currentStep + 1);

    };
    const handleStepCompletion = (step: FormGroupSteps, isCompleted: boolean) => {
        setCompletedSteps(prev => ({
            ...prev,
            [step]: isCompleted
        }));
    };

    const handlePreviousStep = () => {
        scrollToTop();
        if (currentStep === EAdultFormSteps.INTRODUCTION) {
            return;
        }
        if (currentStep === EAdultFormSteps.INDICATE_SECOND_SOURCE) {
            setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
            stepperRef.current?.handleBack();
            return;
        }
        if (currentStep === EAdultFormSteps.PARTICIPANT_DATA) {
            setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
            stepperRef.current?.handleBack();
            return;
        }
        setCurrentStep(currentStep - 1);
        stepperRef.current?.handleBack();
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

                                            {currentStep === 4 && (
                                                <div className="text-primary flex-shrink-0">
                                                    {React.cloneElement(stepsInfo[2].icon, { className: "w-6 h-6" })
                                                    }

                                                </div>)
                                            }

                                            <div className="flex flex-col gap-0.5">
                                                <h1 className="text-lg font-semibold text-gray-900 leading-tight">
                                                    {stepsInfo[currentStep - 1]?.title}
                                                    {currentStep === 4 ? stepsInfo[2].title : ""}
                                                </h1>

                                            </div>
                                        </div>
                                    </Flex>
                                </header>

                                <div className="flex-1 overflow-y-auto z-10 mt-2">
                                    <Stepper ref={stepperRef}
                                        className="w-[100%] max-sm:w-full m-auto "
                                        initialStep={1}
                                        footerClassName="hidden"
                                        disableStepIndicators
                                        onStepChange={(step) => {
                                            if (step === EAdultFormSteps.INDICATE_SECOND_SOURCE) {
                                                setCurrentStep(EAdultFormSteps.GENERAL_CHARACTERISTICS);
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
                                                            <SecondSourceDataStep
                                                                header={stepsInfo[currentStep - 1]?.stepDescription}
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
                                                                sourceForm={EAdultFormSource.SECOND_SOURCE}
                                                                setNotificationData={setNotificationData}
                                                                nextStep={handleNextStep}
                                                                previousStep={handlePreviousStep}
                                                                sampleId={sampleId}
                                                            />
                                                        )}
                                                        {currentStep === EAdultFormSteps.GENERAL_CHARACTERISTICS && (
                                                            <Flex direction="column" className="bg-off-white p-5 font-roboto text-slate-950 rounded-2xl w-[100%] gap-y-5 m-auto max-sm:p-0">
                                                                <header className="text-primary">
                                                                    <h3 className="text-xl max-sm:text-lg md:text-xl lg:text-2xl font-bold">
                                                                        {stepsInfo[2]?.stepDescription}
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
                                                                            sourceForm={EAdultFormSource.SECOND_SOURCE}
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
                                                                <div className="flex justify-center gap-6 max-sm:flex-col">
                                                                    <Button
                                                                        onClick={handlePreviousStep}
                                                                        size="Full"
                                                                        title="Voltar"
                                                                        color="gray"
                                                                    />

                                                                    <Button
                                                                        size="Full"
                                                                        className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                                                                        onClick={handleNextStep}
                                                                        title="Salvar alterações"
                                                                        color={`${!allStepsCompleted ? "gray" : "green"}`}
                                                                        disabled={!allStepsCompleted}
                                                                        children={<Icon.FloppyDisk size={18} weight="bold" />}
                                                                    />
                                                                </div>
                                                            </Flex>
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


                    {currentStep === EAdultFormSteps.INTRODUCTION && (
                        <Flex
                            direction={"column"}
                            className="relative h-screen w-full overflow-hidden"
                        >
                            <div className="fixed inset-0 bg-default-bg max-sm:bg-default-bg-mobo bg-cover bg-center bg-no-repeat"></div>

                            <div className="relative z-10 h-full w-full overflow-y-auto">

                                <div className="min-h-full w-full flex items-center justify-center">
                                    <div className="fixed inset-0 bg-glass opacity-90 w-[90%] max-sm:border-none max-sm:!rounded-none max-sm:w-full pointer-events-none m-auto"></div>

                                    <Flex
                                        align={"center"}
                                        id="bg-div"
                                        className={`font-roboto text-white m-auto relative z-10`}
                                    >
                                        <IntroductionStep
                                            participantName={researchData.participantName}
                                            researcherName={researchData.researcherName}
                                            participantId={participantId}
                                            sourceForm={EAdultFormSource.SECOND_SOURCE}
                                            sampleId={sampleId}
                                            setNotificationData={setNotificationData}
                                        />
                                    </Flex>
                                </div>

                            </div>

                        </Flex>

                    )}

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
                </>)}
        </Notify >
    );
};

export default AdultFormSecondSourcePage;
