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
    next_status: yup.string().oneOf(SAMPLE_STATUS_ARRAY, "Por favor, selecione um status.").required(),
    qtt_participants_authorized: yup.number(),
    review_message: yup.string().required("Por favor, insira uma mensagem de revisão."),
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
    const watchStatusChange = watch("next_status");

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await createReview({
                ...data,
                sample_id: sampleId,
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
                    errorMessage={errors?.next_status?.message}
                    label="STATUS"
                    {...register("next_status")}
                >
                    <option>Pendente</option>
                    <option>Autorizado</option>
                    <option>Não Autorizado</option>
                </SelectField>
                <InputField
                    errorMessage={errors?.qtt_participants_authorized?.message}
                    disabled={watchStatusChange !== "Autorizado"}
                    label="QUANTIDADE DE PARTICIPANTES AUTORIZADOS"
                    type="number"
                    {...register("qtt_participants_authorized")}
                />
            </div>
            <TextAreaField
                errorMessage={errors?.review_message?.message}
                label="MENSAGEM"
                {...register("review_message")}
            />
            <Form.Submit asChild>
                <button className="float-right mr-3 button-primary">Salvar</button>
            </Form.Submit>
        </Form.Root>
    );
};

export default SampleReviewForm;
