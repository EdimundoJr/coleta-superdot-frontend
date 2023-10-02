import StepperStep from "./StepperStep";

interface StepperRootProps {
    children: React.ReactElement<typeof StepperStep>[] | React.ReactElement<typeof StepperStep>;
    removeBackground?: boolean;
}

const StepperRoot = ({ children, removeBackground }: StepperRootProps) => {
    return (
        <div className={`m-4 justify-between ${!removeBackground && "bg-violet-400"} p-4 px-10 sm:flex`}>
            {children}
        </div>
    );
};

export default StepperRoot;
