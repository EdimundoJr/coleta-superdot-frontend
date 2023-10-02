import { CheckIcon } from "@radix-ui/react-icons";

export type StepStateType = "DISABLED" | "HOLD" | "DONE";

interface StepperStepProps {
    stepNumber: string;
    stepTitle: string;
    stepDescription: string;
    stepState: StepStateType;
    whiteContrast?: boolean;
}

const StepperStep = ({ stepNumber, stepTitle, stepDescription, stepState, whiteContrast }: StepperStepProps) => {
    let backgroundClasses = "flex items-center gap-2";
    if (stepState === "HOLD") {
        backgroundClasses += " border-[1px] border-primary px-5 py-2";
    }

    let circleClasses = "h-[20px] w-[20px] border-[3px] rounded-full ";
    switch (stepState) {
        case "DONE":
            circleClasses += "bg-primary border-primary";
            break;
        case "HOLD":
            circleClasses += "border-light-primary bg-primary";
            break;
        case "DISABLED":
            circleClasses += "border-gray-500";
    }

    let textClasses = stepState !== "HOLD" ? "text-gray-300" : "";
    if (whiteContrast) {
        textClasses = "text-gray-700";
    }

    return (
        <div className={backgroundClasses}>
            <div className={circleClasses}>{stepState === "DONE" && <CheckIcon className="text-gray-300" />}</div>
            <h4 className={textClasses}>{stepNumber}</h4>
            <div>
                <div className={`subtitle-2 ${textClasses}`}>{stepTitle}</div>
                <div className={`caption ${textClasses}`}>{stepDescription}</div>
            </div>
        </div>
    );
};

export default StepperStep;
