import { useState } from "react";
import { submitAutobiography } from "../../../api/participant.api";

interface AutobiographyStepProps {
    nextStep: () => void;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
    sampleId: string;
}

const AutobiographyStep = ({
    nextStep,
    setNotificationTitle,
    setNotificationDescription,
    sampleId,
}: AutobiographyStepProps) => {
    const [autobiographyText, setAutobiographyText] = useState("");
    const [autobiographyVideo, setAutobiographyVideo] = useState("");

    const handleSubmit = async () => {
        if (!autobiographyText && !autobiographyVideo) {
            setNotificationTitle("Preencha pelo menos um campo");
            setNotificationDescription("É obrigatório digitar/gravar a autobiografia.");
            return;
        }

        try {
            const response = await submitAutobiography({ sampleId, autobiographyText, autobiographyVideo });
            if (response.status === 200) {
                setNotificationTitle("Questionário finalizado!");
                setNotificationDescription("Agradecemos pelas respostas. Em breve o pesquisador entrará em contato.");
                nextStep();
            }
        } catch (e) {
            setNotificationTitle("Erro no servidor!");
            setNotificationDescription(
                "Não foi possível enviar a sua autobiografia. Salve o conteúdo que foi escrito e contate os responsáveis pelo sistema."
            );
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
                    rows={20}
                    id="autobiographyText"
                    className="my-6"
                ></textarea>
                <label htmlFor="autobiographyVideo">
                    COLE A URL DO SEU VÍDEO DO YOUTUBE NO CAMPO ABAIXO (NÃO DEIXE O VÍDEO PRIVADO)
                </label>
                <input
                    onChange={(e) => setAutobiographyVideo(e.target.value)}
                    id="autobiographyVideo"
                    className="my-6"
                ></input>

                <button onClick={handleSubmit} className="button-secondary mx-auto w-1/3">
                    Continuar
                </button>
            </div>
        </div>
    );
};

export default AutobiographyStep;
