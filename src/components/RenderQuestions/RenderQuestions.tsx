import IQuestion from "../../interfaces/question.interface";
import { EQuestionType } from "../../utils/consts.utils";
import FourInput from "../FourInput/FourInput";
import MultipleSelect from "../MultipleSelect/MultipleSelect";
import FiveOption from "../FiveOption/FiveOption";
import FourSelect from "../FourSelect/FourSelect";

interface RenderQuestionsProps {
    questions: IQuestion[];
    setQuestions: (questions: IQuestion[]) => void;
}

/*
 * Component to render all types of questions
 */
const RenderQuestions = ({ questions, setQuestions }: RenderQuestionsProps) => {
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
        const parentQuestion = questions.find((question) => question._id === childQuestion.parentQuestion?.parentId);
        if (parentQuestion?.answer?.includes(childQuestion.parentQuestion?.isRequiredOnParentValue || "")) {
            return true;
        }

        return false;
    };

    return (
        <>
            {questions?.map((question) => (
                <div key={question._id}>
                    <label>{question.statement}</label>

                    {question.questionType === EQuestionType.FOUR_INPUT && (
                        <FourInput
                            values={question.answer as string[]}
                            onChange={(values) => answerQuestionWithArray(question._id, values)}
                        />
                    )}

                    {question.questionType === EQuestionType.MULTIPLE_SELECT && (
                        <MultipleSelect
                            options={question.options?.map((option) => option.value) as string[]}
                            placeholder="Caso se destaque, selecione uma ou várias opções"
                            values={question.answer as string[]}
                            onChange={(values) => answerQuestionWithArray(question._id, values)}
                        />
                    )}

                    {/* This code block is rendering an input field if the question type is ONE_INPUT
                    and it has a parent question. It checks if the child question should be rendered
                    based on the answer of the parent question. */}
                    {question.questionType === EQuestionType.ONE_INPUT &&
                        question.parentQuestion &&
                        renderChildQuestion(question) && (
                            <div className="mx-auto mt-4 grid grid-cols-1 justify-center gap-5 sm:w-1/4">
                                <input
                                    key={question._id}
                                    placeholder="Digite aqui"
                                    value={question.answer}
                                    onChange={(e) => answerQuestionWithWithoutArray(question._id, e.target.value)}
                                />
                            </div>
                        )}

                    {question.questionType === EQuestionType.FIVE_OPTION && (
                        <FiveOption
                            options={question.options?.map((option) => option.value) as string[]}
                            value={question.answer as string}
                            onSelect={(v) => answerQuestionWithWithoutArray(question._id, v)}
                        />
                    )}

                    {question.questionType === EQuestionType.FOUR_SELECT && (
                        <FourSelect
                            options={question.options?.map((option) => option.value) as string[]}
                            values={question.answer as string[]}
                            onChange={(v) => answerQuestionWithArray(question._id, v)}
                        />
                    )}
                </div>
            ))}
        </>
    );
};

export default RenderQuestions;
