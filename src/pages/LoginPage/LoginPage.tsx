import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { loginSchema } from "../../schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginResearcher } from "../../api/auth.api";
import { saveTokens } from "../../utils/tokensHandler";
import { useNavigate } from "react-router-dom";
import saly16 from "../../assets/Saly-16.svg";
import { Link } from "react-router-dom";
import { useState } from "react";
import Notify from "../../components/Notify/Notify";
import { Box, Flex, Separator } from "@radix-ui/themes";

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
        }
    });

    return (

        <Notify
            open={showNotification}
            onOpenChange={(open: boolean) => setShowNotification(open)}
            title={notificationTitle}
            description={notificationDescription}
        >

            <Flex className="bg-light-gradient h-full w-full align-middle">
                <img className="m-auto" src={saly16}></img>
            </Flex>


            <Flex direction="column" className="bg-slate-100 text-[#4F4F4F] w-full h-full">

                <Form.Root onSubmit={onSubmit} className="m-auto w-8/12 sm:w-6/12">
                    <h1>Login</h1>
                    <Form.Field name="email" className="mt-12">
                        <Form.Control placeholder="E-mail" type="email" {...register("email")}></Form.Control>
                        {errors?.email && (
                            <Form.Message className="error-message">{errors.email.message}</Form.Message>
                        )}
                    </Form.Field>
                    <Form.Field name="password" className="mt-4">
                        <Form.Control
                            placeholder="Senha"
                            type="password"
                            {...register("password")}
                        ></Form.Control>
                        {errors?.password && (
                            <Form.Message className="error-message">{errors.password.message}</Form.Message>
                        )}
                    </Form.Field>
                    <Form.Submit asChild>
                        <button className="button-primary mb-4 mt-9 w-full">Continuar</button>
                    </Form.Submit>
                    <Link className="text-sm" to="/register">
                        Não tenho uma conta...
                    </Link>
                </Form.Root>
                
            </Flex>

        </Notify>

    );
};