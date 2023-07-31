import * as Dialog from "@radix-ui/react-dialog";
import { Cross2Icon } from "@radix-ui/react-icons";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import * as Separator from "@radix-ui/react-separator";

interface ModalProps extends React.PropsWithChildren {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    accessibleDescription: string;
}

const Modal = ({ title, accessibleDescription, open, setOpen, children }: ModalProps) => {
    return (
        <Dialog.Root open={open} onOpenChange={setOpen}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-neutral-dark opacity-80 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[100vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll rounded-[6px] bg-white p-[25px] text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]  focus:outline-none data-[state=open]:animate-contentShow sm:w-fit">
                    <Dialog.Title>{title}</Dialog.Title>
                    <Separator.Root className="my-5 h-px w-full bg-gray-300" />
                    <VisuallyHidden.Root asChild>
                        <Dialog.Description>{accessibleDescription}</Dialog.Description>
                    </VisuallyHidden.Root>
                    {children}
                    <Dialog.Close asChild>
                        <button
                            className="text-violet11 hover:bg-violet4 focus:shadow-violet7 absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full focus:shadow-[0_0_0_2px] focus:outline-none"
                            aria-label="Close"
                        >
                            <Cross2Icon />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default Modal;
