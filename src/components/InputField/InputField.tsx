import * as Form from "@radix-ui/react-form";
import { forwardRef } from "react";

interface InputFieldProps extends React.PropsWithRef<React.JSX.IntrinsicElements["input"]> {
    label: string;
    placeholder?: string;
    name: string;
    errorMessage?: string;
    scope: "INNER" | "OUTER";
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ scope, label, placeholder, name, errorMessage, type, className, ...rest }, ref) => {
        const controlStyleOuter = "border bg-violet-400 text-white";
        const controlStyleInner = "border-2 border-gray-500 bg-white text-black";

        const messageStyleOuter = "text-white opacity-[0.8]";
        const messageStyleInner = "text-black";

        return (
            <Form.Field className="mb-6 w-full px-3" name={name}>
                <Form.Label
                    className={`mb-2 block text-left text-xs font-bold uppercase tracking-wide ${
                        scope === "OUTER" ? "text-white-700" : "text-blue-700"
                    }`}
                >
                    {label}
                </Form.Label>
                <Form.Control
                    asChild
                    className={`h-[35px] w-full rounded-[4px] px-4 text-sm  ${className} ${
                        scope === "OUTER" ? controlStyleOuter : controlStyleInner
                    }`}
                >
                    <input placeholder={placeholder} ref={ref} type={type} {...rest} />
                </Form.Control>
                {errorMessage && (
                    <Form.Message
                        className={`float-left text-[13px] md:float-none ${
                            scope === "OUTER" ? messageStyleOuter : messageStyleInner
                        }`}
                    >
                        {errorMessage}
                    </Form.Message>
                )}
            </Form.Field>
        );
    }
);
