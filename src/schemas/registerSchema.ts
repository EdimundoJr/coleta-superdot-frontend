import { InferType, date, mixed, object, string } from "yup";

export const registerSchema = object({
    personal_data: object({
        full_name: string().required("Por favor, insira o nome completo.").trim().uppercase(),
        phone: string().max(11).required("Por favor, insira o número de telefone.").trim(),
        profile_photo: mixed<File>()
            .transform((value) => {
                return value instanceof FileList ? value[0] : undefined;
            })
            .test({
                name: "correct-mimetype",
                test(value, ctx) {
                    if (value) {
                        if (!value.type.startsWith("image")) {
                            return ctx.createError({ message: "Arquivo inválido. Por favor, carregue uma imagem." });
                        }
                    }
                    return true;
                },
            }),
        birth_date: date()
            .typeError("Por favor, insira uma data válida!")
            .required("Por favor, insira a data de nascimento."),
        country_state: string().required("Por favor, insira o estado de atuação."),
    }),
    email: string().email("Insira um e-mail válido.").required("Por favor, insira o email."),
    confirm_email: string().email("Insira um e-mail válido.").required("Por favor, insira o email novamente."),
    instituition: string().required("Por favor, insira a instituição."),
    password: string().min(8, "A senha precisa ter, no mínimo, 8 caracteres").required("Por favor, insira uma senha."),
    password_confirmation: string().required("Por favor, insira a senha novamente."),
});

export type RegisterValues = InferType<typeof registerSchema>;
