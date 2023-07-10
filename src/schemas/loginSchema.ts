import { InferType, object, string } from "yup";

export const loginSchema = object({
    email: string().email("Insira um e-mail válido").required("Por favor, insira o email"),
    password: string().min(8, "A senha precisa ter, no mínimo, 8 caracteres").required("Por favor, insira uma senha"),
});

export type LoginValues = InferType<typeof loginSchema>;
