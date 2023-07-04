import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";

interface SelectFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["select"]> {
    placeholder: string;
    name: string;
    error: boolean;
    errorMessage?: string;
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ placeholder, name, error, errorMessage, className, children, ...rest }, ref) => {
        return (
            <Form.Field className="mb-6 w-full px-3" name={name}>
                <div className="flex items-baseline justify-between">
                    <Form.Label className="text-white-700 mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                        {placeholder}
                    </Form.Label>
                    {error && (
                        <Form.Message className="text-[13px] text-white opacity-[0.8]">{errorMessage}</Form.Message>
                    )}
                </div>
                <Form.Control asChild>
                    <select
                        ref={ref}
                        {...rest}
                        className={`h-[35px] w-full rounded-[4px] border bg-violet-400 px-4 text-sm text-white ${className}`}
                    >
                        {children}
                    </select>
                </Form.Control>
            </Form.Field>
        );
    }
);
