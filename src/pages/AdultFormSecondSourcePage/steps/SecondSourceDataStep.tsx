import * as Form from "@radix-ui/react-form";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { InputField } from "../../../components/InputField/InputField";
import { SelectField } from "../../../components/SelectField/SelectField";
import { EDUCATION_LEVEL_ARRAY, RELATIONSHIPS_ARRAY, RELATIONSHIP_TIME_ARRAY } from "../../../utils/consts.utils";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SecondSourceDTO, secondSourceDataSchema } from "../../../schemas/adultForm/secondSourceData.schema";
import { putSaveSecondSourceData, putSubmitSecondSourceData } from "../../../api/secondSource.api";
import { ISecondSource } from "../../../interfaces/secondSource.interface";

interface SecondSourceDataStepProps {
    formData?: ISecondSource;
    setFormData: (formData: ISecondSource) => void;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string }) => void;
    sampleId: string;
    saveAndExit: () => void;
}

const SecondSourceDataStep = ({
    formData,
    setFormData,
    nextStep,
    setNotificationData,
    sampleId,
    saveAndExit,
}: SecondSourceDataStepProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        watch,
    } = useForm({ resolver: yupResolver(secondSourceDataSchema), defaultValues: formData });

    const onSaveAndExit = async () => {
        try {
            const response = await putSaveSecondSourceData({ sampleId, secondSourceData: watch() });
            if (response.status === 200) {
                saveAndExit();
            }
        } catch (e: any) {
            console.error(e);
            setNotificationData({
                title: "Preenchimento inválido!",
                description: "Preencha todos os campos corretamente.",
            });
        }
};

    const onSubmit = handleSubmit(async (secondSourceData: SecondSourceDTO) => {
        try {
            const response = await putSubmitSecondSourceData({ sampleId, secondSourceData });
            if (response.status === 200) {
                if (formData) {
                    setFormData({
                        ...formData,
                        ...secondSourceData,
                    });
                } else {
                    setFormData(secondSourceData);
                }
                nextStep();
            }
        } catch (e: any) {
            console.error(e);
            setNotificationData({
                title: "Preenchimento inválido!",
                description: "Preencha todos os campos corretamente.",
            });
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
                            options={{
                                maxDate: "today",
                            }}
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
                <div className="flex justify-center gap-6">
                    <button type="button" onClick={onSaveAndExit} className="button-secondary mt-5 w-3/4 px-3 md:w-56">
                        SALVAR E SAIR
                    </button>
                    <Form.Submit asChild>
                        <button className="button-secondary mt-5 w-3/4 px-3 md:w-56">SALVAR E CONTINUAR</button>
                    </Form.Submit>
                </div>
            </Form.Root>
        </div>
    );
};

export default SecondSourceDataStep;
