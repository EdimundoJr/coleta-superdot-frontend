import * as Form from "@radix-ui/react-form";
import noImage from "../../../../assets/no-image.jpg";
import { RegisterValues } from "../../../../schemas/registerSchema";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button } from "../../../../components/Button/Button";

interface ProfilePhotoProps {
    handleOnSubmit: () => void;
    handleOnClickPreviousStep: () => void;
    setStepData: (stepData: RegisterValues) => void;
    currentData: RegisterValues;
}

const ProfilePhotoForm = ({
    handleOnSubmit,
    handleOnClickPreviousStep,
    setStepData,
    currentData,
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
            onSubmit={onSubmit}
            className="m-auto"
        >
            <h1>Criar uma conta</h1>
            <h3>Foto de perfil (opcional)</h3>
            <div className="text-center flex flex-col">
                <div className="m-auto">
                    <img
                        className="mx-auto h-64 w-64 rounded-full mb-5 object-cover"
                        src={photoUploaded ? URL.createObjectURL(photoUploaded) : noImage}
                    ></img>
                </div>
                <Form.Field name="personalData.profilePhoto" className="m-auto h-full">

                    <Form.Label asChild>
                        <label className="block cursor-pointer py-2 px-4 text-sm bg-green-500 text-white hover:bg-green-600 active:bg-green-700 btn-primary rounded">Carregar foto</label>
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
            <div className="mt-8 flex gap-x-2 ">
                <Button onClick={handleOnClickPreviousStep} type="button" className="w-full" title={"Voltar"} color={"gray"} size={"Large"}>

                </Button>
                <Button className="w-full" title={"Continuar"} color={"primary"} size={"Large"}></Button>
            </div>
        </Form.Root>
    );
};

export default ProfilePhotoForm;
