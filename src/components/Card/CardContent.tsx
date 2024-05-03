import { Flex } from "@radix-ui/themes";

const CardContent = ({ children }: React.PropsWithChildren) => {
    return <Flex direction="column" justify="center" className="text-justify ">{children}</Flex>;
};

export default CardContent;
