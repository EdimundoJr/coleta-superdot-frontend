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
    console.log(questions);
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
                            options={question.options as string[]}
                            placeholder="Caso se destaque, selecione uma ou várias opções"
                            values={question.answer as string[]}
                            onChange={(values) => answerQuestionWithArray(question._id, values)}
                        />
                    )}

                    {question.questionType === EQuestionType.ONE_INPUT && (
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
                            options={question.options as string[]}
                            value={question.answer as string}
                            onSelect={(v) => answerQuestionWithWithoutArray(question._id, v)}
                        />
                    )}

                    {question.questionType === EQuestionType.FOUR_SELECT && (
                        <FourSelect
                            options={question.options as string[]}
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
