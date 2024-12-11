import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginResearcher } from "../../api/auth.api";
import { saveTokens } from "../../utils/tokensHandler";
import { useNavigate } from "react-router-dom";
import saly16 from "../../assets/Saly-16.svg";
import logo from '../../assets/Logo-GRUPAC.png'
import { Link } from "react-router-dom";
import { useState } from "react";
import Notify from "../../components/Notify/Notify";
import { Box, Flex } from "@radix-ui/themes";
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

    const [showNotification, setShowNotification] = useState(false);
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");
    const [notificationIcon, setNotificationIcon] = useState<React.ReactNode>();
    const [notificationClass, setNotificationClass] = useState("");

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await loginResearcher(data);
            if (response.status === 200) {
                saveTokens(response.data);
                navigate("/app/home");
            }
        } catch (erroLogin) {
            console.error(erroLogin);
            setShowNotification(true);
            setNotificationTitle("Credenciais inválidas.");
            setNotificationDescription("O email ou a senha estão incorretos.");
            setNotificationIcon(<Icon.XCircle size={30} color="white" />);
            setNotificationClass("bg-red-500");
        }
    });

    return (

        <Notify
            open={showNotification}
            onOpenChange={(open: boolean) => setShowNotification(open)}
            title={notificationTitle}
            description={notificationDescription}
            icon={notificationIcon}
            className={notificationClass}
        >

            <Flex className="bg-gradient-to-b from-primary to-secondary h-full w-full align-middle">
                <img className="m-auto " src={saly16}></img>

            </Flex>


            <Flex direction="column" className="w-full text-[#4F4F4F] m-auto">
                <Form.Root onSubmit={onSubmit} className="m-auto sm:w-6/12">
                    <Box className="mb-10">
                        <img className="m-auto w-40" src={logo}></img>
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
                        <Form.Submit asChild>
                            <Button size="Large" className="w-full mb-1" title={"Continuar"} color={"primary"} ></Button>
                        </Form.Submit>

                        <Link className="text-sm" to="/register">
                            Não tenho uma conta...
                        </Link>

                    </Box>

                </Form.Root>

            </Flex>

        </Notify>

    );
};