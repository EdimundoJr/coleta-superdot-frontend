import { Box, Flex } from "@radix-ui/themes";
import { Button } from "../Button/Button";
import * as Icon from "@phosphor-icons/react"
interface FiveOptionProps {
    options: string[];
    value: string;
    onSelect: (value: string) => void;
}

const FiveOption = ({ options, value, onSelect }: FiveOptionProps) => {
    return (
        <Flex direction={"column"} align={"center"} justify={"center"} className="mt-4 gap-3">
            {options?.map((option) => (
                <Button
                    size="Large"
                    key={option}
                    onClick={() => onSelect(option)}
                    title={option}
                    color={`${option === value ? "green" : "white"}`}
                    // children={value === option ? <Icon.Check size={20} color={`#fff`} /> : ""}
                    className={"w-[300px] text-[15px] gap-1"}
                />

            ))}
        </Flex>
    );
};

export default FiveOption;
