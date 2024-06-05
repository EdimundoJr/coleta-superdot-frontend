import * as Form from "@radix-ui/react-form";
import { Flex } from "@radix-ui/themes";
import { forwardRef } from "react";

interface InputFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["input"]> {
    label: string;
    placeholder?: string;
    name: string;
    errorMessage?: React.ReactNode;
    icon?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, placeholder, name, errorMessage, type, className, icon, ...rest }, ref) => {
        return (
            <Form.Field className="w-full border-none px-3 rounded-[8px] " name={name}>
                <Form.Label className={`block text-left text-xs font-bold uppercase tracking-wide`}>
                    {label}
                </Form.Label>
                <Flex className={`items-center ${className} border-2 rounded-[8px]`}>
                    {icon && <Flex className="p-2">{icon}</Flex>}
                    <Form.Control asChild className={`h-[35px] w-full rounded-[4px] px-4 text-sm  ${className}`}>
                        <input placeholder={placeholder} ref={ref} type={type} {...rest} className="border-none" />
                    </Form.Control>
                </Flex>
                {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
            </Form.Field>
        );
    }
);
