import * as Form from "@radix-ui/react-form";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../components/InputField/InputField";
import { SelectField } from "../../components/SelectField/SelectField";
import { adultFormPersonalInfoSchema } from "../../schemas/adultForm/personalInfo.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { EDUCATION_LEVEL_ARRAY, GENDER_ARRAY, MARITAL_STATUS_ARRAY } from "../../utils/consts.utils";
import AdultFormBackground, { AdultFormSteps } from "./components/AdultFormBackground";
import { useState } from "react";
import Notify from "../../components/Notify/Notify";
import { savePersonalInfo } from "../../api/adultForm.api";

const PersonalInfo = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ resolver: yupResolver(adultFormPersonalInfoSchema) });

    const navigate = useNavigate();
    const { sampleId } = useParams();

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const onSubmit = handleSubmit(async (data) => {
        if (!sampleId) {
            setNotificationTitle("Amostra inválida!");
            setNotificationDescription(
                "Por favor, verifique se você está utilizando o link fornecido pelo pesquisador."
            );
            return;
        }

        try {
            const response = await savePersonalInfo(sampleId, data);
            if (response.status === 200) {
                const participantId = response.data;
                navigate(`${participantId}/family-address-info`);
            } else if (response.status === 409) {
                setNotificationTitle("E-mail em uso.");
                setNotificationDescription("Esse e-mail já está sendo utilizado.");
            }
        } catch (erroLogin) {
            console.error(erroLogin);
        }
    });

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <AdultFormBackground currentStep={AdultFormSteps.PERSONAL_INFO} showKeepFilling={true}>
                <div className="grid gap-y-10">
                    <header>
                        <h1>Informações pessoais e de contato</h1>
                        <h3>Preencha os campos abaixo para continuar.</h3>
                    </header>
                    <Form.Root onSubmit={onSubmit} className="w-full">
                        <div className="grid grid-cols-1 gap-y-5 sm:grid-cols-2 md:grid-cols-3 ">
                            <InputField
                                {...register("personalData.fullName")}
                                label="Nome completo*"
                                placeholder="Insira seu nome completo"
                                errorMessage={errors.personalData?.fullName?.message}
                            />
                            <InputField
                                {...register("personalData.email")}
                                label="E-mail*"
                                placeholder="Insira seu melhor e-mail"
                                errorMessage={errors.personalData?.email?.message}
                            />
                            <InputField
                                {...register("personalData.phone")}
                                label="Whatsapp*"
                                placeholder="Insira seu número de whatsapp"
                                errorMessage={errors.personalData?.phone?.message}
                            />
                            <SelectField
                                {...register("personalData.maritalStatus")}
                                label="Estado civil*"
                                placeholder="Selecione uma opção"
                                errorMessage={errors.personalData?.maritalStatus?.message}
                            >
                                {MARITAL_STATUS_ARRAY.map((maritalStatus) => (
                                    <option>{maritalStatus}</option>
                                ))}
                            </SelectField>
                            <InputField
                                {...register("personalData.job")}
                                label="Profissão*"
                                placeholder="Qual a sua profissão?"
                                errorMessage={errors.personalData?.job?.message}
                            />
                            <InputField
                                {...register("personalData.occupation")}
                                label="Ocupação*"
                                placeholder="Qual a sua ocupação no momento?"
                                errorMessage={errors.personalData?.occupation?.message}
                            />
                            <SelectField
                                {...register("personalData.educationLevel")}
                                label="Grau de instrução*"
                                placeholder="Selecione uma opção"
                                errorMessage={errors.personalData?.educationLevel?.message}
                            >
                                {EDUCATION_LEVEL_ARRAY.map((educationLevel) => (
                                    <option>{educationLevel}</option>
                                ))}
                            </SelectField>
                            <SelectField
                                {...register("personalData.gender")}
                                label="Sexo*"
                                placeholder="Selecione uma opção"
                                errorMessage={errors.personalData?.gender?.message}
                            >
                                {GENDER_ARRAY.map((gender) => (
                                    <option>{gender}</option>
                                ))}
                            </SelectField>
                            <Form.Field name="personalData.birthDate" className="mb-6 w-full px-3">
                                <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                                    Data de nascimento*
                                </Form.Label>
                                <Flatpicker
                                    className="h-[35px] w-full rounded-[4px] px-4 text-sm"
                                    placeholder="Informe sua data de nascimento"
                                    multiple={false}
                                    onChange={([date]) => setValue("personalData.birthDate", date)}
                                />
                                {errors.personalData?.birthDate?.message && (
                                    <Form.Message className="error-message">
                                        {errors.personalData?.birthDate?.message}
                                    </Form.Message>
                                )}
                            </Form.Field>
                        </div>
                        <Form.Submit asChild>
                            <button className="button-secondary mt-5 w-3/4 px-3 md:w-56">Continuar</button>
                        </Form.Submit>
                    </Form.Root>
                </div>
            </AdultFormBackground>
        </Notify>
    );
};

export default PersonalInfo;
