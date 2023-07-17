import { RegisterValues } from "../../schemas/registerSchema";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import saly12 from "../../assets/Saly-12.svg";
import DetailsForm from "./components/DetailsForm/DetailsForm";
import ProfilePhotoForm from "./components/ProfilePhotoForm/ProfilePhotoForm";
import { registerResearcher } from "../../api/auth.api";
import { saveTokens } from "../../utils/tokensHandler";
import LoginInfoForm from "./components/LoginInfoForm/LoginInfoForm";

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
    confirmEmail: "",
    password: "",
    confirmPassword: "",
    acceptUseTerm: false,
};

const RegisterPage = () => {
    const [currentStep, setCurrentStep] = useState(Steps.DETAILS);
    const [registerData, setCurrentData] = useState<RegisterValues>(INITIAL_VALUES);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const formData = new FormData();
        console.log(registerData);

        for (const key in registerData) {
            if (key === "personalData") {
                for (const nestedKey in registerData[key]) {
                    formData.append(
                        `personalData[${nestedKey}]`,
                        registerData["personalData"][nestedKey as keyof (typeof registerData)["personalData"]] as string
                    );
                }
            } else {
                formData.append(key, registerData[key as keyof RegisterValues] as string);
            }
        }

        if (registerData.personalData.profilePhoto) {
            formData.set("personalData[profilePhoto]", registerData.personalData.profilePhoto);
        }

        formData.set("personalData[birthDate]", registerData.personalData.birthDate.toISOString());

        try {
            const result = await registerResearcher(formData);
            if (result.data) {
                saveTokens(result.data);
                navigate("/app/home");
            }
            console.log(result);
        } catch (error) {
            console.error(error);
        }
    };

    const handleNextStep = () => {
        setCurrentStep(currentStep + 1);
    };

    const handlePreviousStep = () => {
        setCurrentStep(currentStep - 1);
    };

    return (
        <>
            <div className="h-full md:flex">
                <div className="bg-default-gradient hidden h-full align-middle md:flex md:w-9/12">
                    <img className="m-auto h-full" src={saly12}></img>
                </div>
                <div className="flex h-full w-full justify-center overflow-auto bg-slate-100 text-[#4F4F4F]">
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
        </>
    );
};

export default RegisterPage;
