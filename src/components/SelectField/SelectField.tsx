import * as Form from "@radix-ui/react-form";
import { Flex } from "@radix-ui/themes";
import { ReactNode, forwardRef } from "react";

interface SelectFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["select"]> {
    label: string;
    name: string;
    errorMessage?: string;
    extraItem?: ReactNode;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, name, errorMessage, className, children, extraItem, ...rest }, ref) => {
        return (
            <Form.Field className="mb-5 w-full px-3" name={name}>
                <Flex justify={"between"} align={"baseline"}>
                    <Form.Label className="text-left text-xs font-bold uppercase tracking-wide">
                        {label}
                    </Form.Label>
                </Flex>
                <Flex gap="4">
                    <Form.Control asChild>
                        <select
                            ref={ref}
                            {...rest}
                            className={`h-10 w-full hover:cursor-pointer ${className}}`}
                        >
                            {children}
                        </select>
                    </Form.Control>
                    {extraItem}
                </Flex>
                {errorMessage && <Form.Message className="error-message">{errorMessage}</Form.Message>}
            </Form.Field>
        );
    }
);
