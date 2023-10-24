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
            <div className="h-full md:flex">
                <div className="bg-light-gradient hidden h-full align-middle md:flex md:w-9/12">
                    <img className="m-auto h-full" src={saly16}></img>N
                </div>
                <div className="flex h-full w-full overflow-auto bg-slate-100 text-[#4F4F4F]">
                    <div className="mt-24 w-full">
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
                        {/* <div className="my-14  flex h-6 w-full">
                            <Separator.Root className="m-auto h-px w-full bg-black" />
                            <div className="w-full font-bold">Ou acesse com</div>
                            <Separator.Root className="m-auto h-px w-full bg-black" />
                        </div>
                        <button className="m-auto flex items-center rounded-md border border-[#C2C2C2] p-2 font-medium hover:bg-slate-200">
                            <img src={googleLogo} className="pr-2"></img>Google
                        </button> */}
                    </div>
                </div>
            </div>
        </Notify>
    );
};
