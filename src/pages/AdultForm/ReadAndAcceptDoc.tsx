import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useEffect, useRef, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { useNavigate, useParams } from "react-router-dom";
import { AcceptSampleFile } from "../../interfaces/sample.interface";
import Notify from "../../components/Notify/Notify";
import AdultFormBackground, { AdultFormSteps } from "./components/AdultFormBackground";
import { acceptDocs, getDocs } from "../../api/adultForm.api";

const ReadAndAcceptDoc = () => {
    const docsToAccept = useRef<AcceptSampleFile[]>();
    const [currentDoc, setCurrentDoc] = useState<AcceptSampleFile>();
    const [accepted, setAccepted] = useState(false);

    const navigate = useNavigate();
    const { sampleId, participantId } = useParams();

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    useEffect(() => {
        const returnDocs = async (sampleId: string) => {
            const response = await getDocs(sampleId);
            if (response.data) {
                docsToAccept.current = response.data;
                setCurrentDoc(response.data[0]);
            }
        };

        if (sampleId) {
            returnDocs(sampleId);
        }
    }, [sampleId]);

    const handleOnAccepted = async (keyFile: string) => {
        if (!sampleId) {
            setNotificationTitle("Amostra inválida!");
            setNotificationDescription(
                "Por favor, verifique se você realmente está utilizando o link fornecido pelo pesquisador."
            );
            return;
        }

        if (!participantId) {
            setNotificationTitle("Participante inválido!");
            setNotificationDescription("Por favor, recarregue a página e tente novamente.");
            return;
        }

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

        if (!nextDocToAccept && docsToAccept.current) {
            try {
                const response = await acceptDocs(sampleId, participantId, docsToAccept.current);
                if (response.status === 200) {
                    navigate(`../123/indicate-second-source`);
                }
            } catch (erroLogin) {
                console.error(erroLogin);
                setNotificationTitle("Erro no servidor.");
                setNotificationDescription("Por favor, tente novamente mais tarde.");
            }
            return;
        } else {
            docsToAccept.current = arrayWithNewDocAccepted;
            setCurrentDoc(nextDocToAccept);
            setAccepted(false);
            setNotificationTitle("Documento aceito com sucesso.");
            setNotificationDescription("Ainda há um outro documento para ser aceito.");
        }
    };

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <AdultFormBackground currentStep={AdultFormSteps.READ_AND_ACCEPT_DOCS}>
                <div className="grid gap-y-10">
                    <header>
                        <h1>{currentDoc?.label}</h1>
                        <h3>Leia o documento e confirme que está de acordo.</h3>
                    </header>

                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                        <div className="h-[730px] p-7">
                            {currentDoc && (
                                <Viewer
                                    fileUrl={`${import.meta.env.VITE_BACKEND_HOST}/${currentDoc.backendFileName}`}
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
            </AdultFormBackground>
        </Notify>
    );
};

export default ReadAndAcceptDoc;
