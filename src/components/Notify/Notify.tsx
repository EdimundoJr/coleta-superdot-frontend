import * as Toast from "@radix-ui/react-toast";
import { Flex } from "@radix-ui/themes";

interface NotifyProps extends React.PropsWithChildren {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}

const Notify: React.FC<NotifyProps> = ({
    open,
    onOpenChange,
    title,
    description,
    children,
    icon,
    className,
}) => {
    return (
        <Toast.Provider swipeDirection="right">
            {children}
            <Toast.Root
                className={`bg-white rounded-md shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] grid [grid-template-areas:_'title_action'_'description_action'] grid-cols-[auto_max-content] gap-x-[15px] items-center data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=cancel]:transition-[transform_200ms_ease-out] data-[swipe=end]:animate-swipeOut font-roboto border-2 text-stone-950 `}
                open={open}
                onOpenChange={onOpenChange}
            >
                <Flex justify="between" className="w-full ">
                    <Flex align="center" className={`w-[50px] p-2 ${className} rounded-tl-md rounded-bl-md`}>
                        {icon}
                    </Flex>
                    <Flex direction="column" justify={"center"} align={"center"} className="p-[15px] w-full">
                        {title && (
                            <Toast.Title className="[grid-area:_title] mb-[5px] font-medium text-slate12 text-[15px]">
                                {title}
                            </Toast.Title>
                        )}
                        {description && (
                            <Toast.Description asChild className="[grid-area:_description] m-0 text-slate11 text-[13px] leading-[1.3] text-justify">
                                <p>{description}</p>
                            </Toast.Description>
                        )}
                    </Flex>
                </Flex>
            </Toast.Root>
            <Toast.Viewport className="[--viewport-padding:_10px] fixed bottom-0 right-0 flex flex-col p-[var(--viewport-padding)] gap-[10px] w-[450px] max-w-[100vw] m-0 list-none z-[9999] outline-none " />
        </Toast.Provider>
    );
};

export default Notify;
