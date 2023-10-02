import { date, object, string } from "yup";

export const detailsSchema = object({
    personalData: object({
        fullName: string().required("Nome completo é um campo obrigatório.").trim().uppercase(),
        phone: string().max(11).required("Número de telefone é um campo obrigatório.").trim(),
        birthDate: date().typeError("Data inválida!").required("Data de nascimento é um campo obrigatória."),
        countryState: string().required("Estado de atuação é um campo obrigatório."),
    }),
    instituition: string().required("Instituição é um campo."),
});

export const loginInfoSchema = object({
    email: string().email("Insira um e-mail válido.").required("Email é um campo obrigatório."),
    emailConfirmation: string().email("Insira um e-mail válido.").required("Digite o e-mail novamente."),
    password: string().min(8, "A senha precisa ter, no mínimo, 8 caracteres").required("Senha é um campo obrigatório."),
    passwordConfirmation: string().required("Digite a senha novamente."),
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
    emailConfirmation: string;
    password: string;
    passwordConfirmation: string;
    acceptUseTerm: boolean;
}
