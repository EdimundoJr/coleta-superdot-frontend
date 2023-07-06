import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";

interface SelectFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["select"]> {
    label: string;
    name: string;
    errorMessage?: string;
    scope: "INNER" | "OUTER";
}

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
    ({ label, name, errorMessage, className, children, scope, ...rest }, ref) => {
        const controlStyleOuter = "border bg-violet-400 text-white";
        const controlStyleInner = "border-2 border-gray-500 bg-white text-black";

        const messageStyleOuter = "text-white opacity-[0.8]";
        const messageStyleInner = "text-black";
        return (
            <Form.Field className="mb-6 w-full" name={name}>
                <div className="flex items-baseline justify-between">
                    <Form.Label
                        className={`mb-2 block text-left text-xs font-bold uppercase tracking-wide ${
                            scope === "OUTER" ? "text-white-700" : "text-blue-700"
                        }`}
                    >
                        {label}
                    </Form.Label>
                    {errorMessage && (
                        <Form.Message
                            className={`h-[35px] w-full rounded-[4px] px-4 text-sm  ${className} ${
                                scope === "OUTER" ? controlStyleOuter : controlStyleInner
                            }`}
                        >
                            {errorMessage}
                        </Form.Message>
                    )}
                </div>
                <Form.Control asChild>
                    <select
                        ref={ref}
                        {...rest}
                        className={`h-[35px] w-full rounded-[4px] px-4 text-sm  ${className} ${
                            scope === "OUTER" ? controlStyleOuter : controlStyleInner
                        }`}
                    >
                        {children}
                    </select>
                </Form.Control>
            </Form.Field>
        );
    }
);
