import IQuestion from "../../interfaces/question.interface";
import { EQuestionType } from "../../utils/consts.utils";
import FourInput from "../FourInput/FourInput";
import MultipleSelect from "../MultipleSelect/MultipleSelect";
import FiveOption from "../FiveOption/FiveOption";
import FourSelect from "../FourSelect/FourSelect";
import { useEffect, useRef, useState } from "react";
import { Flex } from "@radix-ui/themes";
import check from '../../assets/concluido.png'
import Stepper, { Step } from "../NewStepper/NewStteper";

interface RenderQuestionsProps {
    questions: IQuestion[];
    setQuestions: (questions: IQuestion[]) => void;
    handlerSaveAndContinue: () => void;
}

/*
 * Component to render all types of questions one by one
 */
const RenderQuestions = ({ questions, setQuestions, handlerSaveAndContinue }: RenderQuestionsProps) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [completed, setCompletedState] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const stepperRef = useRef<{
        handleNext: () => void;
        handleBack: () => void;
    }>(null);

    useEffect(() => {
        setCurrentQuestionIndex(0);
    }, [questions]);



    const currentQuestion = questions[currentQuestionIndex];
    if (!currentQuestion || currentQuestionIndex < 0 || currentQuestionIndex >= questions.length) {
        return <div>Carregando perguntas...</div>;
    }


    useEffect(() => {
        if (currentQuestion?.questionType === EQuestionType.FOUR_INPUT) {
            const values = currentQuestion.answer as string[];
            // Verifica se o array existe, tem 4 elementos e todos estão preenchidos
            const isDisabled = !(values && values.length === 4 && values.every(value => value.trim() !== ''));
            setDisableButton(isDisabled);
        }
    }, [currentQuestion, questions, currentQuestionIndex]);

    useEffect(() => {
        if (completed) {
            setCompletedState(false);
            handlerSaveAndContinue();
        }
    }, [completed, handlerSaveAndContinue]);

    if (!questions || questions.length === 0) {
        return <div>Sem perguntas para exibir.</div>;
    }

    const answerQuestionWithWithoutArray = (questionId: string, answer: string) => {
        setQuestions(
            questions.map((question) => {
                if (question._id === questionId) return { ...question, answer: answer };
                else return question;
            })
        );
    };

    const answerQuestionWithArray = (questionId: string, answer: string | string[]) => {
        if (Array.isArray(answer)) {

            setQuestions(
                questions.map((question) => {
                    if (question._id === questionId) return { ...question, answer: answer };

                    else return question;
                })
            );
            return;
        }
    };

    const renderChildQuestion = (childQuestion: IQuestion) => {
        if (!childQuestion.parentQuestion) return true;

        const parentQuestion = questions.find((q) => q._id === childQuestion.parentQuestion?.parentId);
        return parentQuestion?.answer?.includes(childQuestion.parentQuestion.isRequiredOnParentValue);
    };




    return (
        <>
            <Stepper ref={stepperRef}
                initialStep={1}
                backButtonText="Voltar"
                nextButtonText="Próximo"
                stepContainerClassName="hidden"
                onFinalStepCompleted={() => setCompletedState(true)}
                className="h-[450px] overflow-hidden"
                contentClassName="!h-[400px]"
                nextButtonProps={{ className: disableButton ? "disabled:bg-neutral-dark disabled:hover:cursor-not-allowed" : "" }}
                disableButton={disableButton}
            >
                {questions.map((question, index) => (
                    <Step key={question._id} >
                        <p className="text-[18px] w-60% max-md:text-[16px] max-md:w-full m-auto">{question.statement}</p>

                        {question.questionType === EQuestionType.FOUR_INPUT && (
                            <Flex direction={"column"} align={"center"} gap={"2"} className="mt-4">

                                <FourInput
                                    values={question.answer as string[]}
                                    onChange={(values) => {
                                        setDisableButton(true);
                                        answerQuestionWithArray(question._id, values);
                                        if (values.length !== 4 || values.some(value => value.trim() === '')) {
                                            setDisableButton(true);
                                        } else {
                                            setDisableButton(false);
                                        }
                                    }}
                                />
                            </Flex>
                        )}

                        {question.questionType === EQuestionType.MULTIPLE_SELECT && (
                            <Flex direction={"column"} align={"center"} gap={"2"} className="mt-4">
                                <MultipleSelect
                                    options={question.options?.map((option) => option.value) as string[]}
                                    placeholder="Caso se destaque, selecione uma ou várias opções"
                                    values={question.answer as string[]}
                                    onChange={(values) => {
                                        answerQuestionWithArray(question._id, values);
                                    }}
                                />
                            </Flex>
                        )}

                        {question.questionType === EQuestionType.ONE_INPUT &&
                            question.parentQuestion &&
                            renderChildQuestion(question) && (
                                <Flex direction={"column"} align={"center"} gap={"2"} className="mt-4">
                                    <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 w-[50%]">
                                        <input
                                            key={question._id}
                                            placeholder="Digite aqui"
                                            value={question.answer}
                                            onChange={(e) => answerQuestionWithWithoutArray(question._id, e.target.value)}
                                        />
                                    </div>
                                </Flex>
                            )}

                        {question.questionType === EQuestionType.FIVE_OPTION && (
                            <FiveOption
                                options={question.options?.map((option) => option.value) as string[]}
                                value={question.answer as string}
                                onSelect={(v) => {
                                    answerQuestionWithWithoutArray(question._id, v);
                                    setTimeout(() => {
                                        stepperRef.current?.handleNext();
                                    }, 1000);
                                }}
                            />
                        )}

                        {question.questionType === EQuestionType.FOUR_SELECT && (
                            <FourSelect
                                options={question.options?.map((option) => option.value) as string[]}
                                values={question.answer as string[]}
                                onChange={(v) => {
                                    answerQuestionWithArray(question._id, v);

                                }}
                            />
                        )}
                    </Step>
                ))}
                <Step>
                    <Flex direction={"column"} align={"center"} className="gap-2">
                        <h3 className="">Grupo Finalizado!</h3>
                        <img className="m-auto w-80 rounded-md" src={check} alt="check-img"></img>
                    </Flex>
                </Step>
            </Stepper>


        </>
    );
};

export default RenderQuestions;