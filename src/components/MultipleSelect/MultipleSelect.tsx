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

    const valuesFormatted = values?.map((value) => {
        return { value, label: value };
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
        <div className="mx-auto w-[50%] max-lg:w-full">
            <Select
                className="mt-3 text-black"
                isMulti
                options={optionsFormatted}
                onChange={setCurrentInputValue}
                placeholder={placeholder}
                value={valuesFormatted}
            />
            <span className="error-message">
                {(values?.length || 0) > 0 && "Você pode selecionar mais do que uma opção."}
            </span>
        </div>
    );
};

export default MultipleSelect;
