import * as Form from "@radix-ui/react-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SelectField } from "../../SelectField/SelectField";
import { TextAreaField } from "../../TextAreaField/TextAreaField";
import { createReview } from "../../../api/sampleReview.api";
import { InputField } from "../../InputField/InputField";
import { SAMPLE_STATUS_ARRAY, SampleStatus } from "../../../utils/consts.utils";

const sampleReviewFormSchema = yup.object({
    nextStatus: yup.string().oneOf(SAMPLE_STATUS_ARRAY, "Por favor, selecione um status.").required(),
    qttParticipantsAuthorized: yup.number(),
    reviewMessage: yup.string().required("Por favor, insira uma mensagem de revisão."),
});

interface SampleReviewFormProps {
    sampleId: string;
    currentStatus?: SampleStatus;
    onFinish: () => void;
}

const SampleReviewForm = ({ sampleId, onFinish, currentStatus }: SampleReviewFormProps) => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(sampleReviewFormSchema) });
    const watchStatusChange = watch("nextStatus");

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await createReview({
                ...data,
                sampleId: sampleId,
            });
            if (response.status === 200) {
                onFinish();
                return;
            }
            console.log(response);
        } catch (e) {
            console.error(e);
        }
    });

    return (
        <Form.Root onSubmit={onSubmit}>
            <div className="gap-x-2 lg:flex">
                <SelectField
                    defaultValue={currentStatus}
                    errorMessage={errors?.nextStatus?.message}
                    label="STATUS"
                    {...register("nextStatus")}
                >
                    <option>Pendente</option>
                    <option>Autorizado</option>
                    <option>Não Autorizado</option>
                </SelectField>
                <InputField
                    errorMessage={errors?.qttParticipantsAuthorized?.message}
                    disabled={watchStatusChange !== "Autorizado"}
                    label="QUANTIDADE DE PARTICIPANTES AUTORIZADOS"
                    type="number"
                    {...register("qttParticipantsAuthorized")}
                />
            </div>
            <TextAreaField
                errorMessage={errors?.reviewMessage?.message}
                label="MENSAGEM"
                {...register("reviewMessage")}
            />
            <Form.Submit asChild>
                <button className="button-primary float-right mr-3">Salvar</button>
            </Form.Submit>
        </Form.Root>
    );
};

export default SampleReviewForm;
