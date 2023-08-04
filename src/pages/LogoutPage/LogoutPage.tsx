import * as Dialog from "@radix-ui/react-dialog";
import * as Separator from "@radix-ui/react-separator";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useNavigate } from "react-router-dom";
import { clearTokens } from "../../utils/tokensHandler";

const LogoutPage = () => {
    const navigate = useNavigate();

    const logout = () => {
        clearTokens();
        navigate("/");
    };

    const returnPreviousPage = () => {
        navigate(-1);
    };

    return (
        <Dialog.Root open={true}>
            <Dialog.Portal>
                <Dialog.Overlay className="bg-neutralDark fixed inset-0 opacity-80 data-[state=open]:animate-overlayShow" />
                <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[100vh] w-[90vw] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll rounded-[6px] bg-white p-[25px] text-black shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px]  focus:outline-none data-[state=open]:animate-contentShow sm:w-fit">
                    <Dialog.Title>Deslogando...</Dialog.Title>
                    <Separator.Root className="my-5 h-px w-full bg-gray-300" />
                    <Dialog.Description>Deseja sair da plataforma?</Dialog.Description>
                    <div className="mt-4 flex justify-between">
                        <button onClick={logout} className="button-primary">
                            Sim
                        </button>
                        <button onClick={returnPreviousPage} className="button-primary">
                            Cancelar
                        </button>
                    </div>
                    <Dialog.Close asChild>
                        <button
                            className="absolute right-[10px] top-[10px] inline-flex h-[25px] w-[25px] appearance-none items-center justify-center rounded-full text-violet11 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
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

export default LogoutPage;
