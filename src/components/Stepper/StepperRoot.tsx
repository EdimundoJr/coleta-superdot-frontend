import StepperStep from "./StepperStep";

interface StepperRootProps {
    children: React.ReactElement<typeof StepperStep>[] | React.ReactElement<typeof StepperStep> | null;
    removeBackground?: boolean;
}

const StepperRoot = ({ children, removeBackground }: StepperRootProps) => {
    return (
        <div className={`m-4 max-md:m-0 justify-between ${!removeBackground && "bg-violet-400"} p-4 flex`}>
            {children}
        </div>
    );
};

export default StepperRoot;
