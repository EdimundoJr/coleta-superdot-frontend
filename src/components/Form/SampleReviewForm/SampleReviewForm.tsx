import * as Form from "@radix-ui/react-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { SelectField } from "../../SelectField/SelectField";
import { TextAreaField } from "../../TextAreaField/TextAreaField";
import { createReview } from "../../../api/sampleReview.api";
import { InputField } from "../../InputField/InputField";
import { SAMPLE_STATUS_ARRAY } from "../../../utils/consts.utils";
import { SampleSummary } from "../../../api/sample.api";
import { Button } from "../../Button/Button";
import { Flex } from "@radix-ui/themes";
import { useState } from "react";

interface SampleReviewFormProps {
    sample?: SampleSummary;
    onFinish: () => void;
}

const SampleReviewForm = ({ sample, onFinish }: SampleReviewFormProps) => {
    const [loading, setLoading] = useState(false);

    if (!sample) return null;

    const sampleReviewFormSchema = yup.object({
        nextStatus: yup
            .string()
            .oneOf(SAMPLE_STATUS_ARRAY, "Por favor, selecione um status.")
            .notOneOf([sample?.currentStatus], "Por favor, modifique o status da amostra.")
            .required(),
        qttParticipantsAuthorized: yup
            .number()
            .nullable()
            .transform((value, originalValue) => (originalValue === "" ? null : value))
            .when('nextStatus', {
                is: "Autorizado",
                then: (schema) => schema
                    .required("Por favor, informe a quantidade de participantes autorizados.")
                    .max(
                        sample?.qttParticipantsRequested || 0,
                        "A quantidade de participantes autorizados precisa ser menor ou igual a quantidade de participantes solicitados."
                    ),
                otherwise: (schema) => schema.nullable().notRequired()
            }),
        reviewMessage: yup.string().required("Por favor, insira uma mensagem de revisão."),
    });

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        // eslint-disable-next-line react-hooks/rules-of-hooks
    } = useForm({ resolver: yupResolver(sampleReviewFormSchema) });
    const watchStatusChange = watch("nextStatus");

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await createReview({
                ...data,
                sampleId: sample?.sampleId || "",
            });
            if (response.status === 200) {
                onFinish();
                return;
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    });

    return (
        <Form.Root onSubmit={onSubmit}>
            <Flex direction="column" className="gap-3">
                <SelectField
                    defaultValue={sample?.currentStatus}
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
                <TextAreaField
                    className="border-2 border-stone-200"
                    errorMessage={errors?.reviewMessage?.message}
                    label="MENSAGEM (essa mensagem será enviada para o e-mail do pesquisador)"
                    {...register("reviewMessage")}
                />
            </Flex>

            <Form.Submit asChild>
                <Button loading={loading} className="w-full" title={"Salvar"} color={"green"} size={"Medium"}></Button>
            </Form.Submit>
        </Form.Root>
    );
};

export default SampleReviewForm;
