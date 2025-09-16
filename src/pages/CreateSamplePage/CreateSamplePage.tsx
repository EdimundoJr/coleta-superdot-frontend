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
import * as Icon from "@phosphor-icons/react";

import { Button } from "../../components/Button/Button";

const CreateSamplePage = () => {
    const [sampleFiles, setSampleFiles] = useState<SampleFile[]>(FILES_AVAILABLE_TO_CREATE_SAMPLE);
    const [sampleFileError, setSampleFileError] = useState("");
    const [loading, setLoading] = useState(false);

    /* NOTIFY */
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });


    /* GROUP SELECTION ASSERT */
    const [groupSelected, setGroupSelected] = useState<string>();
    const location = useLocation();
    const navigate = useNavigate();

    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    useEffect(() => {
        if (stateWithGroupSample(location.state)) {
            setGroupSelected(location.state.groupSelected);
        } else {
            navigate("/app/choose-sample-group");
            scrollToTop();
        }
    }, [location.state]);

    /* FORM HANDLER */
    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm({ resolver: yupResolver(sampleSchema) });

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            validateFiles(sampleFiles);
        } catch (e: any) {
            if (e instanceof CustomFileError) {
                setNotificationData({
                    title: "Arquivos inválidos.",
                    description: e.message,
                    type: "erro"
                });
                setSampleFileError(e.message);
                setLoading(false);
            }
            return;
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
                navigate("/app/my-samples", {
                    state: {
                        notification: {
                            title: "Operação realizada.",
                            description: "A amostra foi cadastrada com sucesso!",
                            type: "success"
                        },
                    },
                });
                scrollToTop();
            }
        } catch (error) {
            console.error(error);
            setNotificationData({
                title: "Erro no servidor.",
                description: "Não foi possível cadastrar a amostra com as informações fornecidas.",
                type: "erro"
            });
        } finally {
            setLoading(false);
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


                <header className="pt-8 pb-6 border-b border-gray-200 mb-8">
                    <h2 className="heading-2 font-semibold text-gray-900">
                        Grupo selecionado: {groupSelected}
                    </h2>
                </header>

                <Form.Root
                    onSubmit={onSubmit}
                    className=" mb-6   w-11/12 opacity-0 animate-fade-in animate-delay-100 animate-fill-forwards max-sm:w-full"
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
                                placeholder="Digite o título da pesquisa"
                                errorMessage={errors.researchTitle?.message}
                                {...register("researchTitle")}

                            />
                        </div>

                        <div className="col-span-3 animate-fade-in animate-delay-400">
                            <InputField
                                label="TÍTULO DA AMOSTRA*"
                                placeholder="Digite o título da amostra"
                                errorMessage={errors.sampleTitle?.message}
                                {...register("sampleTitle")}
                            />
                        </div>

                        <div className="col-span-3 md:flex gap-2 animate-fade-in animate-delay-500">
                            <InputField
                                label="Código do Comitê de Ética*"
                                placeholder="Digite o código fornecido pelo Comitê de Ética em Pesquisa"
                                errorMessage={errors.researchCep?.cepCode?.message}
                                {...register("researchCep.cepCode")}
                                className="flex-1 "
                            />
                            <InputField
                                label="QUANTIDADE TOTAL DE PARTICIPANTES*"
                                placeholder="Digite a quantidade total de participantes da pesquisa"
                                errorMessage={errors.qttParticipantsRequested?.message}
                                type="number"
                                {...register("qttParticipantsRequested")}
                                className="flex-1 "
                            />
                        </div>

                        <div className="md:col-span-2 md:flex lg:col-span-3 mb-12 gap-2 animate-fade-in animate-delay-600">
                            <SelectField
                                label="REGIÃO DA AMOSTRA*"
                                errorMessage={errors.countryRegion?.message}
                                {...register("countryRegion")}
                                className="md:flex-1 w-full md:w-auto mb-2"
                            >
                                <option value="Norte">Norte</option>
                                <option value="Nordeste">Nordeste</option>
                                <option value="Centro-Oeste">Centro-Oeste</option>
                                <option value="Sudeste">Sudeste</option>
                                <option value="Sul">Sul</option>
                            </SelectField>

                            <InputField
                                label="ESTADO DA AMOSTRA*"
                                placeholder="Digite o estado dos participantes da amostra"
                                errorMessage={errors.countryState?.message}
                                {...register("countryState")}
                                className="flex-1 "
                            />

                            <InputField
                                label="CIDADE DA AMOSTRA*"
                                placeholder="Digite a cidade dos participantes da amostra"
                                errorMessage={errors.countryCity?.message}
                                {...register("countryCity")}
                                className="flex-1"
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
                                errorMessage={errors.instituition?.name?.message}
                                {...register("instituition.name")}
                            />

                            <SelectField
                                className="max-sm:mb-12"
                                label="TIPO*"
                                errorMessage={errors.instituition?.instType?.message}
                                {...register("instituition.instType")}
                            >
                                <option>Pública</option>
                                <option>Particular</option>
                            </SelectField>
                        </div>
                    </div>

                    {/* CONTAINER TO UPLOAD FILES */}
                    <SampleUploadFile
                        messageError={sampleFileError}
                        sampleFiles={sampleFiles}
                        setSampleFiles={setSampleFiles}
                    />

                    <Form.Submit asChild className="mt-10 ">
                        <Button
                            size="Medium"
                            loading={loading}
                            className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed mx-auto btn-primary max-sm:w-full`}
                            color={`${isValid ? "green" : "gray"}`}
                            disabled={!isValid}
                            title={"Enviar Solicitação"}
                            children={<Icon.FloppyDisk size={18} weight="bold" />}
                        />
                    </Form.Submit>
                </Form.Root>
            </Notify>
        </>
    );
};

export default CreateSamplePage;
