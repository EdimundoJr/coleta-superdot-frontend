import { useEffect, useState } from "react";
import AdultFormBackground, { AdultFormSteps } from "./components/AdultFormBackground";
import {
    AdultFormGroup,
    QuestionType,
    QuestionsAndAnswers,
    getQuestionsByGroup,
    submitQuestionsByGroup,
} from "../../api/adultForm.api";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../components/Notify/Notify";

interface CurrentGroup {
    groupStep: AdultFormSteps;
    groupDescription: AdultFormGroup;
}

const AnsweringAdultForm = () => {
    const [questionAndAnswers, setQuestionAndAnswers] = useState<QuestionsAndAnswers[]>();
    const [currentGroup, setCurrentGroup] = useState<CurrentGroup>({
        groupStep: AdultFormSteps.GENERAL_CHARACTERISTICS,
        groupDescription: AdultFormGroup.GENERAL_CHARACTERISTICS,
    });

    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");

    const navigate = useNavigate();
    const { participantId } = useParams();

    useEffect(() => {
        const getQuestions = async () => {
            const response = await getQuestionsByGroup(currentGroup.groupDescription);
            if (response.status === 200) {
                setQuestionAndAnswers(response.data);
            }
        };

        getQuestions();
    }, [currentGroup]);

    const handleSubmitQuestions = async () => {
        const allQuestionsHasAnswer = questionAndAnswers?.every((element, idx, arr) => {
            // All questions has the answer defined?
            if (!element.answer) {
                setNotificationTitle("Respostas em branco!");
                setNotificationDescription("Por favor, responda todas as perguntas.");
                return false;
            }

            // The question type is FIVE_OPTIONS and the answer is defined?
            if (element.type === QuestionType.FIVE_OPTIONS) return true;

            // The question type is MULTIPLE_OPTIONS or FOUR_INPUTS and the answer isn't an array?
            if (!Array.isArray(element.answer)) return false;

            // The array has less than 4 four elements?
            if (element.answer.length < 4) return false;

            // All values are defined?
            if (element.answer.includes("")) {
                setNotificationTitle("Respostas em branco!");
                setNotificationDescription("Por favor, responda todas as perguntas.");
                return false;
            }

            // Testing the otherAnswerValue array in case the answer is 'Outro'
            return element.answer.every((e, idx) => {
                if (e !== "Outro") return true;

                // Is an array?
                if (!Array.isArray(element.otherAnswerValue)) return false;

                // The array has less than the correpondent answer index?
                if (element.otherAnswerValue.length < idx) return false;

                // The user doesn't write a value?
                if (element.otherAnswerValue[idx] === "") return false;

                return true;
            });
        });

        if (!allQuestionsHasAnswer || !questionAndAnswers) return;

        try {
            const response = await submitQuestionsByGroup(questionAndAnswers, currentGroup.groupDescription);
            if (response.status === 200) {
                if (typeof response.data === "boolean") {
                    navigate(`../${participantId}/autobiografia`);
                } else {
                    setQuestionAndAnswers(response.data);
                }
            }
        } catch (e) {
            console.error(e);
        }
    };

    const answerQuestionWithFiveOptions = (questionId: string, answer: string) => {
        setQuestionAndAnswers(
            questionAndAnswers?.map((question) => {
                if (question._id === questionId) return { ...question, answer: answer };
                else return question;
            })
        );
    };

    const answerQuestionWithFourInputs = (questionId: string, answer: string, sequence: number) => {
        setQuestionAndAnswers(
            questionAndAnswers?.map((question) => {
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
            })
        );
    };

    const answerQuestionWithMultiplesOptions = (
        questionId: string,
        answer: string,
        sequence: number,
        otherAnswerValue?: string
    ) => {
        setQuestionAndAnswers(
            questionAndAnswers?.map((question) => {
                if (question._id === questionId) {
                    let newOtherValuesArray: string[] | undefined;
                    if (otherAnswerValue) {
                        if (Array.isArray(question.otherAnswerValue)) {
                            newOtherValuesArray = question.otherAnswerValue as string[];
                        } else {
                            newOtherValuesArray = ["", "", "", ""];
                        }
                        newOtherValuesArray[sequence] = otherAnswerValue;
                    }

                    let newArray: string[];
                    if (Array.isArray(question.answer)) {
                        newArray = question.answer as string[];
                    } else {
                        newArray = ["", "", "", ""];
                    }

                    newArray[sequence] = answer;
                    return { ...question, answer: newArray, otherAnswerValue: newOtherValuesArray };
                } else return question;
            })
        );
    };

    const getCurrentInputValue = (question: QuestionsAndAnswers, inputSequence: number) => {
        // 'question.answer' is a array with four values. To get the current input value, I need
        // to access the index correspondent to input sequence: the value from the first input
        // will be the first element in the array and so on.
        if (Array.isArray(question.answer) && question.answer.length >= inputSequence)
            return question.answer[inputSequence];
        else return "";
    };

    return (
        <Notify
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
        >
            <AdultFormBackground currentStep={currentGroup.groupStep}>
                <div className="grid gap-y-10">
                    <header>
                        <h1>Formulário - Adulto</h1>
                        <h3>{currentGroup.groupDescription}</h3>
                    </header>
                    {questionAndAnswers?.map((question) => (
                        <div key={question._id}>
                            <label>{question.statement}</label>

                            {/* THE BASE CASE FOR ALL QUESTIONS */}
                            {question.type === QuestionType.FIVE_OPTIONS && (
                                <div className="mt-4 justify-center gap-4 sm:flex">
                                    {question.options?.map((option) => (
                                        <button
                                            key={option}
                                            onClick={() => answerQuestionWithFiveOptions(question._id, option)}
                                            className={`${
                                                option === question.answer ? "button-secondary" : "button-primary"
                                            }`}
                                        >
                                            {option}
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* FIRST EXCEPTION (FREE INPUT) */}
                            {question.type === QuestionType.FOUR_INPUTS && (
                                <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/4">
                                    {/* CREATE AN ITERATOR FROM 0 TO 3 */}
                                    {[...Array(4).keys()].map((sequence) => (
                                        <input
                                            key={sequence}
                                            placeholder="Digite aqui"
                                            value={getCurrentInputValue(question, sequence)}
                                            onChange={(e) =>
                                                answerQuestionWithFourInputs(question._id, e.target.value, sequence)
                                            }
                                        />
                                    ))}
                                </div>
                            )}

                            {/* SECOND EXCEPTION (MULTIPLE OPTIONS) */}
                            {question.type === QuestionType.MULTIPLE_OPTIONS && (
                                <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/3">
                                    {/* CREATE AN ITERATOR FROM 0 TO 3 */}
                                    {[...Array(4).keys()].map((sequence) => (
                                        <div className="flex gap-5" key={question._id + sequence}>
                                            <select
                                                placeholder="Digite aqui"
                                                value={getCurrentInputValue(question, sequence)}
                                                onChange={(e) =>
                                                    answerQuestionWithMultiplesOptions(
                                                        question._id,
                                                        e.target.value,
                                                        sequence
                                                    )
                                                }
                                            >
                                                <option>Selecione uma opção</option>
                                                {question.options?.map((option) => (
                                                    <option>{option}</option>
                                                ))}
                                            </select>
                                            {getCurrentInputValue(question, sequence) === "Outro" && (
                                                <input
                                                    placeholder="Digite aqui"
                                                    value={
                                                        question.otherAnswerValue && question.otherAnswerValue[sequence]
                                                    }
                                                    onChange={(e) =>
                                                        answerQuestionWithMultiplesOptions(
                                                            question._id,
                                                            "Outro",
                                                            sequence,
                                                            e.target.value
                                                        )
                                                    }
                                                ></input>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                    <button onClick={handleSubmitQuestions} className="button-secondary mx-auto w-1/3">
                        Continuar
                    </button>
                </div>
            </AdultFormBackground>
        </Notify>
    );
};

export default AnsweringAdultForm;
