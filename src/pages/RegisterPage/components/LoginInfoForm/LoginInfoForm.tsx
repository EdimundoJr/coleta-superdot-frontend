import * as Form from "@radix-ui/react-form";
import * as Checkbox from "@radix-ui/react-checkbox";
import { useForm } from "react-hook-form";
import { CheckIcon } from "@radix-ui/react-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { RegisterValues, loginInfoSchema } from "../../../../schemas/registerSchema";
import { useState } from "react";

interface LoginInfoProps {
    handleOnSubmit: () => void;
    handleOnClickPreviousStep: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;
    hidden: boolean;
}

const LoginInfoForm = ({
    handleOnSubmit,
    handleOnClickPreviousStep,
    setStepData,
    currentData,
    hidden,
}: LoginInfoProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginInfoSchema) });
    const [errorUseTerm, setErrorUseTerm] = useState("");
    const [useTermChecked, setUseTermChecked] = useState(false);

    const onSubmit = handleSubmit((stepData) => {
        setErrorUseTerm("");
        if (!useTermChecked) {
            setErrorUseTerm("É obrigatório aceitar o termo de uso.");
            return;
        }
        setStepData({
            ...currentData,
            ...stepData,
            acceptUseTerm: useTermChecked,
        });
        handleOnSubmit();
    });

    const handleCheckUseTerm = (checked: boolean | "indeterminate") => {
        if (typeof checked === "boolean") setUseTermChecked(checked);
    };

    return (
        <Form.Root about="Form to provide login info." hidden={hidden} onSubmit={onSubmit} className="m-auto w-10/12">
            <h1>Criar uma conta</h1>
            <h3>Seus dados de acesso</h3>
            <div className="mt-20 grid gap-y-10">
                <div className="gap-2 md:flex">
                    <Form.Field name="email" className="w-full">
                        <Form.Control placeholder="E-mail*" type="email" {...register("email")}></Form.Control>
                        {errors?.email && <Form.Message className="error-message">{errors.email.message}</Form.Message>}
                    </Form.Field>

                    <Form.Field name="confirmEmail" className="w-full">
                        <Form.Control
                            type="email"
                            placeholder="Confirmar e-mail*"
                            {...register("confirmEmail")}
                        ></Form.Control>
                        {errors?.confirmEmail && (
                            <Form.Message className="error-message">{errors.confirmEmail.message}</Form.Message>
                        )}
                    </Form.Field>
                </div>
                <div className="gap-2 md:flex">
                    <Form.Field name="password" className="w-full">
                        <Form.Control type="password" placeholder="Senha*" {...register("password")}></Form.Control>
                        {errors?.password && (
                            <Form.Message className="error-message">{errors.password.message}</Form.Message>
                        )}
                    </Form.Field>

                    <Form.Field name="confirmPasssword" className="w-full">
                        <Form.Control
                            type="password"
                            placeholder="Confirmar senha*"
                            {...register("confirmPassword")}
                        ></Form.Control>
                        {errors?.confirmPassword && (
                            <Form.Message className="error-message">{errors.confirmPassword.message}</Form.Message>
                        )}
                    </Form.Field>
                </div>
                <Form.Field name="acceptUseTerm">
                    <div className="flex items-center">
                        <Checkbox.Root
                            onCheckedChange={handleCheckUseTerm}
                            id="acceptUseTerm"
                            className="border-mauve9 shadow-blackA7 hover:bg-violet3 flex h-[20px] min-w-[20px] rounded-[4px] border bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_2px_black]"
                        >
                            <Checkbox.Indicator className=" text-violet11">
                                <CheckIcon className="h-[20px] w-[20px]" />
                            </Checkbox.Indicator>
                        </Checkbox.Root>
                        <label
                            htmlFor="acceptUseTerm"
                            className="pl-[15px] text-left text-[15px] leading-6 text-rose-500 "
                        >
                            <p>
                                Estou ciente de que todos os <b>dados de pesquisa</b> que forem cadastrados na
                                plataforma poderão ser disponibilizados publicamente.
                            </p>
                        </label>
                    </div>
                    {errorUseTerm && <Form.Message className="error-message mt-7">{errorUseTerm}</Form.Message>}
                </Form.Field>
                <div className="mt-8 flex gap-x-2">
                    <button onClick={handleOnClickPreviousStep} type="button" className="button-neutral-light w-full ">
                        Voltar
                    </button>
                    <button className="button-neutral-dark w-full ">Continuar</button>
                </div>
                <div className=" text-red-600 ">* Campos obrigatórios</div>
            </div>
        </Form.Root>
    );
};

export default LoginInfoForm;
