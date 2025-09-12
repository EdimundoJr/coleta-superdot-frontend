import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { RegisterValues, detailsSchema } from "../../../../schemas/registerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";
import { Button } from "../../../../components/Button/Button";
import { Portuguese } from "flatpickr/dist/l10n/pt.js";


interface DetailsFormProps {
    handleOnSubmit: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;

}

const DetailsForm = ({ handleOnSubmit, setStepData, currentData }: DetailsFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
        setValue,
    } = useForm({ resolver: yupResolver(detailsSchema) });

    const onSubmit = handleSubmit((stepData) => {
        setStepData({
            ...currentData,
            ...stepData,
        });
        handleOnSubmit();
    });
    const today = new Date();
    const minDate = new Date(today.getFullYear() - 8, today.getMonth(), today.getDate());

    return (
        <Form.Root
            about="Form to provide personal details."
            onSubmit={onSubmit}
            className="mt-8 m-auto w-10/12"
        >
            <h1>Criar uma conta</h1>
            <h3>Seus dados</h3>
            <div className="mt-8 grid gap-y-10 max-sm:gap-y-4">
                <div>
                    <Form.Field name="personalData.fullName" className="col-span-3">
                        <Form.Control
                            placeholder="Nome completo*"
                            {...register("personalData.fullName")}
                        ></Form.Control>
                        {errors?.personalData?.fullName && (
                            <Form.Message className="error-message">
                                {errors.personalData.fullName.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>
                <div className="gap-2 flex max-sm:flex-col max-sm:gap-4">
                    <Form.Field name="personalData.phone" className="w-full">
                        <Form.Control placeholder="Telefone*" {...register("personalData.phone")}></Form.Control>
                        {errors?.personalData?.phone && (
                            <Form.Message className="error-message">{errors.personalData.phone.message}</Form.Message>
                        )}
                    </Form.Field>

                    <Form.Field name="personalData.birthDate" className="w-full">
                        <Flatpicker
                            placeholder="Data de nascimento*"
                            multiple={false}
                            onChange={([date]) => setValue("personalData.birthDate", date)}
                            options={{
                                dateFormat: "d/m/Y",
                                maxDate: minDate,
                                locale: Portuguese,
                            }}
                        />
                        {errors?.personalData?.birthDate && (
                            <Form.Message className="error-message">
                                {errors.personalData.birthDate.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>
                <div className="gap-2 flex max-sm:flex-col max-sm:gap-4">
                    <Form.Field name="instituition" className="w-full">
                        <Form.Control
                            placeholder="Instituição de trabalho*"
                            {...register("instituition")}
                        ></Form.Control>
                        {errors?.instituition && (
                            <Form.Message className="error-message">{errors.instituition.message}</Form.Message>
                        )}
                    </Form.Field>

                    <Form.Field name="personalData.countryState" className="w-full">
                        <Form.Control placeholder="Estado*" {...register("personalData.countryState")}></Form.Control>
                        {errors?.personalData?.countryState && (
                            <Form.Message className="error-message">
                                {errors.personalData.countryState.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>

                <Button
                    size="Large"
                    className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                    title={"Continuar"}
                    color={`${isValid ? "green" : "gray"}`}
                    disabled={!isValid}
                />

                <div>
                    <div className=" text-red-600 ">* Campos obrigatórios</div>
                    <div className="mt-5 text-xs max-sm:mt-2">
                        <Link className="" to="/">Já tenho uma conta...</Link>
                    </div>
                </div>
            </div>
        </Form.Root>
    );
};

export default DetailsForm;
