import * as Form from "@radix-ui/react-form";
import noImage from "../../../../assets/no-image.jpg";
import { RegisterValues } from "../../../../schemas/registerSchema";
import { ChangeEvent, FormEvent, useState } from "react";

interface ProfilePhotoProps {
    handleOnSubmit: () => void;
    handleOnClickPreviousStep: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;
    hidden: boolean;
}

const ProfilePhotoForm = ({
    handleOnSubmit,
    handleOnClickPreviousStep,
    setStepData,
    currentData,
    hidden,
}: ProfilePhotoProps) => {
    const [photoUploaded, setPhotoUploaded] = useState<File>();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStepData({
            ...currentData,
            personalData: {
                ...currentData.personalData,
                profilePhoto: photoUploaded,
            },
        });
        handleOnSubmit();
    };

    const handleChangeImage = (e: ChangeEvent<HTMLInputElement>) => {
        setErrorMessage("");
        const files = e.target.files;
        if (files?.length) {
            if (!files[0].type.startsWith("image")) {
                setErrorMessage("Arquivo inválido. Por favor, carregue uma imagem.");
            } else {
                setPhotoUploaded(files[0]);
            }
        }
    };

    return (
        <Form.Root
            about="Form to provide a profile photo."
            hidden={hidden}
            onSubmit={onSubmit}
            className="m-auto w-10/12"
        >
            <h1>Criar uma conta</h1>
            <h3>Foto de perfil (opcional)</h3>
            <div className="my-16 text-center sm:flex">
                <div className="m-auto">
                    <img
                        className="mx-auto h-64 w-64 rounded-full"
                        src={photoUploaded ? URL.createObjectURL(photoUploaded) : noImage}
                    ></img>
                </div>
                <Form.Field name="personalData.profilePhoto" className="m-auto h-full">
                    <Form.Label asChild>
                        <label className="button-neutral-dark block">Carregar foto</label>
                    </Form.Label>
                    <Form.Control
                        className="hidden"
                        type="file"
                        name="personalData.profilePhoto"
                        onChange={handleChangeImage}
                    ></Form.Control>
                    {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
                </Form.Field>
            </div>
            <div className="mt-8 flex gap-x-2">
                <button onClick={handleOnClickPreviousStep} type="button" className="button-neutral-light w-full ">
                    Voltar
                </button>
                <button className="button-neutral-dark w-full ">Continuar</button>
            </div>
        </Form.Root>
    );
};

export default ProfilePhotoForm;
