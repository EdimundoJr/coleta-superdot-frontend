import * as Icon from "@phosphor-icons/react";
import { AlertDialog, Flex, Text } from "@radix-ui/themes";
import { Button } from "../Button/Button";

interface ModalProps extends React.PropsWithChildren {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    accessibleDescription: string;
    accessibleDescription2?: string;
    className?: string;
}

const Modal = ({
    title,
    accessibleDescription,
    accessibleDescription2,
    open,
    setOpen,
    children,
    className,
}: ModalProps) => {
    return (
        <AlertDialog.Root open={open} onOpenChange={setOpen}>

            <AlertDialog.Content
                className={`relative bg-white rounded-md  p-6 z-50 ${className}`}

            >
                {/* Close Button */}

                <AlertDialog.Cancel className="absolute top-2 right-2">
                    <Button
                        className="hover:cursor-pointer"
                        aria-label="Close modal" title={""} color={"red"} size={"Small"}>
                        <Icon.X size={20} weight="bold" />
                    </Button>
                </AlertDialog.Cancel>


                {/* Title */}
                <AlertDialog.Title className={"text-xl font-bold mb-4 max-sm:!text-[18px]"}>{title}</AlertDialog.Title>

                {/* Description */}
                <AlertDialog.Description>
                    <Flex direction="column" gap="2" className="mb-4">
                        <Text as="p" className="text-sm">
                            {accessibleDescription}
                        </Text>
                        {accessibleDescription2 && (
                            <Text as="p" className="text-sm">
                                {accessibleDescription2}
                            </Text>
                        )}
                    </Flex>
                </AlertDialog.Description>

                {/* Children */}
                <div>{children}</div>
            </AlertDialog.Content>
        </AlertDialog.Root>
    );
};

export default Modal;
