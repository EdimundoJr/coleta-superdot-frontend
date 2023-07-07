const CardRoot = ({ children }: React.PropsWithChildren) => {
    return (
        <div className="max-h-sm grid-ro grid-rows-[1fr 2fr 1fr] grid max-w-sm overflow-clip rounded-md bg-[#2F356D] shadow-md shadow-slate-800">
            {children}
        </div>
    );
};

export default CardRoot;
