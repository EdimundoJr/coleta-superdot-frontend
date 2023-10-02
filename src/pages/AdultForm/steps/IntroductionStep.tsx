import { useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { AxiosError, AxiosResponse } from "axios";
import { saveParticipantToken } from "../../../utils/tokensHandler";
import { EAdultFormSource, EAdultFormSteps } from "../../../utils/consts.utils";
import * as ParticipantApi from "../../../api/participant.api";
import * as SecondSourceApi from "../../../api/secondSource.api";

enum Options {
    START_FILL = 0,
    CONTINUE_FILL = 1,
}

interface ChoosePathStepProps {
    sourceForm: EAdultFormSource;
    participantId?: string; // Only required when the form will be fill out by a second source
    setCurrentStep: (step: EAdultFormSteps) => void;
    sampleId: string;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
}

const IntroductionStep = ({
    sourceForm,
    participantId,
    setCurrentStep,
    sampleId,
    setNotificationTitle,
    setNotificationDescription,
}: ChoosePathStepProps) => {
    const [modalConfirmationCodeOpen, setModalConfirmationCodeOpen] = useState(false);
    const [participantEmail, setParticipantEmail] = useState<string>();
    const [verificationCode, setVerificationCode] = useState<number>();
    const [researcherName, setResearcherName] = useState("Rafael Dutra Pereira");
    const [participantName, setParticipantName] = useState("Felipe Dutra Pereira");

    const handleOnRequestVerificationCode = async () => {
        if (!participantEmail || !participantEmail.length) {
            return;
        }

        try {
            let response: AxiosResponse<boolean>;

            if (sourceForm === EAdultFormSource.SECOND_SOURCE && participantId) {
                response = await SecondSourceApi.requestVerificationCode({
                    secondSourceEmail: participantEmail,
                    participantId,
                    sampleId,
                });
            } else {
                response = await ParticipantApi.requestVerificationCode({
                    participantEmail,
                    sampleId,
                });
            }

            if (response.status === 200) {
                setModalConfirmationCodeOpen(true);
                setNotificationTitle("Verifique seu e-mail.");
                setNotificationDescription("Enviamos um código de verificação para o seu e-mail.");
            }
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                switch (error.response?.status) {
                    case 400: // DTO Validation Error
                        setNotificationTitle("E-mail inválido.");
                        setNotificationDescription("Verifique o seu e-mail e tente novamente.");
                        break;
                    case 404: // Participant not found
                        setNotificationTitle("E-mail não encontrado.");
                        setNotificationDescription(
                            "Caso ainda não tenha iniciado o preenchimento, selecione a opção 'Iniciar preenchimento' na tela anterior."
                        );
                        break;
                    case 409: // Email already in use
                        setNotificationTitle("E-mail em uso.");
                        setNotificationDescription(
                            "Esse endereço de e-mail já foi utilizado para preencher o formulário."
                        );
                        break;
                    default: // Others
                        setNotificationTitle("Erro no servidor.");
                        setNotificationDescription(
                            "Verifique se você está utilizando a URL fornecida pelo pesquisador."
                        );
                }
            }
        }
    };

    const handleOnInputVerificationCode = async () => {
        if (!participantEmail || !participantEmail.length) {
            return;
        }

        if (!verificationCode) {
            return;
        }

        try {
            let response: AxiosResponse<ParticipantApi.CodeValidated>;

            if (sourceForm === EAdultFormSource.SECOND_SOURCE && participantId) {
                response = await SecondSourceApi.validateVerificationCode({
                    secondSourceEmail: participantEmail,
                    participantId,
                    verificationCode,
                });
            } else {
                response = await ParticipantApi.validateVerificationCode({
                    participantEmail,
                    verificationCode,
                    sampleId,
                });
            }

            if (response.status !== 200) {
                console.error(response.data);
                setNotificationTitle("Erro no servidor!");
                setNotificationDescription("Contate os responsáveis pela plataforma.");
                return;
            }

            saveParticipantToken(response.data.participantToken);

            if (response.data.adultFormStepToReturn === EAdultFormSteps.FINISHED) {
                setNotificationTitle("Preenchimento finalizado!");
                setNotificationDescription(
                    "Você já finalizou o preenchimento do formulário, não é possível preencher novamente."
                );
                return;
            }

            if (response.data.adultFormStepToReturn) {
                setCurrentStep(response.data.adultFormStepToReturn);
                setNotificationTitle("Preenchimento já iniciado!");
                setNotificationDescription(
                    "Você já iniciou o preenchimento do questionário. Te encaminharemos para as etapas que ainda não foram preenchidas."
                );

                return;
            } else {
                setNotificationTitle("E-mail validado!");
                setNotificationDescription("O preenchimento do questionário poderá ser iniciado.");
                setCurrentStep(EAdultFormSteps.PARTICIPANT_DATA);
            }
        } catch (error) {
            console.error(error);
            if (error instanceof AxiosError) {
                if (error.response?.status === 409) {
                    setNotificationTitle("Erro no servidor.");
                    setNotificationDescription("Código incorreto!");
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
                    sendo realizada pelo(a) pesquisador(a) <b>{researcherName}</b>. Você foi indicado como a segunda
                    fonte para os dados que foram coletados do particiapante <b>{participantName}</b>.
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
                <Modal
                    open={modalConfirmationCodeOpen}
                    setOpen={setModalConfirmationCodeOpen}
                    title="Código de verificação"
                    accessibleDescription="Digite o código de confirmação que foi enviado para o seu e-mail."
                >
                    <label htmlFor="verificationCode">
                        Digite o código de verificação que foi enviado para o seu e-mail
                    </label>
                    <input
                        id="verificationCode"
                        type="number"
                        onChange={(e) => setVerificationCode(Number(e.target.value))}
                    ></input>
                    <button type="button" className="button-primary mt-5" onClick={handleOnInputVerificationCode}>
                        Continuar
                    </button>
                </Modal>
            </div>
        </div>
    );
};

export default IntroductionStep;
