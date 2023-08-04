const CardRoot = ({ children }: React.PropsWithChildren) => {
    return (
        <div className="grid-rows-[1fr 2fr 1fr] grid max-h-[350px] min-w-[350px]  overflow-clip rounded-md bg-gradient-to-b from-[#5300B8] to-[#7F35E1] font-bold text-alternative-text shadow-md shadow-slate-800">
            {children}
        </div>
    );
};

export default CardRoot;
