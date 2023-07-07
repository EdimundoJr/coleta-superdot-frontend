const CardHeader = ({ children }: React.PropsWithChildren) => {
    return <div className="flex justify-center gap-1 px-2 py-4">{children}</div>;
};

export default CardHeader;
