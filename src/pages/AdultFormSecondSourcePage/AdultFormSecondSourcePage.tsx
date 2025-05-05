import { useEffect, useRef, useState } from "react";
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
import * as Icon from "@phosphor-icons/react";
import { Box, Flex } from "@radix-ui/themes";
import Waves from "../../components/WavesBG/Waves";
import { Button } from "../../components/Button/Button";
import Stepper, { Step } from "../../components/NewStepper/NewStteper";
import logo from "../../assets/Logo-GRUPAC.png"

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


    const allStepsCompleted = Object.values(completedSteps).every(Boolean);

    const handleNextStep = () => {
        window.scrollTo(0, 0);
        if (currentStep === EAdultFormSteps.GENERAL_CHARACTERISTICS) {
            setNotificationData({
                title: "Questionário finalizado!",
                description: "Agradecemos pelas respostas. Em breve o pesquisador entrará em contato.",
                type: "success"
            });
            setCurrentStep(EAdultFormSteps.INTRODUCTION);
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
        window.scrollTo(0, 0);
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

    const saveAndExit = () => {
        clearTokens();
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


            {currentStep != EAdultFormSteps.INTRODUCTION && (

                <Flex direction={"column"} className="w-full m-auto ">
                    <div className="absolute w-full h-full">

                    </div>

                    <img className="relative m-auto w-36 mb-[10px]" src={logo} alt="Logo"></img>
                    <Stepper ref={stepperRef}
                        className="w-[80%] max-sm:w-full m-auto"
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
                                <header className="text-primary">
                                    <Flex direction={"column"} justify={"center"} align={"center"} className="">
                                        {stepInfo.icon}
                                        <Flex direction={"column"}>
                                            <h1> {stepInfo.title} </h1>
                                            <h2>{stepInfo.stepDescription}</h2>
                                        </Flex>
                                    </Flex>
                                </header>

                                <Flex id="bg-div" className="bg-primary font-roboto w-full">
                                    <Flex direction="column" className={`w-full bg-off-white p-5 pb-5 max-sm:p-1`}>

                                        {currentStep === EAdultFormSteps.PARTICIPANT_DATA && (
                                            <SecondSourceDataStep
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
                                                sourceForm={EAdultFormSource.SECOND_SOURCE}
                                                setNotificationData={setNotificationData}
                                                nextStep={handleNextStep}
                                                previousStep={handlePreviousStep}
                                                sampleId={sampleId}
                                                saveAndExit={saveAndExit}
                                            />
                                        )}

                                        {currentStep === EAdultFormSteps.HIGH_ABILITIES && (<div> aqui </div>)}

                                        {currentStep === EAdultFormSteps.GENERAL_CHARACTERISTICS && (
                                            <Flex direction="column" className="m-auto">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-5">
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
                                                <div className="flex justify-center gap-6">
                                                    <Button
                                                        onClick={handlePreviousStep}
                                                        size="Medium"
                                                        title="Voltar"
                                                        color="primary"
                                                    />
                                                    <Button
                                                        size="Medium"
                                                        onClick={saveAndExit}
                                                        title="Salvar e Sair"
                                                        color="primary"
                                                    />
                                                    <Button
                                                        size="Medium"
                                                        className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                                                        onClick={handleNextStep}
                                                        title="Salvar e Continuar"
                                                        color={`${!allStepsCompleted ? "gray" : "green"}`}
                                                        disabled={!allStepsCompleted}
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
                    {/* {showFooter && <footer className="bg-primary h-10 "></footer>} */}


                </Flex>

            )}



            {loading && (

                <Flex direction="column-reverse" className="absolute overflow-hidden h-screen w-full bg-white m-auto">
                    <h1 className="text-primary m-auto">Aguarde...
                        <ReactLoading color="#6e56cf" className="m-auto" type="spinningBubbles"></ReactLoading>
                    </h1>
                    <Waves
                        lineColor="#6e56cf"
                        backgroundColor="rgba(255, 255, 255, 0)"
                        waveSpeedX={0.02}
                        waveSpeedY={0.01}
                        waveAmpX={40}
                        waveAmpY={20}
                        friction={0.9}
                        tension={0.01}
                        maxCursorMove={120}
                        xGap={12}
                        yGap={36}
                    />

                </Flex>
            )}


            {currentStep === EAdultFormSteps.INTRODUCTION && (
                <Flex direction={"column"} className="relative h-full lg:h-full max-sm:h-fit   md:h-auto sm:h-auto pb-4 w-full bg-default-bg max-sm:bg-default-bg-mobo bg-center bg-no-repeat bg-cover">
                    <Flex align={"center"} id="bg-div" className={`font-roboto text-white   m-auto`}>
                        <IntroductionStep
                            participantName={researchData.participantName}
                            researcherName={researchData.researcherName}
                            participantId={participantId}
                            sourceForm={EAdultFormSource.SECOND_SOURCE}
                            sampleId={sampleId}
                            setNotificationData={setNotificationData}
                        />
                    </Flex>
                </Flex>

            )}

        </Notify >
    );
};

export default AdultFormSecondSourcePage;
