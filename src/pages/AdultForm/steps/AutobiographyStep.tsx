import { useState } from "react";
import { patchSaveAutobiography } from "../../../api/participant.api";
import { IParticipant } from "../../../interfaces/participant.interface";
import { Button } from "../../../components/Button/Button";
import { Flex } from "@radix-ui/themes";

interface AutobiographyStepProps {
    formData: IParticipant;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string; type: string }) => void;
    sampleId: string;
    previousStep: () => void;
    header: string;
}

const AutobiographyStep = ({
    formData,
    nextStep,
    setNotificationData,
    sampleId,
    previousStep,
    header,
}: AutobiographyStepProps) => {
    const [autobiographyText, setAutobiographyText] = useState(formData.autobiography?.text ?? "");
    const [autobiographyVideo, setAutobiographyVideo] = useState(formData.autobiography?.videoUrl ?? "");

    const handleSaveAutobiography = async (submitForm?: boolean) => {
        if (submitForm && !autobiographyText && !autobiographyVideo) {
            setNotificationData({
                title: "Preencha pelo menos um campo",
                description: "É obrigatório digitar/gravar a autobiografia.",
                type: "aviso",
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
                    type: "success",
                });
                nextStep();
            }
        } catch (e) {
            setNotificationData({
                title: "Erro no servidor!",
                description:
                    "Não foi possível enviar a sua autobiografia. Salve o conteúdo que foi escrito e contate os responsáveis pelo sistema.",
                type: "erro",
            });
            console.error(e);
        }
    };

    return (
        <Flex direction={"column"} className=" gap-y-5 w-full h-full">
            <header className="text-primary">
                <h3 className="text-xl max-sm:text-lg md:text-xl lg:text-2xl font-bold">
                    {header}
                </h3>

            </header>

            <p>
                Conte um pouco sobre você. Você pode escrever sua própria biografia ou, caso prefira, pode gravar um
                vídeo falando sobre si.
            </p>
            <div className="mx-auto">
                <textarea
                    onChange={(e) => setAutobiographyText(e.target.value)}
                    value={autobiographyText}
                    rows={20}
                    id="autobiographyText"
                    className="mb-5 p-4 w-full text-black card-container  !border-gray-300 text-justify"

                ></textarea>
                <label htmlFor="autobiographyVideo" >
                    COLE A URL DO SEU VÍDEO DO YOUTUBE NO CAMPO ABAIXO <br></br>(NÃO DEIXE O VÍDEO PRIVADO)
                </label>
                <input
                    onChange={(e) => setAutobiographyVideo(e.target.value)}
                    value={autobiographyVideo}
                    id="autobiographyVideo"
                    className="my-6"
                ></input>


                <div className="flex justify-end gap-4 pt-4 border-t border-gray-100">
                    <Button
                        onClick={previousStep}
                        size="Medium"
                        title="Voltar"
                        color="gray"
                        className="hover:bg-gray-50 border border-gray-200"
                    />
                    <Button
                        size="Medium"
                        onClick={() => handleSaveAutobiography(false)} title={"Salvar e Sair"} color={"primary"}
                    />
                    <Button
                        size="Medium"
                        onClick={() => handleSaveAutobiography(true)}
                        className={`disabled:bg-neutral-dark disabled:hover:cursor-not-allowed`}
                        title="Salvar e Continuar"
                        color={!autobiographyText && !autobiographyVideo ? "gray" : "green"}
                        disabled={!autobiographyText && !autobiographyVideo ? true : false} />
                </div>
            </div>
        </Flex>
    );
};

export default AutobiographyStep;
