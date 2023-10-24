import { useEffect, useRef, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../components/InputField/InputField";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SampleValues, sampleSchema } from "../../schemas/sample.schema";
import * as Separator from "@radix-ui/react-separator";
import { editSample } from "../../api/sample.api";
import Notify from "../../components/Notify/Notify";
import { SelectField } from "../../components/SelectField/SelectField";
import { FILES_AVAILABLE_TO_CREATE_SAMPLE } from "../../utils/consts.utils";
import { ISample, SampleFile } from "../../interfaces/sample.interface";
import SampleUploadFile from "../../components/SampleUploaderFile/SampleUploaderFile";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithSample } from "../../validators/navigationStateValidators";
import { CustomFileError } from "../../errors/fileErrors";
import { validateFiles } from "../../validators/fileValidator";

const EditSamplePage = () => {
    const [sampleFiles, setSampleFiles] = useState<SampleFile[]>(FILES_AVAILABLE_TO_CREATE_SAMPLE);
    const [sample, setSample] = useState({} as ISample);
    const sampleId = useRef<string>();
    const fileChangeRef = useRef(false);

    /* NOTIFY */
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (stateWithSample(location.state)) {
            const sample = location.state.sample;
            sampleId.current = sample._id;
            setSample(sample);
            // When the uploadedFile is defined in a object inside the sampleFiles state, the file is displayed as "uploaded".
            setSampleFiles(
                sampleFiles.map((sampleFile) => {
                    // If the sample sent by the my-samples pages has the jsonFileKey of the correspondent file, I set the uploadedFile field.
                    if (sample.researchCep[sampleFile.jsonFileKey as keyof ISample["researchCep"]]) {
                        return {
                            ...sampleFile,
                            uploadedFile: new File([], "arquivo.pdf", { type: "application/pdf" }),
                            backendFileName: sample.researchCep[sampleFile.jsonFileKey as keyof ISample["researchCep"]],
                        };
                    } else {
                        return sampleFile;
                    }
                })
            );
        } else {
            navigate("/app/my-samples");
        }
    }, [navigate, location]);

    /* FORM HANDLER */
    const {
        register,
        watch,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(sampleSchema), defaultValues: sample });

    const onSubmit = handleSubmit(async (data) => {
        if (!sampleId.current) return;
        if (fileChangeRef.current) {
            try {
                validateFiles(sampleFiles);
            } catch (e: any) {
                if (e instanceof CustomFileError) {
                    setNotificationTitle("Arquivos inválidos.");
                    setNotificationDescription(e.message);
                }
                return;
            }
        }

        const formData = new FormData();

        for (const key in data) {
            const validKeys: SampleValues = {
                researchTitle: "",
                sampleTitle: "",
                sampleGroup: undefined,
                qttParticipantsRequested: 0,
                researchCep: {
                    cepCode: "",
                    researchDocument: "",
                },
                countryRegion: "Nordeste",
                countryState: "",
                countryCity: "",
                instituition: {
                    name: "",
                    instType: "Particular",
                },
            };
            if (key in validKeys) {
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
        }

        sampleFiles?.forEach((sampleFile) => {
            // If the file size is 0, then the user not change the file.
            if (sampleFile.uploadedFile && sampleFile.uploadedFile.size) {
                formData.set(sampleFile.key, sampleFile.uploadedFile);
            }
        });

        try {
            const response = await editSample(sampleId.current, formData);
            if (response.status === 200) {
                navigate("/app/my-samples", {
                    state: {
                        notification: {
                            title: "Operação realizada.",
                            description: "As informações da amostra foram atualizadas.",
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
            <h3>Grupo selecionado: {watch("sampleGroup")}</h3>
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
                <SampleUploadFile
                    sampleFiles={sampleFiles}
                    setSampleFiles={setSampleFiles}
                    notifyFileChange={fileChangeRef}
                />

                <div className="mt-10 flex justify-center gap-2">
                    <Form.Submit asChild>
                        <button className="button-neutral-light">Salvar alterações</button>
                    </Form.Submit>
                    <button onClick={() => navigate("/app/my-samples")} type="button" className="button-primary">
                        Cancelar
                    </button>
                </div>
            </Form.Root>
        </Notify>
    );
};

export default EditSamplePage;
