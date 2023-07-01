import * as Form from "@radix-ui/react-form";
import "./styles.css";
import * as Checkbox from "@radix-ui/react-checkbox";

const RegisterPage = () => {
    return (
        <div className="container">
            <header className="title">Criar uma conta</header>
            <h3>Seus dados</h3>
            <Form.Root>
                <Form.Field className="mb-[10px] grid" name="profile_photo">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white"></Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome hovr:shadow-[0_0_0_1px_black] selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 focus:shadow-[0_0_0_2px_black]"
                            type="text"
                            required
                        />
                    </Form.Control>
                    <Form.Message className="text-[13px] text-white opacity-[0.8]" match="typeMismatch"></Form.Message>
                </Form.Field>
                <Form.Field className="mb -[10px] grid" name="full_name">
                    <div className="flex items-baseline justify-between">
                        <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Email</Form.Label>
                        <Form.Message className="text-[13px] text-white opacity-[0.8]" match="valueMissing">
                            Please enter your email
                        </Form.Message>
                    </div>
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Nome Completo</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="text"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="birth_date">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                        Data de Nascimento
                    </Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="date"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="email">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Email</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="email"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="email_confirm">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                        Confirmar Email
                    </Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="email"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="work_institute">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                        Instituição de Trabalho
                    </Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="text"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="state_country">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                        Estado de Atuação
                    </Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="text"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="phone_number">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Telephone</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="text"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="password">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">Senha</Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="password"
                            required
                        />
                    </Form.Control>
                </Form.Field>

                <Form.Field className="mb-[10px] grid" name="password_confirm">
                    <Form.Label className="text-[15px] font-medium leading-[35px] text-white">
                        Confirmar Senha
                    </Form.Label>
                    <Form.Control asChild>
                        <input
                            className="appearence=none leadind-none outline-nome selection: color-white box-border inline-flex h-[35px] w-full items-center justify-center rounded-[4px] bg-blackA5 px-[10px] text-[15px] text-white shadow-[0_0_0_1px] shadow-blackA9 selection:bg-blackA9 hover:shadow-[0_0_0_1px_black] focus:shadow-[0_0_0_2px_black]"
                            type="password"
                            required
                        />
                    </Form.Control>
                </Form.Field>
                <Checkbox.Root>
                    <Checkbox.Indicator></Checkbox.Indicator>
                </Checkbox.Root>
                <label>
                    Estou ciente de que todos os dados de pesquisa que forem cadastrados na plataforma estarão
                    disponibilizados publicamente
                </label>
            </Form.Root>
        </div>
    );
};

export default RegisterPage;
