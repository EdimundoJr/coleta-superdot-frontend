import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { EAdultFormSource } from "../../../utils/consts.utils";
import * as ParticipantApi from "../../../api/participant.api";
import * as SecondSourceApi from "../../../api/secondSource.api";

interface IntroductionStepProps {
    sourceForm: EAdultFormSource;
    participantId?: string;
    researcherName: string;
    participantName?: string;
    sampleId: string;
    setNotificationData: (data: { title: string; description: string }) => void;
}

/* This step will introduce the participant in the researcher and request an email to send a
 * verification code.
 */
const IntroductionStep = ({
    sourceForm,
    participantId,
    researcherName,
    participantName,
    sampleId,
    setNotificationData,
}: IntroductionStepProps) => {
    const [participantEmail, setParticipantEmail] = useState<string>("");

    /**
     * The function `handleOnRequestVerificationCode` sends a verification code to a participant's
     * email address and handles different error scenarios.
     * @returns nothing (undefined) if the `participantEmail` is empty.
     */
    const handleOnRequestVerificationCode = async () => {
        if (!participantEmail.length) {
            return;
        }

        try {
            let response: AxiosResponse<boolean>;

            if (sourceForm === EAdultFormSource.SECOND_SOURCE && participantId) {
                response = await SecondSourceApi.postSendVerificationCode({
                    secondSourceEmail: participantEmail,
                    participantId,
                    sampleId,
                });
            } else {
                response = await ParticipantApi.postSendVerificationCode({
                    participantEmail,
                    sampleId,
                });
            }

            if (response.status === 201) {
                setNotificationData({
                    title: "Verifique seu e-mail.",
                    description: "Enviamos um link de verificação para o seu e-mail.",
                });
            }
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 400: // DTO Validation Error
                        setNotificationData({
                            title: "E-mail inválido.",
                            description: "Verifique o seu e-mail e tente novamente.",
                        });
                        break;
                    case 401:
                        setNotificationData({
                            title: "Preenchimento finalizado!",
                            description:
                                "Você já finalizou o preencimento do formulário, não é possível alterar as informações.",
                        });
                        break;
                    case 404: // Participant not found
                        setNotificationData({
                            title: "E-mail não encontrado.",
                            description:
                                "Caso ainda não tenha iniciado o preenchimento, selecione a opção 'Iniciar preenchimento' na tela anterior.",
                        });
                        break;
                    case 409: // Email already in use
                        setNotificationData({
                            title: "E-mail em uso.",
                            description: "Esse endereço de e-mail já foi utilizado para preencher o formulário.",
                        });
                        break;
                    default: // Others
                        setNotificationData({
                            title: "Erro no servidor.",
                            description: "Verifique se você está utilizando a URL fornecida pelo pesquisador.",
                        });
                }
            }
        }
    };

    return (
        <div className="grid gap-y-10">
            <div className="m-auto w-3/4 text-justify">
                <h3 className="text-center">Olá, sejá bem vindo ao SuperDot.</h3>
                <br />
                <p>
                    Você foi convidado a participar da coleta de dados sobre altas habilidades/superdotação que está
                    sendo realizada pelo(a) pesquisador(a) <b>{researcherName}</b>.{" "}
                    {sourceForm === EAdultFormSource.SECOND_SOURCE && (
                        <>
                            Você foi indicado como a segunda fonte para os dados que foram coletados do participante{" "}
                            <b>{participantName}</b>.
                        </>
                    )}
                </p>
                <br />
                <p>
                    O SuperDot é um sistema que visa auxiliar essa coleta de dados, facilitiando o preenchimento dos
                    questionários de superdotação. Ao preencher o questionário a seguir, você estará constribuindo tanto
                    com a pesquisa do(a) {researcherName}, quanto com toda a comunidade de pesquisadores de AH/SD do
                    Brasil.
                </p>
                <br />
                <p>
                    A plataforma ainda se encontra em sua fase inicial, então é normal que alguns problemas apareçam
                    durante sua utilização. Caso encontre algum problema ou tenha alguma sugestão de melhoria, por favor
                    entre em contato conosco através do e-mail: <b>grupacdev@gmail.com</b>
                </p>
                <br />
                <br />
                <br />
                <h3 className="text-center">
                    Para iniciar ou continuar o preenchimento, infome seu e-mail no campo abaixo:
                </h3>
            </div>
            <div className="m-auto w-2/4">
                <input id="participantEmail" type="email" onChange={(e) => setParticipantEmail(e.target.value)}></input>
                <button type="button" className="button-primary mt-5" onClick={handleOnRequestVerificationCode}>
                    Enviar código de verificação
                </button>
            </div>
        </div>
    );
};

export default IntroductionStep;
