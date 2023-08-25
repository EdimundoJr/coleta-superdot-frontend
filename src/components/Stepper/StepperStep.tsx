import { CheckIcon } from "@radix-ui/react-icons";

export type StepStateType = "DISABLED" | "HOLD" | "DONE";

interface StepperStepProps {
    stepNumber: string;
    stepTitle: string;
    stepDescription: string;
    stepState: StepStateType;
}

const StepperStep = ({ stepNumber, stepTitle, stepDescription, stepState }: StepperStepProps) => {
    function getVectorClasses() {
        switch (stepState) {
            case "DONE":
                return "bg-primary border-primary";
            case "HOLD":
                return "border-light-primary";
            case "DISABLED":
                return "border-gray-500";
        }
    }

    return (
        <div className="flex items-center gap-2">
            <div className={`h-[20px] w-[20px] border-[3px] ${getVectorClasses()} rounded-full`}>
                {stepState === "DONE" && <CheckIcon className="text-white" />}
            </div>
            <h4 className={`${stepState === "DISABLED" && "text-gray-300"}`}>{stepNumber}</h4>
            <div>
                <div className={`subtitle-2 ${stepState === "DISABLED" && "text-gray-300"}`}>{stepTitle}</div>
                <div className={`caption ${stepState === "DISABLED" && "text-gray-300"}`}>{stepDescription}</div>
            </div>
        </div>
    );
};

export default StepperStep;
