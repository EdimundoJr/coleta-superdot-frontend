interface FourInputProps {
    values: string[] | undefined;
    onChange: (newValues: string[]) => void;
}

const FourInput = ({ values, onChange }: FourInputProps) => {
    const getCurrentInputValue = (idx: number) => {
        return values ? values[idx] : "";
    };

    const setCurrentInputValue = (idx: number, newValue: string) => {
        if (values) {
            onChange(values.map((value, i) => (i === idx ? newValue : value)));
            return;
        }

        const arrValues = Array(4).fill(undefined);
        arrValues[idx] = newValue;
        onChange(arrValues);
    };

    return (
        <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/4">
            {/* CREATE AN ITERATOR FROM 0 TO 3 */}
            {[...Array(4).keys()].map((idx) => (
                <input
                    key={idx}
                    placeholder="Digite aqui"
                    value={getCurrentInputValue(idx)}
                    onChange={(e) => setCurrentInputValue(idx, e.target.value)}
                />
            ))}
        </div>
    );
};

export default FourInput;
