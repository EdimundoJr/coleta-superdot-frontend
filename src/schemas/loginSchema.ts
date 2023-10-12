import { InferType, object, string } from "yup";

export const loginSchema = object({
    email: string().email("Insira um e-mail válido").required("Insira o email"),
    password: string().min(8, "A senha precisa ter, no mínimo, 8 caracteres").required("Insira a senha"),
});

export type LoginValues = InferType<typeof loginSchema>;
