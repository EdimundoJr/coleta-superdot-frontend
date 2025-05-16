import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginResearcher } from "../../api/auth.api";
import { saveTokens } from "../../utils/tokensHandler";
import { useNavigate } from "react-router-dom";
import logo from '../../assets/Logo-GRUPAC.png'
import { Link } from "react-router-dom";
import { useState } from "react";
import Notify from "../../components/Notify/Notify";
import { Box, Flex, Strong } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
import { InputField } from "../../components/InputField/InputField";

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginSchema) });
    const navigate = useNavigate();

    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const [loading, setLoading] = useState(false)

    const onSubmit = handleSubmit(async (data) => {
        setLoading(true);
        try {
            const response = await loginResearcher(data);
            if (response.status === 200) {
                setLoading(false)
                saveTokens(response.data);
                navigate("/app/home");
            }
        } catch (erroLogin) {
            console.error(erroLogin);
            setNotificationData({
                title: "Credenciais inválidas.",
                description: "O email ou a senha estão incorretos.",
                type: "erro",
            });


        } finally {
            setLoading(false);
        }


    });

    return (

        <Notify
            open={!!notificationData.title}
            onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
            title={notificationData.title}
            description={notificationData.description}
            icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
            className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
        >
            <Flex className="h-screen w-full desktop-flex">
                <Flex className="bg-default-bg h-auto w-full align-middle">
                </Flex>
                <Flex direction="column" className="w-full text-[#4F4F4F] m-auto">
                    <Form.Root onSubmit={onSubmit} className="m-auto w-[70%] max-md:w-[80%] ">
                        <Box className="mb-10">
                            <img className="m-auto w-40" src={logo}></img>
                        </Box>
                        <Box className="text-left mb-10 w-[70%] lg:w-[100%] md:w-[100%] max-sm:w-[100%]">
                            <h1 className="mb-4 text-[36px] leading-none">Acesse a plataforma</h1>
                            <p className=" text-[16px]">Faça login ou registre-se para começar a sua pesquisa ainda hoje.</p>
                        </Box>
                        <Box className="mb-4">
                            <InputField label={""} type="email" placeholder="E-mail" icon={<Icon.Envelope color="gray" />}  {...register("email")} errorMessage={errors?.email && (
                                <Form.Message className="error-message">{errors.email.message}</Form.Message>
                            )}></InputField>
                        </Box>
                        <Box>
                            <InputField label={""} type="password" placeholder="Senha" icon={<Icon.Key color="gray" />}  {...register("password")} errorMessage={errors?.password && (
                                <Form.Message className="error-message">{errors.password.message}</Form.Message>
                            )}></InputField>
                        </Box>
                        <Box>
                            <Form.Submit asChild >
                                <Button loading={loading} size="Large" className="w-full mb-8 mt-4" title={"Entrar"} color={"primary"} >

                                </Button>
                            </Form.Submit>

                            <p className="text-sm text-left">
                                Ainda não tem uma conta? <Link to="/register">
                                    <Strong className="text-primary bold">Inscreva-se</Strong>
                                </Link>
                            </p>
                        </Box>

                    </Form.Root>

                </Flex>
            </Flex>
            <div className="absolute inset-0 z-10 bg-default-bg max-xl:bg-default-bg-mobo bg-cover mobo h-screen">
                <Flex direction={"column"} className="w-[80%] max-sm:w-full bg-glass relative card-container-border-variant sm:top-1/2 sm:left-1/2 sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 py-3 max-sm:border-none  max-sm:rounded-none  max-sm:h-screen">


                    <Flex direction="column" className="w-full text-[#4F4F4F] m-auto">
                        <Form.Root onSubmit={onSubmit} className="m-auto w-auto max-sm:w-[80%]">
                            <Box className="mb-10">
                                <img className="m-auto w-40" src={logo}></img>
                            </Box>
                            <Box className="text-left mb-10 w-[70%] max-sm:w-[100%]">
                                <h1 className="mb-4 text-[30px] text-white leading-none">Acesse a plataforma</h1>
                                <p className=" text-[16px] text-white">Faça login ou registre-se para começar a sua pesquisa ainda hoje.</p>
                            </Box>
                            <Box className="mb-4 bg-off-white rounded-lg">
                                <InputField label={""} type="email" placeholder="E-mail" icon={<Icon.Envelope color="gray" />}  {...register("email")} errorMessage={errors?.email && (
                                    <Form.Message className="error-message">{errors.email.message}</Form.Message>
                                )}></InputField>
                            </Box>
                            <Box className="mb-4 bg-off-white rounded-lg">
                                <InputField label={""} type="password" placeholder="Senha" icon={<Icon.Key color="gray" />}  {...register("password")} errorMessage={errors?.password && (
                                    <Form.Message className="error-message">{errors.password.message}</Form.Message>
                                )}></InputField>
                            </Box>
                            <Box>
                                <Form.Submit asChild >
                                    <Button loading={loading} size="Large" className="w-full mb-8 mt-4" title={"Entrar"} color={"primary"} >

                                    </Button>
                                </Form.Submit>

                                <p className="text-sm text-left text-black">
                                    Ainda não tem uma conta? <Link to="/register">
                                        <Strong className="text-primary bold">Inscreva-se</Strong>
                                    </Link>
                                </p>
                            </Box>

                        </Form.Root>

                    </Flex>
                </Flex>
            </div>


        </Notify>

    );
};