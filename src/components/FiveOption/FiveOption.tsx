interface FiveOptionProps {
    options: string[];
    value: string;
    onSelect: (value: string) => void;
}

const FiveOption = ({ options, value, onSelect }: FiveOptionProps) => {
    return (
        <div className="mt-4 justify-center gap-4 sm:flex">
            {options?.map((option) => (
                <button
                    key={option}
                    onClick={() => onSelect(option)}
                    className={`${option === value ? "button-secondary" : "button-primary"}`}
                >
                    {option}
                </button>
            ))}
        </div>
    );
};

export default FiveOption;
