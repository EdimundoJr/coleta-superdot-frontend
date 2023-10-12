import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useEffect, useRef, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { AcceptSampleFile } from "../../../interfaces/sample.interface";
import { getAllSampleRequiredDocs } from "../../../api/adultForm.api";
import { EAdultFormSource } from "../../../utils/consts.utils";
import { AxiosResponse } from "axios";
import * as ParticipantApi from "../../../api/participant.api";
import * as SecondSourceApi from "../../../api/secondSource.api";
import { IParticipant } from "../../../interfaces/participant.interface";
import { ISecondSource } from "../../../interfaces/secondSource.interface";

interface ReadAndAcceptDocsStepProps {
    sourceForm: EAdultFormSource;
    nextStep: () => void;
    previousStep: () => void;
    setNotificationData: (data: { title: string; description: string }) => void;
    sampleId: string;
    saveAndExit: () => void;
    formData: IParticipant | ISecondSource;
    setFormData: (data: IParticipant | ISecondSource) => void;
}

const ReadAndAcceptDocsStep = ({
    sourceForm,
    nextStep,
    previousStep,
    setNotificationData,
    sampleId,
    saveAndExit,
    formData,
    setFormData,
}: ReadAndAcceptDocsStepProps) => {
    const docsToAccept = useRef<AcceptSampleFile[]>();
    const [currentDoc, setCurrentDoc] = useState<AcceptSampleFile>();
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const returnDocs = async (sampleId: string) => {
            const response = await getAllSampleRequiredDocs(sampleId);
            if (response.data) {
                const docs = response.data.map((doc) => {
                    if (formData.acceptTaleAt && doc.jsonFileKey === "taleDocument") {
                        return {
                            ...doc,
                            accepted: true,
                        };
                    } else if (formData.acceptTcleAt && doc.jsonFileKey === "tcleDocument") {
                        return {
                            ...doc,
                            accepted: true,
                        };
                    } else {
                        return doc;
                    }
                });
                docsToAccept.current = docs;
                if (docs.length) {
                    setCurrentDoc(docs[0]);
                    setAccepted(docs[0].accepted || false);
                }
            }
        };

        returnDocs(sampleId);
    }, [sampleId]);

    const handleOnAccepted = async (keyFile: string) => {
        let nextDocToAccept: AcceptSampleFile | undefined = undefined;

        const arrayWithNewDocAccepted = docsToAccept.current?.map((doc) => {
            if (doc.jsonFileKey === keyFile) {
                return {
                    ...doc,
                    accepted: true,
                };
            } else if (!doc.accepted && !nextDocToAccept) {
                nextDocToAccept = doc;
                return doc;
            } else {
                return doc;
            }
        });

        // All docs read and accepted
        if (!nextDocToAccept && docsToAccept.current) {
            try {
                let response: AxiosResponse<boolean>;

                if (sourceForm === EAdultFormSource.FIRST_SOURCE) {
                    response = await ParticipantApi.patchAcceptAllSampleDocs({ sampleId });
                } else {
                    response = await SecondSourceApi.patchAcceptAllSampleDocs({ sampleId });
                }

                if (response.status === 200) {
                    setNotificationData({
                        title: "Termos aceitos!",
                        description: "Todos os documentos foram aceitos com sucesso.",
                    });

                    const docs: {
                        acceptTcleAt?: Date;
                        acceptTaleAt?: Date;
                    } = { acceptTcleAt: undefined, acceptTaleAt: undefined };

                    docsToAccept.current.forEach((doc) => {
                        if (doc.jsonFileKey === "tcleDocument") {
                            docs.acceptTcleAt = new Date();
                        }
                        if (doc.jsonFileKey === "taleDocument") {
                            docs.acceptTaleAt = new Date();
                        }
                    });

                    setFormData({
                        ...formData,
                        ...docs,
                    });

                    nextStep();
                }
            } catch (erroLogin) {
                console.error(erroLogin);
                setNotificationData({
                    title: "Erro no servidor.",
                    description: "Por favor, tente novamente mais tarde.",
                });
            }
            return;
        }

        docsToAccept.current = arrayWithNewDocAccepted;
        setCurrentDoc(nextDocToAccept);
        setAccepted(false);
        setNotificationData({
            title: "Documento aceito com sucesso.",
            description: "Ainda há um outro documento para ser aceito.",
        });
    };

    const onClickToPreviouStep = () => {
        if (docsToAccept.current?.length === 1 || !docsToAccept.current) {
            previousStep();
            return;
        }

        const currentDocIdx = docsToAccept.current?.findIndex((doc) => doc.jsonFileKey === currentDoc?.jsonFileKey);
        if (currentDocIdx === 0 || currentDocIdx === -1) {
            previousStep(); // Return to previous step
        } else {
            // Return to previous document
            setCurrentDoc(docsToAccept.current[currentDocIdx - 1]);
        }
    };

    return (
        <div className="grid gap-y-10">
            <header>
                <h1>{currentDoc?.label}</h1>
                <h3>Leia o documento e confirme que está de acordo.</h3>
            </header>

            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                <div className="h-[730px] p-7">
                    {currentDoc && (
                        <Viewer
                            fileUrl={`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${
                                currentDoc.backendFileName
                            }`}
                        />
                    )}
                </div>
            </Worker>

            <div className="mx-4 flex items-center">
                <Checkbox.Root
                    checked={accepted}
                    onCheckedChange={(checked) =>
                        typeof checked === "boolean" ? setAccepted(checked) : setAccepted(false)
                    }
                    id="acceptUseTerm"
                    className="border-mauve9 shadow-blackA7 hover:bg-violet3 flex h-[20px] min-w-[20px] rounded-[4px] border bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_2px_black]"
                >
                    <Checkbox.Indicator className="text-black">
                        <CheckIcon className="h-[20px] w-[20px]" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="acceptUseTerm" className="pl-[15px] text-left text-[15px] leading-6 text-white">
                    <p>Confirmo que li e estou de acordo com todos os itens dispostos no documento acima.</p>
                </label>
            </div>

            <div className="mt-5 flex w-full justify-center gap-x-4 px-3 ">
                <div className="flex justify-center gap-6">
                    <button
                        type="button"
                        onClick={onClickToPreviouStep}
                        className="button-secondary mt-5 w-3/4 px-3 md:w-56"
                    >
                        VOLTAR
                    </button>
                    <button className="button-secondary mt-5 w-3/4 px-3 md:w-56" onClick={saveAndExit}>
                        SALVAR E SAIR
                    </button>
                    <button
                        className="button-secondary mt-5 w-3/4 px-3 disabled:bg-neutral-dark md:w-56"
                        disabled={!accepted}
                        onClick={() => handleOnAccepted(currentDoc?.jsonFileKey || "")}
                    >
                        SALVAR E CONTINUAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReadAndAcceptDocsStep;
