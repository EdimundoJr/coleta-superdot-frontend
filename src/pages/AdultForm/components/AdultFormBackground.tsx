import { Stepper } from "../../../components/Stepper/Stepper";
import { StepStateType } from "../../../components/Stepper/StepperStep";

export enum AdultFormSteps {
    PERSONAL_INFO = 0,
    FAMILY_INFO = 1,
    READ_AND_ACCEPT_DOCS = 2,
    INDICATE_SECOND_SOURCE = 3,
    GENERAL_CHARACTERISTICS = 4,
    HIGH_ABILITIES = 5,
    CRIATIVITY = 6,
    TASK_COMMITMENT = 7,
    LEADERSHIP = 8,
    ARTISTIC_ACTIVITIES = 9,
    AUTOBIOGRAPHY = 10,
}

interface AdultFormBackgroundProps extends React.PropsWithChildren {
    showKeepFilling?: boolean;
    currentStep: AdultFormSteps;
}

const AdultFormBackground = ({ showKeepFilling, children, currentStep }: AdultFormBackgroundProps) => {
    const getStepState = (stepToCompare: AdultFormSteps): StepStateType => {
        if (currentStep > stepToCompare) return "DONE";
        else if (currentStep === stepToCompare) return "HOLD";
        else return "DISABLED";
    };

    return (
        <div className="h-full overflow-auto bg-slate-950 bg-opacity-50 bg-default-bg bg-cover bg-no-repeat bg-blend-multiply">
            <div className="flex justify-between p-4">
                <h1>GRUPAC</h1>
                {showKeepFilling && <a href="#">Continuar preenchimento já iniciado...</a>}
            </div>
            {currentStep < 4 ? (
                <Stepper.Root>
                    <Stepper.Step
                        stepState={getStepState(AdultFormSteps.PERSONAL_INFO)}
                        stepNumber="01"
                        stepTitle="Pessoais"
                        stepDescription="Informações pessoais"
                    ></Stepper.Step>
                    <Stepper.Step
                        stepState={getStepState(AdultFormSteps.FAMILY_INFO)}
                        stepNumber="02"
                        stepTitle="Família"
                        stepDescription="Informações familiares e de moradia"
                    ></Stepper.Step>
                    <Stepper.Step
                        stepState={getStepState(AdultFormSteps.READ_AND_ACCEPT_DOCS)}
                        stepNumber="03"
                        stepTitle="Termos"
                        stepDescription="Leia e aceite os termos"
                    ></Stepper.Step>
                    <Stepper.Step
                        stepState={getStepState(AdultFormSteps.INDICATE_SECOND_SOURCE)}
                        stepNumber="04"
                        stepTitle="Segundas fontes"
                        stepDescription="Indique segundas fontes"
                    ></Stepper.Step>
                </Stepper.Root>
            ) : (
                <div>
                    <Stepper.Root>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.GENERAL_CHARACTERISTICS)}
                            stepNumber="01"
                            stepTitle="GRUPO 1"
                            stepDescription="Características Gerais"
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.HIGH_ABILITIES)}
                            stepNumber="02"
                            stepTitle="GRUPO 2"
                            stepDescription="Habilidade Acima da Média"
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.CRIATIVITY)}
                            stepNumber="03"
                            stepTitle="GRUPO 3"
                            stepDescription="Criatividade"
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.TASK_COMMITMENT)}
                            stepNumber="04"
                            stepTitle="GRUPO 4"
                            stepDescription="Comprometimento da Tarefa"
                        ></Stepper.Step>
                    </Stepper.Root>
                    <Stepper.Root>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.LEADERSHIP)}
                            stepNumber="05"
                            stepTitle="GRUPO 5"
                            stepDescription="Liderança"
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.ARTISTIC_ACTIVITIES)}
                            stepNumber="06"
                            stepTitle="GRUPO 6"
                            stepDescription="Atividades Artísticas e Esportivas"
                        ></Stepper.Step>
                        <Stepper.Step
                            stepState={getStepState(AdultFormSteps.ARTISTIC_ACTIVITIES)}
                            stepNumber="07"
                            stepTitle="Autobigrafia"
                            stepDescription="Detalhes sobre você"
                        ></Stepper.Step>
                    </Stepper.Root>
                </div>
            )}
            {children}
        </div>
    );
};

export default AdultFormBackground;
