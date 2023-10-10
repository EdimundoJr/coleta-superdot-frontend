import Select, { MultiValue } from "react-select";

interface MultipleSelectProps {
    options: string[];
    values: string[];
    onChange: (values: string[]) => void;
    placeholder: string;
}

const MultipleSelect = ({ options, values, onChange, placeholder }: MultipleSelectProps) => {
    const optionsFormatted = options?.map((option) => {
        return { value: option, label: option };
    });

    const setCurrentInputValue = (
        valuesSelected: MultiValue<{
            value: string;
            label: string;
        }>
    ) => {
        onChange([...valuesSelected].map((v) => v.value));
    };

    return (
        <div className="mx-auto sm:w-1/3">
            <Select
                className="mt-3 text-black"
                isMulti
                options={optionsFormatted}
                onChange={setCurrentInputValue}
                placeholder={placeholder}
            />
            <span className="error-message">
                {(values?.length || 0) > 0 && "Você pode selecionar mais do que uma opção."}
            </span>
        </div>
    );
};

export default MultipleSelect;
