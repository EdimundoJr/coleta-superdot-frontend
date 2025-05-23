import { Viewer, Worker } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useEffect, useRef, useState } from "react";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import { AcceptSampleFile } from "../../../interfaces/sample.interface";
import { getAllSampleRequiredDocs } from "../../../api/adultForm.api";
import { EAdultFormSource } from "../../../utils/consts.utils";
import * as ParticipantApi from "../../../api/participant.api";
import * as SecondSourceApi from "../../../api/secondSource.api";
import { IParticipant } from "../../../interfaces/participant.interface";
import { ISecondSource } from "../../../interfaces/secondSource.interface";
import { Button } from "../../../components/Button/Button";
import { Flex } from "@radix-ui/themes";
interface ReadAndAcceptDocsStepProps {
    sourceForm: EAdultFormSource;
    nextStep: () => void;
    previousStep: () => void;
    setNotificationData: (data: { title: string; description: string; type: string }) => void;
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
    const docsToAccept = useRef<AcceptSampleFile[]>([]);
    const [currentDocIndex, setCurrentDocIndex] = useState(0);
    const [accepted, setAccepted] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleFullScreen = () => {
        const elem = containerRef.current;

        if (elem) {

            elem.style.height = '100vh';
            elem.style.width = '100vw';

            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if ((elem as any).webkitRequestFullscreen) {
                (elem as any).webkitRequestFullscreen();
            } else if ((elem as any).msRequestFullscreen) {
                (elem as any).msRequestFullscreen();
            }
        }
    };


    const exitFullScreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen?.();
        } else if ((document as any).webkitExitFullscreen) {
            (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
            (document as any).msExitFullscreen();
        }
    };

    useEffect(() => {
        const handleChange = () => {
            const isNowFullScreen = !!document.fullscreenElement;
            setIsFullScreen(isNowFullScreen);

            // Resetar altura ao sair do fullscreen
            if (!isNowFullScreen && containerRef.current) {
                containerRef.current.style.height = '100vh';
            }
        };

        document.addEventListener('fullscreenchange', handleChange);
        return () => document.removeEventListener('fullscreenchange', handleChange);
    }, []);

    useEffect(() => {
        const initializeDocs = async (sampleId: string) => {
            setLoading(true);
            try {
                const response = await getAllSampleRequiredDocs(sampleId);

                if (response.data?.length) {
                    // Ignora o estado de aceitação do formData
                    docsToAccept.current = response.data.map((doc) => ({
                        ...doc,
                        accepted: false // Sempre começa como não aceito
                    }));

                    setCurrentDocIndex(0);
                    setAccepted(false);
                } else {
                    setNotificationData({
                        title: "Nenhum documento encontrado",
                        description: "Entre em contato com o pesquisador responsável",
                        type: "erro"
                    });
                }
            } catch (error) {
                setNotificationData({
                    title: "Erro de conexão",
                    description: "Falha ao carregar documentos",
                    type: "erro"
                });
            } finally {
                setLoading(false);
            }
        };

        initializeDocs(sampleId);
    }, [sampleId]);

    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    const handleAcceptDocument = () => {
        if (!accepted) return;

        const updatedDocs = [...docsToAccept.current];
        updatedDocs[currentDocIndex].accepted = true;
        docsToAccept.current = updatedDocs;

        // Encontrar próximo documento não aceito
        const nextIndex = docsToAccept.current.findIndex((doc, idx) =>
            idx > currentDocIndex && !doc.accepted
        );

        if (nextIndex !== -1) {
            setCurrentDocIndex(nextIndex);
            setAccepted(false);
            scrollToTop();
        } else {
            submitAllAcceptances();
        }
    };

    const submitAllAcceptances = async () => {
        setLoading(true);
        try {
            const response = sourceForm === EAdultFormSource.FIRST_SOURCE
                ? await ParticipantApi.patchAcceptAllSampleDocs({ sampleId })
                : await SecondSourceApi.patchAcceptAllSampleDocs({ sampleId });

            if (response.status === 200) {
                // Atualiza o formData sem alterar o estado local
                setFormData({
                    ...formData,
                    acceptTcleAt: new Date(),
                    acceptTaleAt: new Date()
                });

                // Força recarregar os documentos para manter a UI consistente
                const response = await getAllSampleRequiredDocs(sampleId);
                docsToAccept.current = response.data.map((doc) => ({
                    ...doc,
                    accepted: true
                }));
                nextStep()
                setAccepted(true);
            }
        } catch (error) {
            setNotificationData({
                title: "Erro no servidor",
                description: "Tente novamente mais tarde",
                type: "erro"
            });
        } finally {
            setLoading(false);
        }
    };

    const handlePrevious = () => {
        if (currentDocIndex > 0) {
            const prevIndex = currentDocIndex - 1;
            setCurrentDocIndex(prevIndex);
            setAccepted(docsToAccept.current[prevIndex].accepted ?? false);
        } else {
            previousStep();
        }
    };



    if (!docsToAccept.current.length) {
        return (
            <div className="text-center p-8 text-red-500">
                Nenhum documento disponível para aceitação
            </div>
        );
    }

    return (
        <div id="pageAcceptDocs" className="gap-y-2">
            <header className="text-primary">
                <h3 className="text-xl max-sm:text-lg md:text-xl lg:text-2xl font-bold">
                    {docsToAccept.current[currentDocIndex]?.label}
                </h3>
                <h2 className="text-sm text-gray-600 mb-5">
                    Documento {currentDocIndex + 1} de {docsToAccept.current.length}
                </h2>
            </header>

            <div
                ref={containerRef}
                className={`pdf-viewer-container card-container-variante-border ${isFullScreen ? 'fullscreen' : ''}`}
                onClick={() => handleFullScreen()}
                style={{
                    height: isFullScreen ? '100vh' : '60vh',
                    width: isFullScreen ? '100vw' : '100%',
                    position: 'relative',
                    cursor: 'pointer',
                    backgroundColor: '#f0f0f0'
                }}
            >
                {!isFullScreen && (
                    <div className="overlay-message" >
                        Clique para expandir para tela cheia
                    </div>
                )}

                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">

                    {docsToAccept.current[currentDocIndex] && (
                        <Viewer
                            fileUrl={`${import.meta.env.VITE_BACKEND_HOST}/api/sample/attachment/${docsToAccept.current[currentDocIndex].backendFileName
                                }`}
                            theme={{

                                theme: 'light',
                            }}
                        />
                    )}
                </Worker>
                {
                    isFullScreen && (
                        <button
                            onClick={exitFullScreen}
                            style={{
                                position: 'absolute',
                                top: 30,
                                right: 30,
                                zIndex: 30,
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                padding: '8px 12px',
                                borderRadius: '8px',
                                border: 'none',
                                cursor: 'pointer',
                            }}
                        >
                            Fechar
                        </button>
                    )
                }
            </div>

            <div className="flex items-center m-2 justify-center">
                <Checkbox.Root
                    checked={accepted}
                    onCheckedChange={(checked) => setAccepted(checked === true)}
                    id="acceptUseTerm"
                    className="border-mauve9 shadow-blackA7 hover:bg-violet3 flex h-[20px] min-w-[20px] rounded-[4px] border bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_2px_black]"
                >
                    <Checkbox.Indicator className="text-black">
                        <CheckIcon className="h-[20px] w-[20px]" />
                    </Checkbox.Indicator>
                </Checkbox.Root>
                <label htmlFor="acceptUseTerm" className="pl-[15px] sm:pl-[10px] md:pl-[12px] lg:pl-[15px] xl:pl-[15px] max-sm:pl-[10px] text-[15px] sm:text-[14px] md:text-[15px] lg:text-[16px] xl:text-[16px] max-sm:text-[12px] leading-6 sm:leading-5 md:leading-6 lg:leading-7 xl:leading-7 max-sm:leading-5
  
">
                    <p>Confirmo que li e estou de acordo com todos os itens dispostos no documento acima.</p>
                </label>
            </div>

            <Flex align="center" justify="center" className="gap-4 mt-4 max-sm:flex-col">
                <Button
                    size="Full"
                    className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed disabled:hidden`}
                    onClick={handlePrevious}
                    title="Voltar"
                    color="gray"
                    disabled={currentDocIndex === 0}
                />

                <Button
                    size="Full"
                    onClick={saveAndExit}
                    title="Salvar e Sair"
                    color="primary"
                />

                <Button
                    loading={loading}
                    size="Full"
                    onClick={handleAcceptDocument}
                    className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                    title={currentDocIndex === docsToAccept.current.length - 1 ? "Finalizar" : "Avançar"}
                    color={accepted == true ? "green" : "gray"}
                    disabled={!accepted}
                />
            </Flex>



        </div >
    );
};

export default ReadAndAcceptDocsStep;