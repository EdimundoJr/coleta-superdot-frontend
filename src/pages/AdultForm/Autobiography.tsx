import { useState } from "react";
import AdultFormBackground, { AdultFormSteps } from "./components/AdultFormBackground";
import { submitAutobiography } from "../../api/adultForm.api";
import { useNavigate } from "react-router-dom";
import Notify from "../../components/Notify/Notify";

const Autobiography = () => {
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const [autobiographyText, setAutobiographyText] = useState("");
    const [autobiographyVideo, setAutobiographyVideo] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async () => {
        if (!autobiographyText && !autobiographyVideo) {
            setNotificationTitle("Preencha pelo menos um campo");
            setNotificationDescription("É obrigatório digitar/gravar a autobiografia.");
            return;
        }

        try {
            const response = await submitAutobiography(autobiographyText, autobiographyVideo);
            if (response.status === 200) {
                navigate("/");
            }
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <AdultFormBackground currentStep={AdultFormSteps.AUTOBIOGRAPHY}>
                <div className="grid gap-y-5">
                    <header className="my-6">
                        <h1>Autobiografia</h1>
                        <h3>
                            Conte um pouco sobre você. Você pode escrever sua própria biografia ou, caso prefira, pode
                            gravar um vídeo falando sobre si.
                        </h3>
                    </header>

                    <label htmlFor="autobiographyText">ESCREVA SOBRE VOCÊ</label>
                    <textarea
                        onChange={(e) => setAutobiographyText(e.target.value)}
                        rows={10}
                        id="autobiographyText"
                    ></textarea>
                    <label htmlFor="autobiographyVideo">
                        COLE A URL DO SEU VÍDEO DO YOUTUBE NO CAMPO ABAIXO (NÃO DEIXE O VÍDEO PRIVADO)
                    </label>
                    <input onChange={(e) => setAutobiographyVideo(e.target.value)} id="autobiographyVideo"></input>

                    <button onClick={handleSubmit} className="button-secondary mx-auto w-1/3">
                        Continuar
                    </button>
                </div>
            </AdultFormBackground>
        </Notify>
    );
};

export default Autobiography;
