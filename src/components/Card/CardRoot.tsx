const CardRoot = ({ children }: React.PropsWithChildren) => {
    return (
        <div className="max-h-[400px] min-w-[350px]  rounded overflow-hidden bg-white rounded-b-lg border-l-8 border-primary  shadow-md  group group/item transition-all pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto px-5 hover:translate-y-[3px]">
            {children}
        </div>
    );
};

export default CardRoot;