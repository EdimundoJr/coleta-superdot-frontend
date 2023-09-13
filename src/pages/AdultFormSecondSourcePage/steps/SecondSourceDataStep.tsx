import * as Form from "@radix-ui/react-form";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../../components/InputField/InputField";
import { SelectField } from "../../../components/SelectField/SelectField";
import {
    DEVICES_ARRAY,
    EDUCATION_LEVEL_ARRAY,
    GENDER_ARRAY,
    INCOME_LEVELS_ARRAY,
    MARITAL_STATUS_ARRAY,
    RELATIONSHIPS_ARRAY,
    RELATIONSHIP_TIME_ARRAY,
} from "../../../utils/consts.utils";
import { deserializeJWTParticipantToken, saveParticipantToken } from "../../../utils/tokensHandler";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SecondSourceValues, secondSourceDataSchema } from "../../../schemas/adultForm/secondSourceData.schema";
import { postSecondSourceData } from "../../../api/secondSource.api";

interface SecondSourceDataStepProps {
    nextStep: () => void;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
    sampleId: string;
    participantId: string;
}

const SecondSourceDataStep = ({
    nextStep,
    setNotificationTitle,
    setNotificationDescription,
    sampleId,
    participantId,
}: SecondSourceDataStepProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ resolver: yupResolver(secondSourceDataSchema) });

    const onSubmit = handleSubmit(async (secondSourceData: SecondSourceValues) => {
        if (!sampleId) {
            setNotificationTitle("Amostra inválida!");
            setNotificationDescription(
                "Por favor, verifique se você está utilizando o link fornecido pelo pesquisador."
            );
            return;
        }

        try {
            const tokenDeserialized = deserializeJWTParticipantToken();
            secondSourceData.personalData.email = tokenDeserialized.participantEmail;
        } catch (e) {
            console.error(e);
            setNotificationTitle("Sessão expirada!");
            setNotificationDescription("Por favor, recarregue a página e tente novamente.");
            return;
        }

        try {
            const response = await postSecondSourceData({ sampleId, secondSourceData, participantId });
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
                        {...register("personalData.relationship")}
                        label="Relação com o avaliado*"
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.relationship?.message}
                    >
                        {RELATIONSHIPS_ARRAY.map((relationship) => (
                            <option key={relationship}>{relationship}</option>
                        ))}
                    </SelectField>
                    <SelectField
                        {...register("personalData.relationshipTime")}
                        label="Conhece o avaliado a quanto tempo?*"
                        placeholder="Selecione uma opção"
                        errorMessage={errors.personalData?.relationshipTime?.message}
                    >
                        {RELATIONSHIP_TIME_ARRAY.map((relationshipTime) => (
                            <option key={relationshipTime}>{relationshipTime}</option>
                        ))}
                    </SelectField>
                    <InputField
                        {...register("personalData.countryCity")}
                        label="Cidade*"
                        placeholder="Informe o nome da sua cidade"
                        errorMessage={errors.personalData?.countryCity?.message}
                    />
                    <InputField
                        {...register("personalData.district")}
                        label="Bairro*"
                        placeholder="Informe o nome do seu bairro"
                        errorMessage={errors.personalData?.district?.message}
                    />
                    <InputField
                        {...register("personalData.street")}
                        label="Rua*"
                        placeholder="Informe o nome da sua rua"
                        errorMessage={errors.personalData?.street?.message}
                    />
                </div>
                <Form.Submit asChild>
                    <button className="button-secondary mt-5 w-3/4 px-3 md:w-56">Continuar</button>
                </Form.Submit>
            </Form.Root>
        </div>
    );
};

export default SecondSourceDataStep;
