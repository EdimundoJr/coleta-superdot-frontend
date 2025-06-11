import * as Form from "@radix-ui/react-form";
import { Flex } from "@radix-ui/themes";
import { forwardRef } from "react";

interface InputFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["input"]> {
    label?: string;
    placeholder?: string;
    name: string;
    errorMessage?: React.ReactNode;
    icon?: React.ReactNode;
    actionButton?: React.ReactNode;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, placeholder, name, errorMessage, type, className, icon, actionButton, ...rest }, ref) => {

        return (
            <Form.Field className={`w-full ${label ? "mb-2" : "mb-0"}  rounded-lg ${className}`} name={name}>
                <Form.Label className={`block text-left text-xs font-bold uppercase tracking-wide `}>
                    {label}
                </Form.Label>
                <Flex justify="center" align="center" className={`border rounded-md bg-white`}>
                    {icon && <Flex className="p-2">{icon}</Flex>}
                    <Form.Control asChild className={`h-10 w-full`}>

                        <input placeholder={placeholder} ref={ref} type={type} {...rest} className="bg-white border-none max-sm:placeholder:text-[12px] max-sm:p-2" />

                    </Form.Control>
                    {actionButton && (
                        <Flex className=" p-1 pr-3">
                            {actionButton}
                        </Flex>
                    )}
                </Flex>
                {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
            </Form.Field>
        );
    }
);
