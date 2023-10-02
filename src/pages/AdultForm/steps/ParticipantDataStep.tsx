import * as Form from "@radix-ui/react-form";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../../components/InputField/InputField";
import { SelectField } from "../../../components/SelectField/SelectField";
import { ParticipantDataValues, participantDataSchema } from "../../../schemas/adultForm/participantData.schema";
import {
    DEVICES_ARRAY,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    MARITAL_STATUS_ARRAY,
} from "../../../utils/consts.utils";
import { deserializeJWTParticipantToken, saveParticipantToken } from "../../../utils/tokensHandler";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { postParticipantData } from "../../../api/participant.api";
import Select from "react-select";

interface ParticipantDataStepProps {
    nextStep: () => void;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
    sampleId: string;
}

const ParticipantDataStep = ({
    nextStep,
    setNotificationTitle,
    setNotificationDescription,
    sampleId,
}: ParticipantDataStepProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ resolver: yupResolver(participantDataSchema) });

    const onSubmit = handleSubmit(async (participantData: ParticipantDataValues) => {
        if (!sampleId) {
            setNotificationTitle("Amostra inválida!");
            setNotificationDescription(
                "Por favor, verifique se você está utilizando o link fornecido pelo pesquisador."
            );
            return;
        }

        try {
            const tokenDeserialized = deserializeJWTParticipantToken();
            participantData.personalData.email = tokenDeserialized.participantEmail;
        } catch (e) {
            console.error(e);
            setNotificationTitle("Sessão expirada!");
            setNotificationDescription("Por favor, recarregue a página e tente novamente.");
            return;
        }

        try {
            const response = await postParticipantData({ sampleId, participantData });
            if (response.status === 201) {
                saveParticipantToken(response.data);
                nextStep();
            }
        } catch (e: any) {
            console.error(e);
            setNotificationTitle("Não foi possível continuar.");
            setNotificationDescription("");
        }
    });

    return (
        <div className="grid gap-y-10">
            <header>
                <h1>Informações pessoais</h1>
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
                            <option key={maritalStatus}>{maritalStatus}</option>
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
                            <option key={educationLevel}>{educationLevel}</option>
                        ))}
                    </SelectField>
                    <SelectField
                        {...register("personalData.gender")}
                        label="Sexo*"
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.gender?.message}
                    >
                        {GENDER_ARRAY.map((gender) => (
                            <option key={gender}>{gender}</option>
                        ))}
                    </SelectField>
                    <Form.Field name="birthDate" className="mb-6 w-full px-3">
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
                    <InputField
                        {...register("familyData.qttChildrens")}
                        label="Número de filhos*"
                        type="number"
                        placeholder="Quantos filhos você tem?"
                        errorMessage={errors.familyData?.qttChildrens?.message}
                    />
                    <InputField
                        {...register("familyData.qttSiblings")}
                        label="Número de irmãos/irmãs*"
                        placeholder="Quantos irmãos ou irmãs você tem?"
                        type="number"
                        errorMessage={errors.familyData?.qttSiblings?.message}
                    />
                    <SelectField
                        {...register("familyData.qttFamilyMembers")}
                        label="Quantas pessoas moram com você?*"
                        placeholder="Selecione uma opção"
                        errorMessage={errors.familyData?.qttFamilyMembers?.message}
                    >
                        {[...Array(8).keys()].map((i) => (
                            <option key={i}>{i}</option>
                        ))}
                        <option key={9}>+ de 8</option>
                    </SelectField>
                    <SelectField
                        {...register("familyData.familyMonthIncome")}
                        label="Renda familiar total mensal*"
                        placeholder="selecione uma opção"
                        errorMessage={errors.familyData?.familyMonthIncome?.message}
                    >
                        {INCOME_LEVELS_ARRAY.map((income) => (
                            <option key={income}>{income}</option>
                        ))}
                    </SelectField>

                    <Form.Field name="personalData.houseDevices" className="mb-6 w-full px-3">
                        <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                            Aparelhos na casa
                        </Form.Label>
                        <Select
                            onChange={(options) =>
                                setValue(
                                    "familyData.outsideHouseDevices",
                                    [...options].map((option) => option.value)
                                )
                            }
                            isMulti
                            options={DEVICES_ARRAY.map((device) => {
                                return { value: device, label: device };
                            })}
                            className="text-black"
                            placeholder="Selecione uma ou várias opções"
                        />
                    </Form.Field>
                    <Form.Field name="personalData.outsideHouseDevices" className="mb-6 w-full px-3">
                        <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                            Fora de casa, você tem acesso a
                        </Form.Label>
                        <Select
                            onChange={(options) =>
                                setValue(
                                    "familyData.houseDevices",
                                    [...options].map((option) => option.value)
                                )
                            }
                            options={DEVICES_ARRAY.map((device) => {
                                return { value: device, label: device };
                            })}
                            isMulti
                            className="text-black"
                            placeholder="Selecione uma ou várias opções"
                        />
                    </Form.Field>
                    <InputField
                        {...register("addressData.city")}
                        label="Cidade*"
                        placeholder="Informe o nome da sua cidade"
                        errorMessage={errors.addressData?.city?.message}
                    />
                    <InputField
                        {...register("addressData.district")}
                        label="Bairro*"
                        placeholder="Informe o nome do seu bairro"
                        errorMessage={errors.addressData?.district?.message}
                    />
                    <InputField
                        {...register("addressData.street")}
                        label="Rua*"
                        placeholder="Informe o nome da sua rua"
                        errorMessage={errors.addressData?.street?.message}
                    />
                    <InputField
                        {...register("addressData.houseNumber")}
                        label="Número da casa*"
                        placeholder="informe o número da casa"
                        errorMessage={errors.addressData?.houseNumber?.message}
                    />
                </div>
                <Form.Submit asChild>
                    <button className="button-secondary mt-5 w-3/4 px-3 md:w-56">Continuar</button>
                </Form.Submit>
            </Form.Root>
        </div>
    );
};

export default ParticipantDataStep;
