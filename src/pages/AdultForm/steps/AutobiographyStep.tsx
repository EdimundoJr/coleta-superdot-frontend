import { useState } from "react";
import { patchSaveAutobiography } from "../../../api/participant.api";
import { IParticipant } from "../../../interfaces/participant.interface";

interface AutobiographyStepProps {
    formData: IParticipant;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string }) => void;
    sampleId: string;
    previousStep: () => void;
}

const AutobiographyStep = ({
    formData,
    nextStep,
    setNotificationData,
    sampleId,
    previousStep,
}: AutobiographyStepProps) => {
    const [autobiographyText, setAutobiographyText] = useState(formData.autobiography?.text ?? "");
    const [autobiographyVideo, setAutobiographyVideo] = useState(formData.autobiography?.videoUrl ?? "");

    const handleSaveAutobiography = async (submitForm?: boolean) => {
        if (submitForm && !autobiographyText && !autobiographyVideo) {
            setNotificationData({
                title: "Preencha pelo menos um campo",
                description: "É obrigatório digitar/gravar a autobiografia.",
            });
            return;
        }

        try {
            const response = await patchSaveAutobiography({
                sampleId,
                autobiographyText,
                autobiographyVideo,
                submitForm,
            });
            if (response.status === 200) {
                setNotificationData({
                    title: submitForm ? "Questionário finalizado!" : "Informações salvas",
                    description: submitForm
                        ? "Agradecemos pelas respostas. Em breve o pesquisador entrará em contato."
                        : "Todos os progresso de preenchimento foi salvo.",
                });
                nextStep();
            }
        } catch (e) {
            setNotificationData({
                title: "Erro no servidor!",
                description:
                    "Não foi possível enviar a sua autobiografia. Salve o conteúdo que foi escrito e contate os responsáveis pelo sistema.",
            });
            console.error(e);
        }
    };

    return (
        <div className="grid gap-y-5">
            <header className="my-6">
                <h1>Autobiografia</h1>
                <h3>
                    Conte um pouco sobre você. Você pode escrever sua própria biografia ou, caso prefira, pode gravar um
                    vídeo falando sobre si.
                </h3>
            </header>

            <div className="mx-auto sm:w-3/4 ">
                <label htmlFor="autobiographyText">ESCREVA SOBRE VOCÊ</label>
                <textarea
                    onChange={(e) => setAutobiographyText(e.target.value)}
                    value={autobiographyText}
                    rows={20}
                    id="autobiographyText"
                    className="my-6"
                ></textarea>
                <label htmlFor="autobiographyVideo">
                    COLE A URL DO SEU VÍDEO DO YOUTUBE NO CAMPO ABAIXO (NÃO DEIXE O VÍDEO PRIVADO)
                </label>
                <input
                    onChange={(e) => setAutobiographyVideo(e.target.value)}
                    value={autobiographyVideo}
                    id="autobiographyVideo"
                    className="my-6"
                ></input>

                <div className="mt-5 flex w-full justify-center gap-x-4 px-3 ">
                    <div className="flex justify-center gap-6">
                        <button
                            type="button"
                            onClick={previousStep}
                            className="button-secondary mt-5 w-3/4 px-3 md:w-56"
                        >
                            VOLTAR
                        </button>
                        <button
                            className="button-secondary mt-5 w-3/4 px-3 md:w-56"
                            onClick={() => handleSaveAutobiography(false)}
                        >
                            SALVAR E SAIR
                        </button>
                        <button
                            className="button-secondary mt-5 w-3/4 px-3 disabled:bg-neutral-dark md:w-56"
                            onClick={() => handleSaveAutobiography(true)}
                        >
                            SALVAR E FINALIZAR
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutobiographyStep;
