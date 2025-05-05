const CardHeader = ({ children }: React.PropsWithChildren) => {
    return (
        <div className="py-4 text-xl font-semibold text-gray-800">
            {children}
        </div>
    )
};

export default CardHeader;