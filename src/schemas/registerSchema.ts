import { date, object, string } from "yup";

export const detailsSchema = object({
    personalData: object({
        fullName: string().required("Por favor, insira o nome completo.").trim().uppercase(),
        phone: string().max(11).required("Por favor, insira o número de telefone.").trim(),
        birthDate: date()
            .typeError("Por favor, insira uma data válida!")
            .required("Por favor, insira a data de nascimento."),
        countryState: string().required("Por favor, insira o estado de atuação."),
    }),
    instituition: string().required("Por favor, insira a instituição."),
});

export const loginInfoSchema = object({
    email: string().email("Insira um e-mail válido.").required("Por favor, insira o email."),
    confirmEmail: string().email("Insira um e-mail válido.").required("Por favor, insira o email novamente."),
    password: string().min(8, "A senha precisa ter, no mínimo, 8 caracteres").required("Por favor, insira uma senha."),
    confirmPassword: string().required("Por favor, insira a senha novamente."),
});

export interface RegisterValues {
    personalData: {
        fullName: string;
        phone: string;
        birthDate: Date;
        profilePhoto?: File;
        countryState: string;
    };
    email: string;
    confirmEmail: string;
    password: string;
    confirmPassword: string;
    acceptUseTerm: boolean;
}
