const CardAction = ({ children, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            disabled={disabled}
            className={`h-8 rounded-md ${disabled ? "bg-gray-300 hover:cursor-not-allowed" : "bg-primary hover:bg-secondary houver:text-white border 2px "} px-2 py-1 text-white  w-[200px]`}
            {...rest}
        >
            {children}
        </button>
    );
};
export default CardAction;