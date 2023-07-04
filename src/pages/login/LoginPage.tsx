import * as Form from "@radix-ui/react-form";
import { useForm } from "react-hook-form";
import { LoginValues, loginSchema } from "../../schemas/loginSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import { InputField } from "../../components/Outer/InputField/InputField";
import { loginResearcher } from "../../api/auth.api";

export const LoginPage = () => {
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm({ resolver: yupResolver(loginSchema) });

    const onSubmit = handleSubmit(async (data) => {
        try {
            const response = await loginResearcher(data);
            console.log(response);
        } catch (erroLogin) {
            console.error(erroLogin);
        }
    });

    return (
        <div className="relative h-full overflow-auto bg-slate-950 bg-opacity-50 bg-[url('src/assets/background.png')] bg-cover bg-no-repeat bg-blend-multiply">
            <header className="p-6 text-4xl">Login</header>
            <Form.Root onSubmit={onSubmit} className="mx-auto w-4/12 md:w-4/12 lg:w-3/12 ">
                <div className="-mx-3 mb-6 mt-11 grid grid-cols-1 gap-y-9 ">
                    <InputField
                        placeholder="Email"
                        error={!!errors.email}
                        errorMessage={errors.email?.message}
                        type="email"
                        {...register("email")}
                    ></InputField>

                    <InputField
                        placeholder="Senha"
                        error={!!errors.password}
                        errorMessage={errors.password?.message}
                        type="password"
                        {...register("password")}
                    ></InputField>
                </div>

                <div>
                    <Form.Submit asChild className="mt-10">
                        <button className="sahdow-[0_2px_10px] mt-[10px] box-border inline-flex h-[35px] items-center justify-center rounded-[4px] bg-violet-800 px-[15px] font-medium leading-none text-white shadow-blackA7 hover:bg-violet-600 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none">
                            Continuar
                        </button>
                    </Form.Submit>

                    <div className="mb-5 mt-3 text-xs">
                        <a href="#">Já tenho uma conta...</a>
                    </div>
                </div>
            </Form.Root>
        </div>
    );
};
