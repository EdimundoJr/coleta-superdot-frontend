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
import { ISecondSource } from "../../interfaces/secondSource.interface";
import { Box, Flex, Progress, Text } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { ScrollToTop } from "../../components/ScrollToTop/ScrollToTop";

const stepsInfo = [
    {
        step: EAdultFormSteps.READ_AND_ACCEPT_DOCS,
        stepNumber: "01",
        title: "Termos",
        stepDescription: "Leia e aceite os termos",
    },
    {
        step: EAdultFormSteps.PARTICIPANT_DATA,
        stepNumber: "02",
        title: "Pessoais",
        stepDescription: "Informações pessoais",
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
        type: "",
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
                        setCurrentStep(EAdultFormSteps.READ_AND_ACCEPT_DOCS);
                        setResearcherName(res.data.researcherName);
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
            onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
            title={notificationData.title}
            description={notificationData.description}
            icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" /> : <Icon.CheckCircle size={30} color="white" />}
            className={notificationData.type === "erro" ? "bg-red-500" : "bg-green-500"}

        >

            {loading && (
                <Flex direction="column-reverse" className="absolute h-full w-full bg-black m-auto">
                    <h1 className="text-white m-auto">Aguarde...
                        <ReactLoading className="m-auto" type="spinningBubbles"></ReactLoading>
                    </h1>

                </Flex>
            )}
            <Box id="bg-div"
                className={`w-full bg-slate-950 bg-opacity-50 bg-default-bg bg-cover bg-no-repeat bg-blend-multiply font-roboto text-white p-4 h-full overflow-y-scroll`}>

                {/* STEPPER WITH THREE ROWS */}
                {/* <Flex direction="column" justify="center" align="center" gap="4" className="bg-white text-black">
                    {stepsInfo.map((step, index) => (

                        <Flex direction="column" key={index} className="w-[800px] font-roboto text-xl">
                            {currentStep === index + 1 ?
                                <>
                                    <Text as="label"> {currentStep} -{step.title}</Text>
                                    <Text as="label"> {step.stepDescription}</Text>
                                    <Progress size="3" value={(step.step * 10) + 1} color="purple" />
                                </> : <></>
                            }

                        </Flex>

                    ))}
                </Flex> */}
                {currentStep > EAdultFormSteps.INTRODUCTION && (

                    <>
                        
                            <Stepper.Root>
                            {stepsInfo.map((step, index) => (
                                <>
                                {currentStep === index + 1 ?
                                    <Flex  key={index}>
                                        <Stepper.Step
                                            stepState={getStepState(step.step)}
                                            stepNumber={step.stepNumber}
                                            stepTitle={step.title}
                                            stepDescription={step.stepDescription}
                                        />

                                    </Flex>
                                    : <></>}
                                    </>

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
                            setFormData={setFormData as (data: ISecondSource | IParticipant) => void}
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
                {/* </Flex> */}
            </Box>
        </Notify>

    );
};

export default AdultForm;
