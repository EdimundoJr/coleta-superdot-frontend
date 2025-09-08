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
import { Button } from "../../../components/Button/Button";
import { Badge, Box, Card, Flex, Inset, Strong } from "@radix-ui/themes";
import Modal from "../../../components/Modal/Modal";
import Criatividade from "../../../assets/Criatividade.png"
import Lideranca from "../../../assets/lideranca.png"
import Comprometimento from "../../../assets/comprometimento.png"
import Gerais from "../../../assets/gerais.png"
import Habilidades from "../../../assets/Habilidades.png"
import Atividade from "../../../assets/Atividades.png"


interface FormGroupsStepProps {
    formData: IParticipant | ISecondSource;
    setFormData: (data: IParticipant | ISecondSource) => void;
    sourceForm: EAdultFormSource;
    currentStep: EAdultFormSteps;
    setNotificationData: (data: { title: string; description: string; type: string }) => void;
    sampleId: string;
    completed?: boolean;
    onCompletionChange?: (isCompleted: boolean) => void;

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
    setNotificationData,
    sampleId,
    completed,
    onCompletionChange,


}: FormGroupsStepProps) => {
    const [currentGroup, setCurrentGroup] = useState<IQuestionsGroup>({} as IQuestionsGroup);
    const [openModal, setOpenModal] = useState(false);
    const [completQuestions, setCompletQuestions] = useState(false);

    const handleShowQuestions = () => {
        setOpenModal(true)
        return;
    }

    useEffect(() => {
        const validateInitialCompletion = () => {
            if (currentGroup.questions) {
                const isCompleted = allQuestionsHaveAnswers(currentGroup.questions);
                setCompletQuestions(isCompleted);
                if (onCompletionChange) {
                    onCompletionChange(isCompleted);
                }
            }
        };

        validateInitialCompletion();
    }, [currentGroup]);

    useEffect(() => {
        if (onCompletionChange) {
            onCompletionChange(completQuestions);
        }
    }, [completQuestions, onCompletionChange]);

    /**
        * Atualiza o estado de completude sempre que as perguntas forem alteradas.
    */
    useEffect(() => {
        if (allQuestionsHaveAnswers(currentGroup.questions)) {
            setCompletQuestions(true);
        } else {
            setCompletQuestions(false);
        }
    }, [currentGroup.questions]); // Monitora mudanças nas perguntas

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
        if (!Array.isArray(questions)) return false;
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
                type: "erro"
            });
            return;
        }

        if (typeof response.data === "boolean") {
            setNotificationData({
                title: "Questionário finalizado!",
                description: "Todos os grupos foram respondidos, parabéns!",
                type: "success"
            });
            setOpenModal(false);
        } else {
            setNotificationData({
                title: "Grupo finalizado!",
                description: "Parabéns, você finalizou um grupo de perguntas. Continue!",
                type: "success"
            });
            setOpenModal(false);

            document.getElementById("#bg-div")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
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
                return currentGroup;
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
            setNotificationData({
                title: "Perguntas em aberto.",
                description: "Para proseguir, respoda todas as perguntas",
                type: "erro"
            })
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
                type: "erro"
            });
            return;
        }
        document.getElementById("bg-div")?.scrollTo({ top: 0, left: 0, behavior: "smooth" });
        saveQuestionsInFormDataCacheToContinue(currentGroup);

    };


    const handleOnChangeQuestions = (questions: IQuestion[]) => {
        setCurrentGroup({
            ...currentGroup,
            questions,
        });
    };


    return (
        <>

            <Modal
                open={openModal}
                setOpen={setOpenModal}
                className="!p-4"
                title={currentGroup.groupName}
                accessibleDescription={""} children={
                    <RenderQuestions
                        key={currentGroup.groupName}
                        questions={currentGroup.questions}
                        setQuestions={handleOnChangeQuestions}
                        handlerSaveAndContinue={handlerSaveAndContinue}
                    />
                } />

            <Box maxWidth="" >
                <Card size="1" className={`card-container-variante-border group group/item transition-all pt-4  px-5`}>
                    <Inset clip="padding-box" side="top" pb="current">
                        <img
                            src={currentGroup?.groupName === "Características Gerais" ? Gerais : currentGroup?.groupName === "Criatividade" ? Criatividade : currentGroup?.groupName === "Liderança" ? Lideranca : currentGroup?.groupName === "Comprometimento da Tarefa" ? Comprometimento : currentGroup?.groupName === "Habilidade Acima da Média" ? Habilidades : Atividade}
                            alt="Bold typography"
                            className={`${completQuestions ? "hidden" : "hover:scale-110 transition-all duration-200"}`}
                            style={{
                                display: "block",
                                objectFit: "cover",
                                width: "100%",
                                height: 240,
                                backgroundColor: "var(--gray-5)",
                            }}
                        />
                    </Inset>
                    <Flex direction="column" gap="1" className="">
                        <p className="">
                            <Strong className="!font-roboto">{currentGroup?.groupName}</Strong>
                        </p>
                        {completQuestions ?
                            <Badge size="1" color="green" variant="solid" className={`${completed ? "" : "invisible"} w-full justify-center h-[20px] absolute top-0 left-0 right-0 `}>
                                Concluído!
                            </Badge> : <></>}

                        <Button color={`${completed ? "yellow" : "primary"}`} title={`${completed ? "À Revisar" : "Responder"}`} size={"Extra Small"} onClick={() => handleShowQuestions()} />
                    </Flex>
                </Card>
            </Box>
        </>
    );
};

export default FormGroupsStep;
