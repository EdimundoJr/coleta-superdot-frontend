import { RegisterValues } from "../../schemas/registerSchema";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import saly12 from "../../assets/Saly-12.svg";
import DetailsForm from "./components/DetailsForm/DetailsForm";
import ProfilePhotoForm from "./components/ProfilePhotoForm/ProfilePhotoForm";
import { registerResearcher } from "../../api/auth.api";
import { saveTokens } from "../../utils/tokensHandler";
import LoginInfoForm from "./components/LoginInfoForm/LoginInfoForm";
import Notify from "../../components/Notify/Notify";
import { Stepper } from "../../components/Stepper/Stepper";
import { StepStateType } from "../../components/Stepper/StepperStep";

enum Steps {
    DETAILS = 0,
    PROFILE_PHOTO = 1,
    LOGIN_DATA = 2,
}

const INITIAL_VALUES: RegisterValues = {
    personalData: {
        fullName: "",
        phone: "",
        birthDate: new Date(),
        profilePhoto: undefined,
        countryState: "",
    },
    email: "",
    emailConfirmation: "",
    password: "",
    passwordConfirmation: "",
    acceptUseTerm: false,
};

const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(Steps.DETAILS);
    const [registerData, setCurrentData] = useState<RegisterValues>(INITIAL_VALUES);
    const navigate = useNavigate();

    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const handleSubmit = async (data: RegisterValues) => {
        const formData = new FormData();
        console.log(data);

        for (const key in data) {
            if (key === "personalData") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `personalData[${nestedKey}]`,
                        data["personalData"][nestedKey as keyof (typeof data)["personalData"]] as string
                    );
                }
            } else {
                formData.append(key, data[key as keyof RegisterValues] as string);
            }
        }

        if (data.personalData.profilePhoto) {
            formData.set("personalData[profilePhoto]", data.personalData.profilePhoto);
        }

        formData.set("personalData[birthDate]", data.personalData.birthDate.toISOString());

        try {
            const result = await registerResearcher(formData);
            if (result.status === 200) {
                saveTokens(result.data);
                navigate("/app/home");
            }
            console.log(result);
        } catch (error) {
            console.error(error);
            setShowNotification(true);
            setNotificationTitle("Erro no servidor.");
            setNotificationDescription("Por favor, confira as informações fornecidas e tente novamente.");
        }
    };

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    const getStepState = (stepToCompare: Steps): StepStateType => {
        if (currentStep > stepToCompare) return "DONE";
        else if (currentStep === stepToCompare) return "HOLD";
        else return "DISABLED";
    };

    return (
        <Notify
            open={showNotification}
            onOpenChange={(open: boolean) => setShowNotification(open)}
            title={notificationTitle}
            description={notificationDescription}
        >
            <div className="h-full md:flex">
                <div className="bg-light-gradient hidden h-full align-middle md:flex md:w-9/12">
                    <img className="m-auto h-full" src={saly12}></img>
                </div>
                <div className="h-full w-full justify-center overflow-auto bg-slate-100 text-[#4F4F4F]">
                    <Stepper.Root removeBackground>
                        <Stepper.Step
                            stepState={getStepState(Steps.DETAILS)}
                            stepNumber="01"
                            stepTitle="Detalhes"
                            stepDescription="Informações pessoais"
                            whiteContrast
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(Steps.PROFILE_PHOTO)}
                            stepNumber="02"
                            stepTitle="Foto (opcional)"
                            stepDescription="Carregue uma foto"
                            whiteContrast
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(Steps.LOGIN_DATA)}
                            stepNumber="03"
                            stepTitle="Login"
                            stepDescription="Informações de login"
                            whiteContrast
                        ></Stepper.Step>
                    </Stepper.Root>
                    <DetailsForm
                        handleOnSubmit={handleNextStep}
                        setStepData={setCurrentData}
                        currentData={registerData}
                        hidden={currentStep !== Steps.DETAILS}
                    />
                    <ProfilePhotoForm
                        handleOnSubmit={handleNextStep}
                        handleOnClickPreviousStep={handlePreviousStep}
                        setStepData={setCurrentData}
                        currentData={registerData}
                        hidden={currentStep !== Steps.PROFILE_PHOTO}
                    />
                    <LoginInfoForm
                        handleOnSubmit={handleSubmit}
                        handleOnClickPreviousStep={handlePreviousStep}
                        setStepData={setCurrentData}
                        currentData={registerData}
                        hidden={currentStep !== Steps.LOGIN_DATA}
                    />
                </div>
            </div>
        </Notify>
    );
};

export default RegisterPage;
