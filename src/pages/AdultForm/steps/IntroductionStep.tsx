import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { EAdultFormSource } from "../../../utils/consts.utils";
import * as ParticipantApi from "../../../api/participant.api";
import * as SecondSourceApi from "../../../api/secondSource.api";
import { Box, Flex } from "@radix-ui/themes";
import logo from '../../../assets/Logo-GRUPAC-white.png'
import { Button } from "../../../components/Button/Button";
import FadeContent from "../../../components/FadeContent/FadeContent";
import RotatingText from "../../../components/RotatingText/RotatingText";

interface IntroductionStepProps {
    sourceForm: EAdultFormSource;
    participantId?: string;
    researcherName: string;
    participantName?: string;
    sampleId: string;
    setNotificationData: (data: { title: string; description: string; type: string }) => void;
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
    const [loading, setLoading] = useState(false);

    /**
     * The function `handleOnRequestVerificationCode` sends a verification code to a participant's
     * email address and handles different error scenarios.
     * @returns nothing (undefined) if the `participantEmail` is empty.
     */
    const handleOnRequestVerificationCode = async () => {
        setLoading(true);
        if (!participantEmail.length) {
            return setNotificationData({
                title: "Insira um email.",
                description: "Para prosseguir, você deve informar um e-mail.",
                type: "erro"
            });;
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
                    type: "success"
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
                            type: "erro"
                        });
                        break;
                    case 401:
                        setNotificationData({
                            title: "Questionário finalizado!",
                            description:
                                "Você já finalizou o preencimento do formulário, não é possível alterar as informações.",
                            type: "success"
                        });
                        break;
                    case 404: // Participant not found
                        setNotificationData({
                            title: "E-mail não encontrado.",
                            description:
                                "Caso ainda não tenha iniciado o preenchimento, selecione a opção 'Iniciar preenchimento' na tela anterior.",
                            type: "erro"
                        });
                        break;
                    case 409: // Email already in use
                        setNotificationData({
                            title: "E-mail em uso.",
                            description: "Esse endereço de e-mail já foi utilizado para preencher o formulário.",
                            type: "erro"
                        });
                        break;
                    default: // Others
                        setNotificationData({
                            title: "Erro no servidor.",
                            description: "Verifique se você está utilizando a URL fornecida pelo pesquisador.",
                            type: "erro"
                        });
                }
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>

            <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                <Box
                    className="min-h-screen sm:h-screen font-roboto text-slate-950 w-full px-4 max-w-4xl relative z-10 mx-auto flex flex-col justify-center  ">
                    <div className="w-full text-justify font-roboto text-gray-50">
                        {/* Logo */}
                        <div className="flex justify-center max-sm:mb-10">
                            <img className="w-36 max-sm:w-44" src={logo} alt="Logo" />
                        </div>

                        {/* Título */}
                        <h1 className="text-center text-xl sm:text-2xl font-bold mt-2">
                            <Flex gap="2" align="center" justify="center" className="flex-col sm:flex-row">
                                <RotatingText
                                    texts={['Olá,', 'Hello,', 'Hola,', 'Bonjour,', 'Ciao,']}
                                    mainClassName="bg-primary text-white overflow-hidden px-2 py-1 justify-center rounded-lg"
                                    staggerFrom="last"
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-120%" }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden"
                                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                    rotationInterval={2000}
                                />
                                Bem vindo(a) ao SuperDot!
                            </Flex>
                        </h1>

                        {/* Texto introdutório */}
                        <div className="mt-4 space-y-4 sm:text-lg leading-relaxed">
                            <p>
                                Você foi convidado a participar da coleta de dados sobre altas habilidades/superdotação
                                que está sendo realizada pelo(a) pesquisador(a): <b>{researcherName}</b>.{" "}
                                {sourceForm === EAdultFormSource.SECOND_SOURCE && (
                                    <>
                                        Você foi indicado como a segunda fonte para os dados coletados do participante:{" "}
                                        <b>{participantName}</b>.
                                    </>
                                )}
                            </p>

                            <p>
                                O SuperDot é um sistema que visa auxiliar essa coleta de dados, facilitando o preenchimento
                                dos questionários. Ao preencher, você estará contribuindo tanto com a pesquisa do(a):{" "}
                                <b>{researcherName}</b>, quanto com a comunidade de pesquisadores de <b>AH/SD</b>.
                            </p>

                            <p>
                                A plataforma ainda se encontra em fase inicial, então é normal que alguns problemas apareçam.
                                Caso encontre algum problema ou tenha alguma sugestão, entre em contato pelo e-mail:{" "}
                                <b>grupacsuperdot@gmail.com</b>
                            </p>
                        </div>

                        {/* Campo de e-mail */}
                        <p className="text-center text-sm sm:text-lg my-6">
                            Para iniciar ou continuar o preenchimento, informe seu e-mail no campo abaixo:
                        </p>

                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md mx-auto mb-2">
                            <input
                                id="participantEmail"
                                placeholder="Insira seu e-mail aqui..."
                                type="email"
                                className="h-10 w-full sm:flex-1 px-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800"
                                onChange={(e) => setParticipantEmail(e.target.value)}
                            />
                            <Button
                                loading={loading}
                                type="button"
                                className="button-primary w-full sm:w-auto"
                                onClick={handleOnRequestVerificationCode}
                                color="primary"
                                title="Enviar"
                                size="Large"
                            />
                        </div>
                    </div>

                </Box>
            </FadeContent >


        </>

    );
};

export default IntroductionStep;
