const CardAction = ({ children, disabled, ...rest }: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
    return (
        <button
            disabled={disabled}
            className={`h-10 !w-[200px] rounded-md px-4 py-2 text-white transition-all focus:outline-none 
                ${disabled ? "bg-gray-300 cursor-not-allowed" : "bg-primary hover:bg-secondary border-2"} 
                w-full sm:w-auto`}
            {...rest}
        >
            {children}
        </button>
    );
};
export default CardAction;