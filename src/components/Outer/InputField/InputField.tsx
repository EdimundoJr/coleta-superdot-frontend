import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";

interface InputFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["input"]> {
    placeholder: string;
    name: string;
    error: boolean;
    errorMessage?: string;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ placeholder, name, error, errorMessage, type, className, ...rest }, ref) => {
        return (
            <Form.Field className="mb-6 w-full px-3" name={name}>
                <Form.Label className="text-white-700 mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                    {placeholder}
                </Form.Label>
                <Form.Control
                    asChild
                    className={`h-[35px] w-full rounded-[4px] border bg-violet-400 px-4 text-sm text-white ${className}`}
                >
                    <input ref={ref} type={type} {...rest} />
                </Form.Control>
                {error && (
                    <Form.Message className="float-left text-[13px] text-white opacity-[0.8] md:float-none">
                        {errorMessage}
                    </Form.Message>
                )}
            </Form.Field>
        );
    }
);
