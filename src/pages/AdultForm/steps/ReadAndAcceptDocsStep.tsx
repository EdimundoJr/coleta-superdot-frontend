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

interface ReadAndAcceptDocsStepProps {
    sourceForm: EAdultFormSource;
    participantId?: string; // Only required when the form will be fill out by a second source
    nextStep: () => void;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
    sampleId: string;
}

const ReadAndAcceptDocsStep = ({
    sourceForm,
    participantId,
    nextStep,
    setNotificationTitle,
    setNotificationDescription,
    sampleId,
}: ReadAndAcceptDocsStepProps) => {
    const docsToAccept = useRef<AcceptSampleFile[]>();
    const [currentDoc, setCurrentDoc] = useState<AcceptSampleFile>();
    const [accepted, setAccepted] = useState(false);

    useEffect(() => {
        const returnDocs = async (sampleId: string) => {
            const response = await getAllSampleRequiredDocs(sampleId);
            if (response.data) {
                docsToAccept.current = response.data;
                setCurrentDoc(response.data[0]);
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

                console.log(sourceForm);
                console.log(participantId);

                if (sourceForm === EAdultFormSource.SECOND_SOURCE && participantId) {
                    response = await SecondSourceApi.patchAcceptAllSampleDocs(sampleId, participantId);
                } else {
                    response = await ParticipantApi.patchAcceptAllSampleDocs(sampleId);
                }

                if (response.status === 200) {
                    setNotificationTitle("Termos aceitos!");
                    setNotificationDescription("Todos os documentos foram aceitos com sucesso.");
                    nextStep();
                }
            } catch (erroLogin) {
                console.error(erroLogin);
                setNotificationTitle("Erro no servidor.");
                setNotificationDescription("Por favor, tente novamente mais tarde.");
            }
            return;
        }

        docsToAccept.current = arrayWithNewDocAccepted;
        setCurrentDoc(nextDocToAccept);
        setAccepted(false);
        setNotificationTitle("Documento aceito com sucesso.");
        setNotificationDescription("Ainda há um outro documento para ser aceito.");
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
                <button
                    disabled={!accepted}
                    className="button-secondary w-1/2 disabled:bg-slate-600 disabled:hover:bg-slate-600"
                    onClick={() => handleOnAccepted(currentDoc?.jsonFileKey || "")}
                >
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default ReadAndAcceptDocsStep;
