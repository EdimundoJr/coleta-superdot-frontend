import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";

interface TextAreaFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["textarea"]> {
    label: string;
    placeholder?: string;
    name: string;
    errorMessage?: string;
}

export const TextAreaField = forwardRef<HTMLTextAreaElement, TextAreaFieldProps>(
    ({ label, placeholder, name, errorMessage, ...rest }, ref) => {
        return (
            <Form.Field className="relative mb-6 w-full" name={name}>
                <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide">
                    {label}
                </Form.Label>
                <Form.Control asChild className="h-20 w-full rounded-[4px] p-2  text-sm">
                    <textarea placeholder={placeholder} ref={ref} {...rest} />
                </Form.Control>
                {errorMessage && (
                    <Form.Message className="float-left text-[13px] md:float-none">{errorMessage}</Form.Message>
                )}
            </Form.Field>
        );
    }
);
