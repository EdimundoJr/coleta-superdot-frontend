import { AlertDialog,  Flex, Text } from "@radix-ui/themes";

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
            <AlertDialog.Content>
                <AlertDialog.Title>{title}</AlertDialog.Title>
                <AlertDialog.Description size="2">
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
