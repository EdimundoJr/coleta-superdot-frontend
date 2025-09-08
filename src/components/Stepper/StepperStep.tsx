import { CheckIcon } from "@radix-ui/react-icons";
import { Box, Progress } from "@radix-ui/themes";

export type StepStateType = "DISABLED" | "HOLD" | "DONE";

interface StepperStepProps {
    stepNumber: string;
    stepTitle: string;
    stepDescription: string;
    stepState: StepStateType;
    whiteContrast?: boolean;
}

const StepperStep = ({ stepNumber, stepTitle, stepDescription, stepState, whiteContrast }: StepperStepProps) => {
    let backgroundClasses = "items-center gap-2";
    if (stepState === "HOLD") {
        backgroundClasses += " px-5 py-2 w-full ";
    }

    let circleClasses = "h-[60px] w-[60px] border-[1px] rounded-full m-auto flex items-center justify-center ";
    switch (stepState) {
        case "DONE":
            circleClasses += "hidden ";
            break;
        case "HOLD":
            circleClasses += "border-light-primary bg-primary ";
            break;
        case "DISABLED":
            circleClasses += "hidden ";
    }

    let textClasses = stepState !== "HOLD" ? "text-gray-300 hidden " : "";
    if (whiteContrast) {
        switch (stepState) {
            case "DONE":
                circleClasses += "hidden";
                break;
            case "HOLD":
                circleClasses += "text-white";
                break;
            case "DISABLED":
                circleClasses += "hidden";
        }
    }

    return (
        <Box className={backgroundClasses}>
            <Progress className="mb-3" size="3" value={(parseInt(stepNumber) * 34)} color="purple" />
            <div className={circleClasses}>{stepState === "DONE" && <CheckIcon className="text-gray-300" />} <h4 className={textClasses}>{stepNumber}</h4> </div>

            <div className="mt-3">
                <div className={`subtitle-2 ${textClasses}`}>{stepTitle}</div>
                <div className={`caption ${textClasses}`}>{stepDescription}</div>
            </div>
        </Box>
    );
};

export default StepperStep;
