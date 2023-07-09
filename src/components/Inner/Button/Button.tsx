interface ButtonProps
    extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
    scope: "INNER" | "OUTER";
}

const Button = ({ placeholder, scope, className, ...rest }: ButtonProps) => {
    const styleInner = "bg-blue-800 hover:bg-blue-500 ";
    const styleOuter = "bg-violet-800 px-[15px] text-white hover:bg-violet-600 ";

    return (
        <button
            {...rest}
            className={`${className} box-border inline-flex h-[35px] items-center justify-center rounded-[4px] p-3 font-medium leading-none shadow-[0_2px_10px] shadow-blackA7 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none ${
                scope === "OUTER" ? styleOuter : styleInner
            }`}
        >
            {placeholder}
        </button>
    );
};

export default Button;
