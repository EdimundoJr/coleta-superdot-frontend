import { useEffect, useState } from "react";
import {
    getQuestionsByFormStep,
    patchSaveQuestionsByGroup,
    patchSaveSecondSourceQuestionsByGroup,
} from "../../../api/adultForm.api";
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
import { AxiosResponse } from "axios";
import { ISecondSource } from "../../../interfaces/secondSource.interface";

interface FormGroupsStepProps {
    formData: IParticipant | ISecondSource;
    setFormData: (data: IParticipant | ISecondSource) => void;
    sourceForm: EAdultFormSource;
    currentStep: EAdultFormSteps;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string }) => void;
    sampleId: string;
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
                case EQuestionType.FOUR_INPUT || EQuestionType.FOUR_SELECT:
                    if (question.answer.length !== 4) return false;
                    if ((question.answer as string[]).some((answer) => !answer.length)) return false;
                    break;
                case EQuestionType.MULTIPLE_SELECT:
                    if (!Array.isArray(question.answer)) return false;
            }

            return true;
        });
    };

    /**
     * The function `sendQuestionsToBackend` is an asynchronous function that sends questions to the
     * backend and returns a response.
     * @param {IQuestionsGroup} currentGroup - The currentGroup parameter is an object of type
     * IQuestionsGroup.
     * @returns The function `sendQuestionsToBackend` is returning a `AxiosResponse` object, which can
     * contain either a boolean value or an `IQuestionsGroup` object.
     */
    const sendQuestionsToBackend = async (currentGroup: IQuestionsGroup) => {
        let response: AxiosResponse<boolean | IQuestionsGroup> | any;
        if (sourceForm === EAdultFormSource.FIRST_SOURCE) {
            response = await patchSaveQuestionsByGroup(sampleId, currentGroup);
        } else {
            response = await patchSaveSecondSourceQuestionsByGroup({
                sampleId,
                groupQuestionsWithAnswers: currentGroup,
            });
        }

        return response;
    };

    /**
     * The function handles the response from a server request and displays a notification based on the
     * response data.
     * @param [response] - The `response` parameter is an optional parameter of type
     * `AxiosResponse<boolean | IQuestionsGroup>`. It represents the response received from a server
     * request made using Axios.
     * @returns The function `handleRequestResponse` returns nothing.
     */
    const handleSuccesfulRequestResponse = (response: AxiosResponse<boolean | IQuestionsGroup>) => {
        if (response.status !== 200) {
            setNotificationData({
                title: "Erro no servidor!",
                description: "Não foi possível efetuar a comunicação com o servidor. Tente novamente.",
            });
            return;
        }

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
            // Scroll screen to top
            document.getElementById("bg-div")?.scroll(0, 0);
        }
    };

    /**
     * The function saves questions in a form data cache to continue to next step, updating the current group
     * if it exists or adding it if it doesn't.
     * @param {IQuestionsGroup} currentGroup - The currentGroup parameter is an object of type
     * IQuestionsGroup.
     */
    const saveQuestionsInFormDataCacheToContinue = (currentGroup: IQuestionsGroup) => {
        let groupExistsInFormData = 0;

        const newAnswersByGroup = formData.adultForm?.answersByGroup?.map((group) => {
            if (group.sequence === currentGroup.sequence) {
                groupExistsInFormData++;
                return currentGroup; // Update the group with the current answers
            } else return group;
        });

        if (!groupExistsInFormData) {
            newAnswersByGroup?.push(currentGroup);
        }

        setFormData({
            ...formData,
            adultForm: {
                ...formData.adultForm,
                answersByGroup: newAnswersByGroup,
            },
        });
    };

    /**
     * The function `handlerSaveAndContinue` checks if all questions in the current group have answers,
     * sends the questions to the backend, handles the response, and saves the questions in a cache to
     * continue.
     * @returns If not all questions have answers, the function will return without executing the rest
     * of the code.
     */
    const handlerSaveAndContinue = async () => {
        if (!allQuestionsHaveAnswers(currentGroup.questions)) {
            return;
        }

        try {
            const response = await sendQuestionsToBackend(currentGroup);
            handleSuccesfulRequestResponse(response);
        } catch (e) {
            console.error(e);
            setNotificationData({
                title: "Erro no servidor!",
                description: "Não foi possível efetuar a comunicação com o servidor. Tente novamente.",
            });
            return;
        }

        saveQuestionsInFormDataCacheToContinue(currentGroup);
    };

    /**
     * The function `handlerSaveAndExit` sends questions to the backend, saves and exits if
     * successful, otherwise it displays an error notification.
     */
    const handlerSaveAndExit = async () => {
        try {
            await sendQuestionsToBackend(currentGroup);
            saveAndExit();
        } catch (e) {
            console.error(e);
            setNotificationData({
                title: "Erro no servidor!",
                description: "Não foi possível efetuar a comunicação com o servidor. Tente novamente.",
            });
            return;
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
                <h1>Formulário - Adulto {sourceForm === EAdultFormSource.SECOND_SOURCE && "(Segunda Fonte)"}</h1>
                <h3>{currentGroup?.groupName}</h3>
            </header>

            <RenderQuestions questions={currentGroup?.questions} setQuestions={handleOnChangeQuestions} />

            <div className="mt-5 flex w-full justify-center gap-x-4 px-3 ">
                <div className="flex justify-center gap-6">
                    <button type="button" onClick={previousStep} className="button-secondary mt-5 w-3/4 px-3 md:w-56">
                        VOLTAR
                    </button>
                    <button className="button-secondary mt-5 w-3/4 px-3 md:w-56" onClick={handlerSaveAndExit}>
                        SALVAR E SAIR
                    </button>
                    <button
                        className="button-secondary mt-5 w-3/4 px-3 disabled:bg-neutral-dark md:w-56"
                        onClick={handlerSaveAndContinue}
                    >
                        SALVAR E CONTINUAR
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormGroupsStep;
