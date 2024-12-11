import { Flex } from "@radix-ui/themes";
import { Button } from "../Button/Button";
import * as Icon from "@phosphor-icons/react"
interface FiveOptionProps {
    options: string[];
    value: string;
    onSelect: (value: string) => void;
}

const FiveOption = ({ options, value, onSelect }: FiveOptionProps) => {
    return (
        <Flex justify={"center"} align={"center"} className="mt-4 gap-3 ">
            {options?.map((option) => (
                <Button
                    size="Large"
                    key={option}
                    onClick={() => onSelect(option)}
                    title={option}
                    color={`${option === value ? "secondary" : "primary"}`}
                    children={value === option ? <Icon.Check size={20} color="green" /> : ""}
                    className="w-[250px] text-[15px] gap-1 "
                />

            ))}
        </Flex>
    );
};

export default FiveOption;
