import * as Icon from "@phosphor-icons/react";
import { AlertDialog, Button, Flex, Text } from "@radix-ui/themes";

interface ModalProps extends React.PropsWithChildren {
    open: boolean;
    setOpen: (open: boolean) => void;
    title: string;
    accessibleDescription: string;
    accessibleDescription2?: string;
}

const Modal = ({ title, accessibleDescription, accessibleDescription2, open, setOpen, children }: ModalProps) => {
    return (

        <AlertDialog.Root open={open} onOpenChange={setOpen}>
            <AlertDialog.Content className="">
                <Flex className="absolute top-[10px] right-2">
                    <AlertDialog.Cancel >
                        <Button size="1" color="red" className="hover:cursor-pointer hover:bg-red-600 active:bg-red-700" >
                            <Icon.X size={20} weight="bold"></Icon.X>
                        </Button>
                    </AlertDialog.Cancel>
                </Flex>

                <AlertDialog.Title>{title}</AlertDialog.Title>

                <AlertDialog.Description size="2" className="mb-4">
                    <Flex direction="column">
                        <Text as="label">
                            {accessibleDescription}
                        </Text>
                        <Text as="label">
                            {accessibleDescription2}
                        </Text>
                    </Flex>
                </AlertDialog.Description>
                {children}

            </AlertDialog.Content>

        </AlertDialog.Root>
    );
};

export default Modal;
