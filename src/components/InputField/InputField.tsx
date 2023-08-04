import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";

interface InputFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["input"]> {
    label: string;
    placeholder?: string;
    name: string;
    errorMessage?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, placeholder, name, errorMessage, type, className, ...rest }, ref) => {
        return (
            <Form.Field className="mb-6 w-full px-3" name={name}>
                <Form.Label className={`mb-2 block text-left text-xs font-bold uppercase tracking-wide`}>
                    {label}
                </Form.Label>
                <Form.Control asChild className={`h-[35px] w-full rounded-[4px] px-4 text-sm  ${className}`}>
                    <input placeholder={placeholder} ref={ref} type={type} {...rest} />
                </Form.Control>
                {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
            </Form.Field>
        );
    }
);
