import { ChangeEvent, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithGroupSample } from "../../validators/navigationStateValidators";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SampleValues, sampleSchema } from "../../schemas/sample.schema";
import Button from "../../components/Inner/Button/Button";
import * as Separator from "@radix-ui/react-separator";
import { SelectField } from "../../components/SelectField/SelectField";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FILES_TO_UPLOAD, createSample } from "../../api/sample.api";

interface SampleFile {
    key: string;
    label: string;
    file?: File;
}

const CreateSamplePage = () => {
    /* GROUP SELECTION ASSERT */
    const [groupSelected, setGroupSelected] = useState<string>();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (stateWithGroupSample(location.state)) {
            setGroupSelected(location.state.groupSelected);
        } else {
            navigate("/app/chooseSampleGroup");
        }
    }, [location]);

    /* FILE UPLOADER HANDLER */
    const [filesToUpload, setFilesToUpload] = useState(FILES_TO_UPLOAD);
    const [filesUploaded, setFilesUploaded] = useState<SampleFile[]>();
    const [currentFileToUpload, setCurrentFileToUpload] = useState<SampleFile>(FILES_TO_UPLOAD[0]);
    const [fileErrorMessage, setFileErrorMessage] = useState("");

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) {
            return;
        }

        // Revalidate if a error was displayed
        if (fileErrorMessage) {
            console.log("revalidating");
            validateFiles();
        }

        if (currentFileToUpload) {
            if (filesUploaded?.length) {
                setFilesUploaded([
                    ...filesUploaded,
                    {
                        ...currentFileToUpload,
                        file: e.target.files[0],
                    },
                ]);
            } else {
                setFilesUploaded([
                    {
                        ...currentFileToUpload,
                        file: e.target.files[0],
                    },
                ]);
            }

            const restFilesToUpload = filesToUpload.filter((file) => file.key !== currentFileToUpload?.key);
            setFilesToUpload(restFilesToUpload);
            setCurrentFileToUpload(restFilesToUpload[0]);
        }
    };

    const handleChangeFileToUpload = (e: ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value);
        const sampleFile = filesToUpload.find((file) => file.key === e.target.value);

        if (sampleFile) {
            console.log(sampleFile);
            setCurrentFileToUpload(sampleFile);
        }
    };

    const handleRemoveFileUploaded = (file: SampleFile) => {
        if (filesToUpload?.length) {
            setFilesToUpload((files) => [...files, file]);
            setCurrentFileToUpload(filesToUpload[0]);
        } else {
            setFilesToUpload([file]);
            setCurrentFileToUpload(file);
        }

        const restFilesUploaded = filesUploaded?.filter((fileUploaded) => fileUploaded.key !== file.key);
        setFilesUploaded(restFilesUploaded);
    };

    const validateFiles = () => {
        const filesUploadedKeys = filesUploaded?.map((file) => file.key);
        if (!filesUploadedKeys) {
            setFileErrorMessage("Por favor, carregue os documentos necessários.");
            return false;
        }

        if (!filesUploadedKeys.includes(FILES_TO_UPLOAD[0].key)) {
            setFileErrorMessage("Por favor, carregue o projeto de pesquisa.");
            return false;
        } else if (!filesUploadedKeys.includes(FILES_TO_UPLOAD[1].key)) {
            setFileErrorMessage("Por favor, carregue o TCLE.");
            return false;
        }

        setFileErrorMessage("");

        return true;
    };

    /* FORM HANDLER */
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(sampleSchema) });

    const onSubmit = handleSubmit(async (data) => {
        if (!validateFiles()) {
            return;
        }
        const formData = new FormData();

        for (const key in data) {
            if (key === "research_cep") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `research_cep[${nestedKey}]`,
                        data["research_cep"][nestedKey as keyof (typeof data)["research_cep"]] as string
                    );
                }
            } else if (key === "instituition") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `instituition[${nestedKey}]`,
                        data["instituition"][nestedKey as keyof (typeof data)["instituition"]] as string
                    );
                }
            } else {
                formData.append(key, data[key as keyof SampleValues] as string);
            }
        }

        if (groupSelected) {
            formData.append("sample_group", groupSelected);
        }

        filesUploaded?.forEach((sampleFile) => {
            if (sampleFile.file) {
                formData.append(sampleFile.key, sampleFile.file);
            }
        });

        try {
            const response = await createSample(formData);
            if (response.status === 200) {
                console.log(response);
                navigate("/app/home");
            }
        } catch (error) {
            console.error(error);
        }
    });

    return (
        <>
            <header className="p-6 text-4xl font-bold text-blue-950">Definição da Amostra</header>
            <h3 className="text-blue-950">Grupo selecionado: {groupSelected}</h3>
            <Form.Root onSubmit={onSubmit} className="mx-auto mb-6 mt-11 w-11/12">
                <h3 className="text-left text-blue-900">Detalhes da amostra</h3>
                <Separator.Root className="my-6 h-px w-full bg-black" />

                {/* CONTAINER TO INPUT SAMPLE DETAILS */}
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-3">
                        <InputField
                            label="TÍTULO DA PESQUISA*"
                            errorMessage={errors.research_title?.message}
                            scope="INNER"
                            {...register("research_title")}
                        ></InputField>
                    </div>

                    <div className="col-span-3">
                        <InputField
                            label="TÍTULO DA AMOSTRA*"
                            errorMessage={errors.sample_title?.message}
                            scope="INNER"
                            {...register("sample_title")}
                        ></InputField>
                    </div>

                    <div className="col-span-3 md:flex">
                        <InputField
                            label="Código do Comitê de Ética*"
                            errorMessage={errors.research_cep?.cep_code?.message}
                            scope="INNER"
                            {...register("research_cep.cep_code")}
                        ></InputField>
                        <InputField
                            label="QUANTIDADE TOTAL DE PARTICIPANTES*"
                            errorMessage={errors.qtt_participants_requested?.message}
                            scope="INNER"
                            type="number"
                            {...register("qtt_participants_requested")}
                        ></InputField>
                    </div>

                    <div className="md:col-span-2 md:flex lg:col-span-3">
                        <InputField
                            label="REGIÃO DA AMOSTRA*"
                            errorMessage={errors.country_region?.message}
                            scope="INNER"
                            {...register("country_region")}
                        ></InputField>

                        <InputField
                            label="ESTADO DA AMOSTRA*"
                            errorMessage={errors.country_state?.message}
                            scope="INNER"
                            {...register("country_state")}
                        ></InputField>

                        <InputField
                            label="CIDADE DA AMOSTRA*"
                            errorMessage={errors.country_city?.message}
                            scope="INNER"
                            {...register("country_city")}
                        ></InputField>
                    </div>
                </div>

                {/* CONTAINER TO INPUT INSTITUITION DATA */}
                <div className="col-span-3">
                    <h3 className="text-left text-blue-900">Instituição da Amostra</h3>
                    <Separator.Root className="my-6 h-px w-full bg-black" />
                    <div className="md:flex">
                        <InputField
                            label="NOME*"
                            errorMessage={errors.instituition?.name?.message}
                            scope="INNER"
                            {...register("instituition.name")}
                        ></InputField>

                        <div className="md:w-3/12">
                            <SelectField
                                label="TIPO*"
                                errorMessage={errors.instituition?.instType?.message}
                                scope="INNER"
                                {...register("instituition.instType")}
                            >
                                <option>Pública</option>
                                <option>Particular</option>
                            </SelectField>
                        </div>
                    </div>
                </div>

                {/* CONTAINER TO UPLOAD SAMPLE FILES */}
                <div className="col-span-3">
                    <h3 className="text-left text-blue-900">Anexos</h3>
                    <Separator.Root className="my-6 h-px w-full bg-black" />
                    <div className="sm:flex">
                        <Form.Field name="sampleFiles" className="mb-6 w-full px-3">
                            <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide text-blue-700">
                                Tipo de Anexo
                            </Form.Label>
                            <div className="flex gap-2">
                                <Form.Control asChild>
                                    <select
                                        onChange={handleChangeFileToUpload}
                                        defaultValue={currentFileToUpload ? currentFileToUpload.key : ""}
                                        className="h-[35px] w-full rounded-[4px] border-2 border-gray-500 bg-white px-4 text-sm text-black"
                                    >
                                        {filesToUpload.map((file, index) => (
                                            <option key={index} value={file.key}>
                                                {file.label}
                                            </option>
                                        ))}
                                    </select>
                                </Form.Control>
                                <label
                                    htmlFor="chooseFile"
                                    className="box-border inline-flex h-[35px] items-center justify-center rounded-[4px] bg-blue-800 p-3 font-medium leading-none shadow-[0_2px_10px] shadow-blackA7 hover:bg-blue-500 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none"
                                >
                                    Anexar arquivo
                                </label>
                                <input
                                    disabled={!filesToUpload.length}
                                    id="chooseFile"
                                    onChange={handleFileUpload}
                                    hidden
                                    type="file"
                                ></input>
                            </div>
                        </Form.Field>
                    </div>
                    {filesUploaded && (
                        <div>
                            <h3 className="text-left text-blue-900">Anexos carregados</h3>
                            {filesUploaded.map((fileUploaded, index) => (
                                <div className="mt-4 flex text-black" key={index}>
                                    {fileUploaded.label}: {fileUploaded.file?.name}
                                    <div className="flex items-center">
                                        <Cross2Icon
                                            onClick={() => handleRemoveFileUploaded(fileUploaded)}
                                            className="mx-4 h-[20px] w-[20px] cursor-pointer rounded-sm bg-red-300 align-middle"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {fileErrorMessage && <p className="text-red-600">{fileErrorMessage}</p>}
                    <Separator.Root className="h-px" />
                </div>

                <Form.Submit asChild className="mt-10">
                    <Button placeholder="Enviar Solicitação" scope="INNER" />
                </Form.Submit>
            </Form.Root>
        </>
    );
};

export default CreateSamplePage;
