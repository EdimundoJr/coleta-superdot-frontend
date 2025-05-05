interface cardActionProps {
    children: React.ReactNode,
    className: string,
}

const CardActions = ({ children, className }: cardActionProps) => {
    return (
        <div className={`flex items-center ${className} gap-3 justify-between py-4`}>
            {children}
        </div>
    )
};

export default CardActions;
