import { Skeleton } from "@radix-ui/themes";

interface CardRootProps extends React.PropsWithChildren {
    className?: string;
    loading?: boolean;
}

const CardRoot = ({ children, className, loading }: CardRootProps) => {
    return (
        <Skeleton loading={loading}>
            <div
                className={`w-full mb-3 rounded-lg card-container overflow-hidden bg-white  !border-l-8 !border-t-0 !border-r-0  !border-b-0 group transition-all pt-6 px-6 xl:pl-4 hover:drop-shadow-lg hover:translate-y-2 font-roboto ${className ? className : "!border-gray-400"}`}
            >
                {children}
            </div>
        </Skeleton>
    );
};

export default CardRoot;