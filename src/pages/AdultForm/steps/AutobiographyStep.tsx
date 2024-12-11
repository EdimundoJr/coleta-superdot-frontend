import { useState } from "react";
import { patchSaveAutobiography } from "../../../api/participant.api";
import { IParticipant } from "../../../interfaces/participant.interface";
import { Button } from "../../../components/Button/Button";

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

            <div className="mx-auto  ">
                <label htmlFor="autobiographyText">ESCREVA SOBRE VOCÊ</label>
                <textarea
                    onChange={(e) => setAutobiographyText(e.target.value)}
                    value={autobiographyText}
                    rows={20}
                    id="autobiographyText"
                    className=" p-4 w-full text-black border-2 border-b-gray-500 rounded-xl  text-justify"

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
                        <Button
                            size="Medium"
                            type="button"
                            onClick={previousStep}
                            title={"Voltar"}
                            color={"primary"}                        >

                        </Button>
                        <Button
                            size="Medium"
                            onClick={() => handleSaveAutobiography(false)} title={"Salvar e Sair"} color={"primary"}                        >
                        </Button>
                        <Button
                            size="Medium"
                            onClick={() => handleSaveAutobiography(true)}
                            title={"Salvar e Finalizar"}
                            color={"primary"}                        >
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutobiographyStep;
