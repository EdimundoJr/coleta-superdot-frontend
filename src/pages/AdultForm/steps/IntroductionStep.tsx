import { useState } from "react";
import { AxiosError, AxiosResponse } from "axios";
import { EAdultFormSource } from "../../../utils/consts.utils";
import * as ParticipantApi from "../../../api/participant.api";
import * as SecondSourceApi from "../../../api/secondSource.api";
import { Box, Flex } from "@radix-ui/themes";
import logo from '../../../assets/Logo-GRUPAC.png'
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
            <div className="absolute inset-0 bg-glass m-auto w-[50%] sm:w-[90%] md:w-[60%] lg:w-[50%] xl:w-[50%] text-justify max-sm:w-[90%]"></div>
            <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
                <Box className="p-5 gap-y-5 max-sm:gap-y-2 max-sm:p-0 font-roboto text-slate-950 m-auto w-[95%] mt-2 relative">
                    <div className="m-auto w-[50%] sm:w-[90%] md:w-[60%] lg:w-[50%] xl:w-[50%] text-justify font-roboto text-gray-50 max-sm:w-[90%] mb-4 relative z-10">
                        <div className="flex">
                            <img className="m-auto w-36" src={logo} alt="Logo" />
                        </div>
                        <h1 className="text-center text-2xl font-bold max-sm:text-lg">
                            <Flex gap="2" align={"center"} justify={"center"}>
                                <RotatingText
                                    texts={['Olá', 'Hello', 'Hola', 'Bonjour', 'Ciao']}
                                    mainClassName="bg-primary text-white overflow-hidden px-2 py-1 justify-center rounded-lg"
                                    staggerFrom={"last"}
                                    initial={{ y: "100%" }}
                                    animate={{ y: 0 }}
                                    exit={{ y: "-120%" }}
                                    staggerDuration={0.025}
                                    splitLevelClassName="overflow-hidden"
                                    transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                    rotationInterval={2000}
                                />
                                , Bem vindo(a) ao SuperDot!
                            </Flex>
                        </h1>
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
                            O SuperDot é um sistema que visa auxiliar essa coleta de dados, facilitando o preenchimento dos
                            questionários de superdotação. Ao preencher o questionário a seguir, você estará contribuindo tanto
                            com a pesquisa do(a) <b>{researcherName}</b>, quanto com toda a comunidade de pesquisadores de <b>AH/SD</b> do
                            Brasil.
                        </p>
                        <br />
                        <p>
                            A plataforma ainda se encontra em sua fase inicial, então é normal que alguns problemas apareçam
                            durante sua utilização. Caso encontre algum problema ou tenha alguma sugestão de melhoria, por favor
                            entre em contato conosco através do e-mail: <b>grupacdev@gmail.com</b>
                        </p>
                        <br />
                        <p className="text-center text-lg mb-4">
                            Para iniciar ou continuar o preenchimento, informe seu e-mail no campo abaixo:
                        </p>
                        <Flex justify={"center"} align={"center"} direction="row" className="m-auto w-2/4 max-sm:w-[80%] gap-2">
                            <input id="participantEmail" placeholder="Insira seu e-mail aqui..." type="email" className="h-10" onChange={(e) => setParticipantEmail(e.target.value)} />
                            <Button loading={loading} type="button" className="button-primary" onClick={handleOnRequestVerificationCode} color={"primary"} title={"Enviar"} size={"Large"} />
                        </Flex>
                    </div>
                </Box>
            </FadeContent>
        </>

    );
};

export default IntroductionStep;
