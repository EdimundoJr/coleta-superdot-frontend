import { useEffect, useState } from "react";
import { getAllGroupQuestionsByFormStep, patchQuestionsAnswersByGroup } from "../../../api/adultForm.api";
import IQuestionsGroup from "../../../interfaces/questionsGroup.interface";
import { EAdultFormSource, EAdultFormSteps, EQuestionType } from "../../../utils/consts.utils";
import IQuestion from "../../../interfaces/question.interface";
import Select from "react-select";

interface AnsweringAdultFormStepProps {
    sourceForm: EAdultFormSource;
    currentStep: EAdultFormSteps;
    nextStep: () => void;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
    sampleId: string;
    participantId?: string;
}

const AnsweringAdultFormStep = ({
    sourceForm,
    currentStep,
    nextStep,
    setNotificationTitle,
    setNotificationDescription,
    sampleId,
    participantId,
}: AnsweringAdultFormStepProps) => {
    const [currentGroup, setCurrentGroup] = useState<IQuestionsGroup>();

    useEffect(() => {
        const getQuestions = async () => {
            const response = await getAllGroupQuestionsByFormStep(currentStep, sourceForm);
            if (response.status === 200) {
                setCurrentGroup(response.data);
            }
        };

        getQuestions();
    }, [sampleId, currentStep]);

    const questionIsOtherInputAndTheUserNotSelectOtherOptionInPreviousQuestion = (
        questionType: EQuestionType,
        questionIdx: number
    ) => {
        return (
            questionType === EQuestionType.OTHER_INPUT &&
            !currentGroup?.questions[questionIdx - 1].answer?.includes("Outro")
        );
    };

    const handleSubmitQuestions = async () => {
        console.log(currentGroup?.questions);
        const allQuestionsHasAnswer = currentGroup?.questions.every((question, idx) => {
            if (question.notRequired) return true;

            console.log(`questionId: ${idx}`);
            // Then answer field is not defined, then NOT OK.
            if (!question.answer) {
                if (questionIsOtherInputAndTheUserNotSelectOtherOptionInPreviousQuestion(question.questionType, idx)) {
                    return true;
                }
                setNotificationTitle("Respostas em branco!");
                setNotificationDescription("Por favor, responda todas as perguntas.");
                return false;
            }

            console.log("All fields defined!");

            // The question type is FIVE_OPTIONS or OTHER_INPUT and the answer field is defined, then OK.
            if (
                question.questionType === EQuestionType.LIMITED_OPTIONS ||
                question.questionType === EQuestionType.OTHER_INPUT
            )
                return true;

            console.log("Limited Option passed!");

            // The question type is MULTIPLE_OPTIONS or FOUR_INPUTS and the answer isn't an array, then NOT OK.
            if (!Array.isArray(question.answer)) return false;

            console.log("IsArray passed!");

            if (question.questionType === EQuestionType.MULTIPLE_SELECT) return true;

            console.log("MULTIPLE_SELECT passed!");

            // The array has less than 4 four elements, then NOT OK.
            if (question.answer.length < 4) return false;

            console.log("Array length passed!");

            // The array has a empty value, then NOT OK.
            if (question.answer.includes("") || question.answer.includes("INVALID")) {
                setNotificationTitle("Respostas em branco!");
                setNotificationDescription("Por favor, responda todas as perguntas.");
                return false;
            }

            console.log("Empty array passed!");

            return true;
        });

        if (!allQuestionsHasAnswer || !currentGroup) return;

        // Removing options
        currentGroup.questions.forEach((question) => delete question["options"]);

        try {
            const response = await patchQuestionsAnswersByGroup(sampleId, currentGroup, participantId);
            if (response.status === 200) {
                if (typeof response.data === "boolean") {
                    setNotificationTitle("Questionário finalizado!");
                    setNotificationDescription("Todos os grupos foram respondidos, parabéns!");
                    nextStep();
                } else {
                    setNotificationTitle("Grupo finalizado!");
                    setNotificationDescription("Parabéns, você finalizou um grupo de perguntas. Continue!");
                    setCurrentGroup(response.data);
                    nextStep();
                    document.getElementById("bg-div")?.scroll(0, 0);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const answerQuestionWithWithoutArray = (questionId: string, answer: string) => {
        if (!currentGroup) {
            return;
        }

        setCurrentGroup({
            ...currentGroup,
            questions: currentGroup.questions.map((question) => {
                if (question._id === questionId) return { ...question, answer: answer };
                else return question;
            }),
        });
    };

    const answerQuestionWithArray = (questionId: string, answer: string | string[], sequence?: number) => {
        if (!currentGroup) {
            return;
        }

        if (Array.isArray(answer)) {
            console.log(answer);
            setCurrentGroup({
                ...currentGroup,
                questions: currentGroup.questions.map((question) => {
                    if (question._id === questionId) return { ...question, answer: answer };
                    else return question;
                }),
            });
            return;
        }

        if (sequence === undefined) return;

        setCurrentGroup({
            ...currentGroup,
            questions: currentGroup.questions.map((question) => {
                if (question._id === questionId) {
                    let newArray: string[];
                    if (Array.isArray(question.answer)) {
                        newArray = question.answer as string[];
                    } else {
                        newArray = ["", "", "", ""];
                    }

                    newArray[sequence] = answer;
                    return { ...question, answer: newArray };
                } else return question;
            }),
        });
    };

    const getCurrentInputValue = (question: IQuestion, inputSequence: number) => {
        // 'question.answer' is a array with four values. To get the current input value, I need
        // to access the index correspondent to input sequence: the value from the first input
        // will be the first element in the array and so on.
        if (Array.isArray(question.answer) && question.answer.length >= inputSequence)
            return question.answer[inputSequence];
        else return "";
    };

    return (
        <div className="grid gap-y-10">
            <header>
                <h1>Formulário - Adulto</h1>
                <h3>{currentGroup?.groupName}</h3>
            </header>
            {currentGroup?.questions?.map((question, idx) => {
                if (
                    // Exception case: Input to write OTHER option (see form question 9.2)
                    question.questionType === EQuestionType.OTHER_INPUT
                ) {
                    // Show input only if the user select "Outro" in the previous question
                    if (currentGroup.questions[idx - 1].answer?.includes("Outro")) {
                        return (
                            <div key={question._id}>
                                <label>{question.statement}</label>
                                <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/4">
                                    <input
                                        key={question._id}
                                        placeholder="Digite aqui"
                                        value={question.answer}
                                        onChange={(e) => answerQuestionWithWithoutArray(question._id, e.target.value)}
                                    />
                                </div>
                            </div>
                        );
                    } else return null;
                }

                return (
                    <div key={question._id}>
                        <label>{question.statement}</label>

                        {/* THE BASE CASE FOR ALL QUESTIONS */}
                        {question.questionType === EQuestionType.LIMITED_OPTIONS && (
                            <div className="mt-4 justify-center gap-4 sm:flex">
                                {question.options?.map((option) => (
                                    <button
                                        key={option}
                                        onClick={() => answerQuestionWithWithoutArray(question._id, option)}
                                        className={`${
                                            option === question.answer ? "button-secondary" : "button-primary"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* FIRST EXCEPTION (FOUR INPUT) */}
                        {question.questionType === EQuestionType.FOUR_INPUTS && (
                            <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/4">
                                {/* CREATE AN ITERATOR FROM 0 TO 3 */}
                                {[...Array(4).keys()].map((sequence) => (
                                    <input
                                        key={sequence}
                                        placeholder="Digite aqui"
                                        value={getCurrentInputValue(question, sequence)}
                                        onChange={(e) =>
                                            answerQuestionWithArray(question._id, e.target.value, sequence)
                                        }
                                    />
                                ))}
                            </div>
                        )}

                        {/* SECOND EXCEPTION (MULTIPLE OPTIONS) */}
                        {question.questionType === EQuestionType.MULTIPLE_OPTIONS && (
                            <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/3">
                                {/* CREATE AN ITERATOR FROM 0 TO 3 */}
                                {[...Array(4).keys()].map((sequence) => (
                                    <div className="flex gap-5" key={question._id + sequence}>
                                        <select
                                            placeholder="Digite aqui"
                                            value={getCurrentInputValue(question, sequence)}
                                            onChange={(e) => {
                                                answerQuestionWithArray(question._id, e.target.value, sequence);
                                            }}
                                        >
                                            <option value="INVALID">Selecione uma opção</option>
                                            {question.options?.map((option) => (
                                                <option>{option}</option>
                                            ))}
                                        </select>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* FORTY EXCEPTION (SELECT MULTIPLE) */}
                        {question.questionType === EQuestionType.MULTIPLE_SELECT && (
                            <Select
                                className="mt-3 text-black"
                                isMulti
                                options={question.options?.map((option) => {
                                    return { value: option, label: option };
                                })}
                                onChange={(options) =>
                                    answerQuestionWithArray(
                                        question._id,
                                        [...options].map((option) => option.value)
                                    )
                                }
                                placeholder="Caso se destaque, selecione uma ou várias opções"
                            />

                            // <select
                            //     className="mx-auto mt-4 block h-44 w-fit"
                            //     multiple
                            //     placeholder="Digite aqui"
                            //     value={question.answer}
                            //     onChange={(e) =>
                            //         answerQuestionWithArray(
                            //             question._id,
                            //             [...e.target.selectedOptions].map((option) => option.value)
                            //         )
                            //     }
                            // >
                            //     {question.options?.map((option) => (
                            //         <option>{option}</option>
                            //     ))}
                            // </select>
                        )}
                    </div>
                );
            })}
            <button onClick={handleSubmitQuestions} className="button-secondary mx-auto w-1/3">
                Continuar
            </button>
        </div>
    );
};

export default AnsweringAdultFormStep;
