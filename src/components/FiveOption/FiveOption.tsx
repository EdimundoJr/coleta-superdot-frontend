import { Flex } from "@radix-ui/themes";
import { Button } from "../Button/Button";
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
                    className={"w-[350px] text-[15px] max-sm:text-[14px] max-sm:w-[300px] gap-1"}
                />

            ))}
        </Flex>
    );
};

export default FiveOption;
