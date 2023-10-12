interface FourSelectProps {
    options: string[];
    values: string[] | undefined;
    onChange: (newValues: string[]) => void;
}

const FourSelect = ({ options, values, onChange }: FourSelectProps) => {
    const getCurrentSelectValue = (idx: number) => {
        return values ? values[idx] : "";
    };

    const changeCurrentSelectValue = (idx: number, newValue: string) => {
        if (values) {
            onChange(values.map((value, i) => (i === idx ? newValue : value)));
            return;
        }

        const arrValues = Array(4).fill(undefined);
        arrValues[idx] = newValue;
        onChange(arrValues);
    };

    return (
        <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/3">
            {/* CREATE AN ITERATOR FROM 0 TO 3 */}
            {[...Array(4).keys()].map((idx) => (
                <div className="flex items-center gap-5" key={idx}>
                    <label>{idx + 1}º</label>
                    <select
                        placeholder="Digite aqui"
                        value={getCurrentSelectValue(idx)}
                        onChange={(e) => {
                            changeCurrentSelectValue(idx, e.target.value);
                        }}
                    >
                        {options.map((option) => (
                            <option>{option}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    );
};

export default FourSelect;
