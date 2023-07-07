const CardAction = ({ children, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            disabled={disabled}
            className={`h-8 rounded-md ${disabled ? "bg-gray-400" : "bg-white hover:bg-blue-200"} px-2 py-1 text-black`}
            {...rest}
        >
            {children}
        </button>
    );
};

export default CardAction;
