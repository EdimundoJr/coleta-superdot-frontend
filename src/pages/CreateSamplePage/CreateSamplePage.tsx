import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithGroupSample } from "../../validators/navigationStateValidators";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SampleValues, sampleSchema } from "../../schemas/sample.schema";
import * as Separator from "@radix-ui/react-separator";
import { createSample } from "../../api/sample.api";
import Notify from "../../components/Notify/Notify";
import { SelectField } from "../../components/SelectField/SelectField";
import { FILES_AVAILABLE_TO_CREATE_SAMPLE } from "../../utils/consts.utils";
import { SampleFile } from "../../interfaces/sample.interface";
import SampleUploadFile from "../../components/SampleUploaderFile/SampleUploaderFile";
import { validateFiles } from "../../validators/fileValidator";
import { CustomFileError } from "../../errors/fileErrors";

const CreateSamplePage = () => {
    const [sampleFiles, setSampleFiles] = useState<SampleFile[]>(FILES_AVAILABLE_TO_CREATE_SAMPLE);

    /* NOTIFY */
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    /* GROUP SELECTION ASSERT */
    const [groupSelected, setGroupSelected] = useState<string>();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (stateWithGroupSample(location.state)) {
            setGroupSelected(location.state.groupSelected);
        } else {
            navigate("/app/choose-sample-group");
        }
    }, [location.state]);

    /* FORM HANDLER */
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(sampleSchema) });

    const onSubmit = handleSubmit(async (data) => {
        try {
            validateFiles(sampleFiles);
        } catch (e: any) {
            if (e instanceof CustomFileError) {
                setNotificationTitle("Arquivos inválidos.");
                setNotificationDescription(e.message);
            }
        }

        const formData = new FormData();

        for (const key in data) {
            if (key === "researchCep") {
                for (const nestedKey in data[key]) {
                    formData.append(
                        `researchCep[${nestedKey}]`,
                        data["researchCep"][nestedKey as keyof (typeof data)["researchCep"]] as string
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
            formData.append("sampleGroup", groupSelected);
        }

        sampleFiles?.forEach((sampleFile) => {
            if (sampleFile.uploadedFile) {
                formData.append(sampleFile.key, sampleFile.uploadedFile);
            }
        });

        try {
            const response = await createSample(formData);
            if (response.status === 201) {
                console.log(response);
                navigate("/app/my-samples", {
                    state: {
                        notification: {
                            title: "Operação realizada.",
                            description: "As amostra foi cadastrada com sucesso!",
                        },
                    },
                });
            }
        } catch (error) {
            console.error(error);
            setNotificationTitle("Erro no servidor.");
            setNotificationDescription("Não foi possível cadastrar a amostra com as informações fornecidas.");
        }
    });

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <header className="p-6 text-4xl font-bold">Definição da Amostra</header>
            <h3>Grupo selecionado: {groupSelected}</h3>
            <Form.Root onSubmit={onSubmit} className="mx-auto mb-6 mt-11 w-11/12">
                <h3 className="text-left ">Detalhes da amostra</h3>
                <Separator.Root className="my-6 h-px w-full bg-black" />

                {/* CONTAINER TO INPUT SAMPLE DETAILS */}
                <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                    <div className="col-span-3">
                        <InputField
                            label="TÍTULO DA PESQUISA*"
                            placeholder="Digite o título da pesquisa"
                            errorMessage={errors.researchTitle?.message}
                            {...register("researchTitle")}
                        ></InputField>
                    </div>

                    <div className="col-span-3">
                        <InputField
                            label="TÍTULO DA AMOSTRA*"
                            placeholder="Digite o título da amostra"
                            errorMessage={errors.sampleTitle?.message}
                            {...register("sampleTitle")}
                        ></InputField>
                    </div>

                    <div className="col-span-3 md:flex">
                        <InputField
                            label="Código do Comitê de Ética*"
                            placeholder="Digite o código fornecido pelo Comitê de Ética em Pesquisa"
                            errorMessage={errors.researchCep?.cepCode?.message}
                            {...register("researchCep.cepCode")}
                        ></InputField>
                        <InputField
                            label="QUANTIDADE TOTAL DE PARTICIPANTES*"
                            placeholder="Digite a quantidade total de participantes da pesquisa"
                            errorMessage={errors.qttParticipantsRequested?.message}
                            type="number"
                            {...register("qttParticipantsRequested")}
                        ></InputField>
                    </div>

                    <div className="md:col-span-2 md:flex lg:col-span-3">
                        <InputField
                            label="REGIÃO DA AMOSTRA*"
                            placeholder="Digite a região dos participantes da amostra"
                            errorMessage={errors.countryRegion?.message}
                            {...register("countryRegion")}
                        ></InputField>

                        <InputField
                            label="ESTADO DA AMOSTRA*"
                            placeholder="Digite o estado dos participantes da amostra"
                            errorMessage={errors.countryState?.message}
                            {...register("countryState")}
                        ></InputField>

                        <InputField
                            label="CIDADE DA AMOSTRA*"
                            placeholder="Digite a cidade dos participantes da amostra"
                            errorMessage={errors.countryCity?.message}
                            {...register("countryCity")}
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
                            {...register("instituition.name")}
                        ></InputField>

                        <div className="md:w-3/12">
                            <SelectField
                                label="TIPO*"
                                errorMessage={errors.instituition?.instType?.message}
                                {...register("instituition.instType")}
                            >
                                <option>Pública</option>
                                <option>Particular</option>
                            </SelectField>
                        </div>
                    </div>
                </div>

                {/* CONTAINER TO UPLOAD FILES */}
                <SampleUploadFile sampleFiles={sampleFiles} setSampleFiles={setSampleFiles} />

                <Form.Submit asChild className="mt-10">
                    <button className="button-primary">Enviar Solicitação</button>
                </Form.Submit>
            </Form.Root>
        </Notify>
    );
};

export default CreateSamplePage;
