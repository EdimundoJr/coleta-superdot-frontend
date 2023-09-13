import { useRef, useState } from "react";
import Modal from "../../../components/Modal/Modal";
import { AxiosError, AxiosResponse } from "axios";
import { saveParticipantToken } from "../../../utils/tokensHandler";
import { EAdultFormSteps } from "../AdultForm";
import { EAdultFormSource } from "../../../utils/consts.utils";
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

const ChoosePathStep = ({
    sourceForm,
    participantId,
    setCurrentStep,
    sampleId,
    setNotificationTitle,
    setNotificationDescription,
}: ChoosePathStepProps) => {
    const [emailModalOpen, setEmailModalOpen] = useState(false);
    const [participantEmail, setParticipantEmail] = useState<string>();
    const [showInputVerificationCode, setShowInputVerificationCode] = useState(false);
    const [verificationCode, setVerificationCode] = useState<number>();

    const optionChoosedRef = useRef<Options>();

    const handleChooseOption = (option: Options) => {
        setShowInputVerificationCode(false);
        optionChoosedRef.current = option;
        setEmailModalOpen(true);
    };

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
                    startFilling: optionChoosedRef.current === Options.START_FILL,
                });
            } else {
                response = await ParticipantApi.requestVerificationCode({
                    participantEmail,
                    sampleId,
                    startFilling: optionChoosedRef.current === Options.START_FILL,
                });
            }

            if (response.status === 200) {
                setShowInputVerificationCode(true);
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
                    startFilling: optionChoosedRef.current === Options.START_FILL,
                });
            }

            if (response.status !== 200) {
                console.error(response.data);
                setNotificationTitle("Erro no servidor!");
                setNotificationDescription("Contate os responsáveis pela plataforma.");
                return;
            }

            saveParticipantToken(response.data.participantToken);

            console.log(response.data);

            if (optionChoosedRef.current === Options.START_FILL) {
                if (response.data.adultFormStepToReturn) {
                    setNotificationTitle("Preenchimento já iniciado!");
                    setNotificationDescription(
                        "Você já iniciou o preenchimento do questionário. Te encaminharemos para as etapas que ainda não foram preenchidas."
                    );
                    setCurrentStep(response.data.adultFormStepToReturn);
                    return;
                }
                setNotificationTitle("E-mail validado!");
                setNotificationDescription("O preenchimento do questionário poderá ser iniciado.");
                setCurrentStep(EAdultFormSteps.PARTICIPANT_DATA);
            } else if (optionChoosedRef.current === Options.CONTINUE_FILL && response.data.adultFormStepToReturn) {
                if (response.data.adultFormStepToReturn === EAdultFormSteps.FINISHED) {
                    setNotificationTitle("Preenchimento finalizado!");
                    setNotificationDescription(
                        "Você já finalizou o preenchimento do formulário, não é possível preencher novamente."
                    );
                    return;
                }
                setNotificationTitle("E-mail validado!");
                setNotificationDescription("Você pode continuar o preenchimento do questionário.");
                setCurrentStep(response.data.adultFormStepToReturn);
                return;
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
            <header>
                <h1>Escolha uma opção para continuar</h1>
            </header>
            <section className="justify-center gap-10 text-black sm:flex ">
                <div
                    className="my-10 cursor-pointer rounded-lg bg-green-400 p-10 hover:bg-green-100 sm:m-0 sm:w-72"
                    onClick={() => handleChooseOption(Options.START_FILL)}
                >
                    <b>Iniciar</b> o preenchimento do Questionário de Altas Habilidades ou Superdotação - Adulto{" "}
                    {sourceForm === EAdultFormSource.SECOND_SOURCE && "(Segunda fonte)"}
                </div>
                <div
                    className=" cursor-pointer rounded-lg bg-yellow-400 p-10 hover:bg-yellow-100 sm:w-72"
                    onClick={() => handleChooseOption(Options.CONTINUE_FILL)}
                >
                    <b>Continuar</b> o preenchimento do Questionário de Altas Habilidades ou Superdotação - Adulto{" "}
                    {sourceForm === EAdultFormSource.SECOND_SOURCE && "(Segunda fonte)"}
                </div>
            </section>
            <Modal
                open={emailModalOpen}
                setOpen={setEmailModalOpen}
                title="Validando e-mail"
                accessibleDescription="Digite o seu email no campo a seguir e clique em continuar."
            >
                {showInputVerificationCode ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <label htmlFor="participantEmail">Digite seu e-mail</label>
                        <input
                            id="participantEmail"
                            type="email"
                            onChange={(e) => setParticipantEmail(e.target.value)}
                        ></input>
                        <button type="button" className="button-primary mt-5" onClick={handleOnRequestVerificationCode}>
                            Enviar código de verificação
                        </button>
                    </>
                )}
            </Modal>
        </div>
    );
};

export default ChoosePathStep;
