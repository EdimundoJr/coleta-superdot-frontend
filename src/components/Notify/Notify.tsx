import * as Toast from "@radix-ui/react-toast";

interface NotifyProps extends React.PropsWithChildren {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
}

const Notify = ({ open, onOpenChange, title, description, children }: NotifyProps) => {
    return (
        <>
            <Toast.Provider>
                {children}
                <Toast.Root
                    className="grid grid-cols-[auto_max-content] items-center gap-x-[15px] rounded-md border border-blue-800 bg-white p-[15px] text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] [grid-template-areas:_'title_action'_'description_action'] data-[swipe=cancel]:translate-x-0 data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[state=closed]:animate-hide data-[state=open]:animate-slideIn data-[swipe=end]:animate-swipeOut data-[swipe=cancel]:transition-[transform_200ms_ease-out]"
                    open={open}
                    onOpenChange={onOpenChange}
                >
                    <Toast.Title className="text-slate12 mb-[5px] text-[15px] font-medium [grid-area:_title]">
                        {title}
                    </Toast.Title>
                    <Toast.Description className="text-slate11 m-0 text-[13px] leading-[1.3] [grid-area:_description]">
                        <p>{description}</p>
                    </Toast.Description>
                </Toast.Root>
                <Toast.Viewport className="fixed right-0 top-0 z-[2147483647] m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-[10px] p-[var(--viewport-padding)] outline-none [--viewport-padding:_25px]" />{" "}
            </Toast.Provider>
        </>
    );
};

export default Notify;
