const CardRoot = ({ children }: React.PropsWithChildren) => {
    return (
        <div className="max-h-sm grid-rows-[1fr 2fr 1fr] grid min-w-[350px] overflow-clip rounded-md bg-[#2F356D] shadow-md shadow-slate-800">
            {children}
        </div>
    );
};

export default CardRoot;
