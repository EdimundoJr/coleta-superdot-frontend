import { useEffect, useState } from "react";
import { getQuestionsByFormStep, patchSaveQuestionsByGroup } from "../../../api/adultForm.api";
import IQuestionsGroup from "../../../interfaces/questionsGroup.interface";
import {
    EAdultFormSource,
    EAdultFormSteps,
    EQuestionType,
    getAdultGroupSequenceByFormStep,
} from "../../../utils/consts.utils";
import IQuestion from "../../../interfaces/question.interface";
import RenderQuestions from "../../../components/RenderQuestions/RenderQuestions";
import { IParticipant } from "../../../interfaces/participant.interface";

interface FormGroupsStepProps {
    formData: IParticipant;
    setFormData: (data: IParticipant) => void;
    sourceForm: EAdultFormSource;
    currentStep: EAdultFormSteps;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string }) => void;
    sampleId: string;
    participantId?: string;
    saveAndExit: () => void;
    previousStep: () => void;
}

/*
 * This step will allow the participant answer all questions from the Adult Form Groups (Características Gerais,
 * Criatividade, Liderança...).
 *
 * @see EAdultFormSteps, IQuestionsGroup and EQuestionType
 */
const FormGroupsStep = ({
    formData,
    setFormData,
    sourceForm,
    currentStep,
    nextStep,
    setNotificationData,
    sampleId,
    participantId,
    saveAndExit,
    previousStep,
}: FormGroupsStepProps) => {
    const [currentGroup, setCurrentGroup] = useState<IQuestionsGroup>({} as IQuestionsGroup);

    useEffect(() => {
        const getQuestions = async () => {
            const currentGroupSequence = getAdultGroupSequenceByFormStep(currentStep);
            const groupQuestionAlreadyFillout = formData.adultForm?.answersByGroup?.find(
                (group) => group.sequence === currentGroupSequence
            );

            if (groupQuestionAlreadyFillout) {
                setCurrentGroup(groupQuestionAlreadyFillout);
                return;
            }

            const response = await getQuestionsByFormStep(currentStep, sourceForm);
            if (response.status === 200) {
                setCurrentGroup(response.data);
            }
        };

        getQuestions();
    }, [sampleId, currentStep]);

    /**
     * The function checks if all questions have answers based on their question type and requirements.
     * @param {IQuestion[]} questions - An array of objects representing questions.
     * @returns The function `allQuestionsHaveAnswers` returns a boolean value.
     */
    const allQuestionsHaveAnswers = (questions: IQuestion[]) => {
        return questions.every((question) => {
            /* This code block is checking if a question has a parent question and if the parent
            question's answer matches the required value specified in the child question's
            `parentQuestion` property. */
            if (question.parentQuestion) {
                const parentQuestion = questions.find((q) => q._id === question.parentQuestion?.parentId);
                if (
                    parentQuestion?.answer?.includes(question.parentQuestion.isRequiredOnParentValue || "") &&
                    !question.answer
                ) {
                    return false;
                }
            }

            if (!question.required) return true;
            if (!question.answer) return false;

            switch (question.questionType) {
                case EQuestionType.FIVE_OPTION:
                    if (typeof question.answer !== "string") return false;
                    break;
                case EQuestionType.FOUR_INPUT:
                    if (question.answer.length !== 4) return false;
                    break;
                case EQuestionType.MULTIPLE_SELECT:
                    if (!Array.isArray(question.answer)) return false;
            }

            return true;
        });
    };

    const handleSaveAnswersAndExit = async () => {
        try {
            const response = await patchSaveQuestionsByGroup(sampleId, currentGroup);
            if (response.status === 200) {
                saveAndExit();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleSubmitQuestions = async () => {
        if (!allQuestionsHaveAnswers(currentGroup.questions)) return;
        console.log(currentGroup.questions);

        try {
            const response = await patchSaveQuestionsByGroup(sampleId, currentGroup);
            if (response.status === 200) {
                if (typeof response.data === "boolean") {
                    setNotificationData({
                        title: "Questionário finalizado!",
                        description: "Todos os grupos foram respondidos, parabéns!",
                    });
                    nextStep();
                } else {
                    setNotificationData({
                        title: "Grupo finalizado!",
                        description: "Parabéns, você finalizou um grupo de perguntas. Continue!",
                    });
                    setCurrentGroup(response.data);
                    nextStep();
                    document.getElementById("bg-div")?.scroll(0, 0);
                }
            }

            let found = 0;

            const newAnswersByGroup = formData.adultForm?.answersByGroup?.map((group) => {
                if (group.sequence === currentGroup.sequence) {
                    found++;
                    return currentGroup;
                } else return group;
            });

            if (!found) {
                newAnswersByGroup?.push(currentGroup);
            }

            setFormData({
                ...formData,
                adultForm: {
                    ...formData.adultForm,
                    answersByGroup: newAnswersByGroup,
                },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const handleOnChangeQuestions = (questions: IQuestion[]) => {
        setCurrentGroup({
            ...currentGroup,
            questions,
        });
    };

    return (
        <div className="grid gap-y-10">
            <header>
                <h1>Formulário - Adulto</h1>
                <h3>{currentGroup?.groupName}</h3>
            </header>

            <RenderQuestions questions={currentGroup?.questions} setQuestions={handleOnChangeQuestions} />

            <div className="mt-5 flex w-full justify-center gap-x-4 px-3 ">
                <div className="flex justify-center gap-6">
                    <button type="button" onClick={previousStep} className="button-secondary mt-5 w-3/4 px-3 md:w-56">
                        VOLTAR
                    </button>
                    <button className="button-secondary mt-5 w-3/4 px-3 md:w-56" onClick={handleSaveAnswersAndExit}>
                        SALVAR E SAIR
                    </button>
                    <button
                        className="button-secondary mt-5 w-3/4 px-3 disabled:bg-neutral-dark md:w-56"
                        onClick={handleSubmitQuestions}
                    >
                        SALVAR E CONTINUAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormGroupsStep;
