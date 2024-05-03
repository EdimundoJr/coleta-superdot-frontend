interface cardActionProps{
    children: React.ReactNode,
    className: string,
}

const CardActions = ({ children, className}: cardActionProps) => {
    return <div className={`flex items-center ${className} gap-2 px-2 py-4`}>{children}</div>;
};

export default CardActions;
