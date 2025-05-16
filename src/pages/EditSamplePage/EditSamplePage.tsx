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
import * as Icon from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";


const EditSamplePage = () => {
    const [sampleFiles, setSampleFiles] = useState<SampleFile[]>(FILES_AVAILABLE_TO_CREATE_SAMPLE);
    const [sample, setSample] = useState({} as ISample);
    const sampleId = useRef<string>();
    const fileChangeRef = useRef(false);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const navigate = useNavigate();
    const location = useLocation();
    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };



    /* FORM HANDLER */
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({ resolver: yupResolver(sampleSchema) });
    useEffect(() => {
        if (stateWithSample(location.state)) {
            const sample = location.state.sample;
            sampleId.current = sample._id;
            setSample(sample);
            reset(sample);
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
            scrollToTop();
        }
    }, [navigate, location, reset]);

    const onSubmit = handleSubmit(async (data) => {
        if (!sampleId.current) return;
        if (fileChangeRef.current) {
            try {
                validateFiles(sampleFiles);
            } catch (e: any) {
                if (e instanceof CustomFileError) {
                    setNotificationData({
                        title: "Erro ao enviar arquivo.",
                        description: e.message,
                        type: "erro",
                    });
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
                scrollToTop();
            }
        } catch (error) {
            console.error(error);
            setNotificationData({
                title: "Erro no servidor.",
                description: "Não foi possível atualizar as informações da amostra.",
                type: "erro",
            });
        }
    });

    return (
        <>

            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
                title={notificationData.title}
                description={notificationData.description}
                icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
                className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
            >

                <Form.Root
                    onSubmit={onSubmit}
                    className="mx-auto mb-6 mt-11 max-sm:mt-5 w-11/12 opacity-0 animate-fade-in animate-delay-100 animate-fill-forwards"
                >
                    <h3 className="text-left text-primary animate-fade-in animate-delay-200">
                        Detalhes da amostra
                    </h3>

                    <Separator.Root className="my-6 h-px w-full bg-black animate-grow-width animate-delay-300" />

                    {/* CONTAINER TO INPUT SAMPLE DETAILS */}
                    <div className=" gap-4 ">
                        <div className="col-span-3 animate-fade-in animate-delay-300">
                            <InputField
                                label="TÍTULO DA PESQUISA*"
                                // defaultValue={sample.researchTitle}
                                errorMessage={errors.researchTitle?.message}
                                {...register("researchTitle")}
                            />
                        </div>

                        <div className="col-span-3 animate-fade-in animate-delay-400">
                            <InputField
                                label="TÍTULO DA AMOSTRA*"
                                // defaultValue={sample.sampleTitle}
                                errorMessage={errors.sampleTitle?.message}
                                {...register("sampleTitle")}
                            />
                        </div>

                        <div className="col-span-3 md:flex gap-2 animate-fade-in animate-delay-500">
                            <InputField
                                label="Código do Comitê de Ética*"
                                // defaultValue={sample.researchCep?.cepCode}
                                errorMessage={errors.researchCep?.cepCode?.message}
                                {...register("researchCep.cepCode")}
                                className="flex-1 "
                            />
                            <InputField
                                label="QUANTIDADE TOTAL DE PARTICIPANTES*"
                                // defaultValue={sample.qttParticipantsRequested}
                                errorMessage={errors.qttParticipantsRequested?.message}
                                type="number"
                                {...register("qttParticipantsRequested")}
                                className="flex-1 "
                            />
                        </div>

                        <div className="md:col-span-2 md:flex lg:col-span-3 mb-12 gap-2 animate-fade-in animate-delay-600">
                            <SelectField
                                label="REGIÃO DA AMOSTRA*"
                                // defaultValue={sample.countryRegion}
                                errorMessage={errors.countryRegion?.message}
                                {...register("countryRegion")}
                                className="md:flex-1 w-full md:w-auto "
                            >
                                <option value="Norte">Norte</option>
                                <option value="Nordeste">Nordeste</option>
                                <option value="Centro-Oeste">Centro-Oeste</option>
                                <option value="Sudeste">Sudeste</option>
                                <option value="Sul">Sul</option>
                            </SelectField>

                            <InputField
                                label="ESTADO DA AMOSTRA*"
                                // defaultValue={sample.countryState}
                                errorMessage={errors.countryState?.message}
                                {...register("countryState")}
                                className="flex-1 "
                            />

                            <InputField
                                label="CIDADE DA AMOSTRA*"
                                // defaultValue={sample.countryCity}
                                errorMessage={errors.countryCity?.message}
                                {...register("countryCity")}
                                className="flex-1 "
                            />
                        </div>
                    </div>

                    {/* CONTAINER TO INPUT INSTITUITION DATA */}
                    <div className="col-span-3 gap-2 animate-fade-in animate-delay-700">
                        <h3 className="text-left text-primary">Instituição da Amostra</h3>
                        <Separator.Root className="my-6 h-px w-full bg-black animate-grow-width" />

                        <div className="flex justify-center gap-2 max-lg:flex-col">
                            <InputField
                                label="NOME*"
                                // defaultValue={sample.instituition?.name}
                                errorMessage={errors.instituition?.name?.message}
                                {...register("instituition.name")}
                            />

                            <SelectField
                                label="TIPO*"
                                errorMessage={errors.instituition?.instType?.message}
                                // defaultValue={sample.instituition?.instType}
                                {...register("instituition.instType")}
                            >
                                <option>Pública</option>
                                <option>Particular</option>
                            </SelectField>
                        </div>
                    </div>

                    {/* CONTAINER TO UPLOAD FILES */}
                    <SampleUploadFile
                        sampleFiles={sampleFiles}
                        setSampleFiles={setSampleFiles}
                        notifyFileChange={fileChangeRef}
                    />

                    <Form.Submit asChild className="mt-10 animate-bounce-in">
                        <Button
                            size="Medium"
                            color={`green`}
                            title={"Salvar e Enviar Solicitação"}
                        />
                    </Form.Submit>
                </Form.Root>
            </Notify>
        </>
    );
};

export default EditSamplePage;
