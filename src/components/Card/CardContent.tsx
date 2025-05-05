import { Flex } from "@radix-ui/themes";

const CardContent = ({ children }: React.PropsWithChildren) => {
    return (
        <Flex direction="column" justify="center" className="text-justify space-y-3 text-gray-700">
            {children}
        </Flex>
    )
};

export default CardContent;
