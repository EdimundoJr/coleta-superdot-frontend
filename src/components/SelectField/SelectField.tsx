import * as Form from "@radix-ui/react-form";
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
            <Form.Field className="mb-6 w-full px-3" name={name}>
                <div className="flex items-baseline justify-between">
                    <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                        {label}
                    </Form.Label>
                </div>
                <div className="flex gap-4">
                    <Form.Control asChild>
                        <select
                            ref={ref}
                            {...rest}
                            className={`h-[35px] w-full rounded-[4px] px-4 text-sm ${className}}`}
                        >
                            {children}
                        </select>
                    </Form.Control>
                    {extraItem}
                </div>
                {errorMessage && (
                    <Form.Message className={`h-[35px] w-full rounded-[4px] px-4 text-sm ${className}`}>
                        {errorMessage}
                    </Form.Message>
                )}
            </Form.Field>
        );
    }
);
