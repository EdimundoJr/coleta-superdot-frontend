import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { RegisterValues, detailsSchema } from "../../../../schemas/registerSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "react-router-dom";
import Flatpicker from "react-flatpickr";
import "flatpickr/dist/themes/airbnb.css";

interface DetailsFormProps {
    handleOnSubmit: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;
    hidden: boolean;
}

const DetailsForm = ({ handleOnSubmit, setStepData, currentData, hidden }: DetailsFormProps) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm({ resolver: yupResolver(detailsSchema) });

    const onSubmit = handleSubmit((stepData) => {
        setStepData({
            ...currentData,
            ...stepData,
        });
        handleOnSubmit();
    });

    return (
        <Form.Root
            hidden={hidden}
            about="Form to provide personal details."
            onSubmit={onSubmit}
            className="m-auto w-10/12"
        >
            <h1>Criar uma conta</h1>
            <h3>Seus dados</h3>
            <div className="mt-16 grid gap-y-10">
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
                <div className="gap-2 md:flex">
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
                                maxDate: 'today',
                                closeOnSelect: true,
                            }}
                        />
                        {errors?.personalData?.birthDate && (
                            <Form.Message className="error-message">
                                {errors.personalData.birthDate.message}
                            </Form.Message>
                        )}
                    </Form.Field>
                </div>
                <div className="gap-2 md:flex">
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

                <button className="button-neutral-dark w-full  ">Continuar</button>
                <div>
                    <div className=" text-red-600 ">* Campos obrigatórios</div>
                    <div className="mt-5 text-xs">
                        <Link to="/">Já tenho uma conta...</Link>
                    </div>
                </div>
            </div>
        </Form.Root>
    );
};

export default DetailsForm;
