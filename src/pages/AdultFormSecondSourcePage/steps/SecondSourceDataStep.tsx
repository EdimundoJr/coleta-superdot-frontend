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

import { Button } from "../../../components/Button/Button";

interface SecondSourceDataStepProps {
    formData?: ISecondSource;
    setFormData: (formData: ISecondSource) => void;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string, type: string }) => void;
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
        formState: { errors, isValid },
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
                type: "erro"
            });
        }
    };
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate());

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
                window.scrollTo(0, 0);
            }
        } catch (e: any) {
            console.error(e);
            setNotificationData({
                title: "Preenchimento inválido!",
                description: "Preencha todos os campos corretamente.",
                type: "erro"
            });
        }
    });

    return (
        <div className="max-lg:grid max-lg:gap-y-5 relative w-[100%] xl:w-[100%] m-auto rounded-2xl p-5 max-lg:p-2">

            <Form.Root onSubmit={onSubmit} className="w-full">
                <div className="grid grid-cols-3 gap-y-5  gap-3 max-lg:grid-cols-1 max-lg:grid">
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
                    <Form.Field name="birthDate" className="w-full">
                        <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide">
                            Data de nascimento*
                        </Form.Label>
                        <Flatpicker
                            className="h-[35px] w-full rounded-[4px] px-4 text-sm"
                            placeholder="Informe sua data de nascimento"
                            multiple={false}
                            onChange={([date]) => setValue("personalData.birthDate", date)}
                            options={{
                                dateFormat: "d/m/Y",
                                maxDate: minDate,
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
                <div className="flex justify-center gap-6 mt-6">
                    <Button
                        size="Medium"
                        onClick={onSaveAndExit} title={"Salvar e Sair"} color={"primary"}                     >
                    </Button>

                    <Button
                        size="Medium"
                        className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                        title={"Salvar e Continuar"}
                        color={`${isValid ? "green" : "gray"}`}
                        type="submit"
                        disabled={!isValid}
                    />

                </div>

            </Form.Root>
        </div>
    );
};

export default SecondSourceDataStep;
