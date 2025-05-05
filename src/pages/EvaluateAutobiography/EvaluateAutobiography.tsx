import React, { useState, useRef, useEffect } from 'react';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { useLocation } from "react-router-dom";
import { Flex, Text, HoverCard, Separator, Tooltip, Popover, TextArea, Box } from '@radix-ui/themes';
import Notify from '../../components/Notify/Notify';
import { Button } from "../../components/Button/Button"
import { Alert } from '../../components/Alert/Alert';
import { getParticipantDataBio, patchSaveEvalueAutobiography } from '../../api/participant.api';
import { ISample } from '../../interfaces/sample.interface';
import IBio from '../../interfaces/evaluateAutobiography.interface';
import BackToTop from '../../components/BackToTop/BackToTop';

interface MarkedText {
    id: number;
    text: string;
    comment: string;
    mark: string;
    start: number;
    end: number;
    background: string;
}

interface LocationState {
    sample: ISample;
    participant: IParticipant;
}

const EvaluateAutobiography: React.FC = () => {
    const [markedTextsBack, setMarkedTextsBack] = useState<MarkedText[]>([]);
    const [markedTexts, setMarkedTexts] = useState<MarkedText[]>([]);
    const [selectedText, setSelectedText] = useState<string | null>(null);
    const [selectionRange, setSelectionRange] = useState<{ start: number, end: number } | null>(null);
    const commentInputRef = useRef<HTMLTextAreaElement>(null);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const [limit, setLimit] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openMarks, setOpenMarks] = useState<boolean>(false);
    const [error, setError] = useState();

    const location = useLocation();
    const { participant, sample } = location.state as LocationState;
    const [isDesktop, setIsDesktop] = useState(false);




    useEffect(() => {
        const checkScreen = () => {
            setIsDesktop(window.innerWidth >= 1020);
        };

        checkScreen();
        window.addEventListener("resize", checkScreen);
        return () => window.removeEventListener("resize", checkScreen);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getParticipantDataBio({
                    sampleId: sample._id,
                    participantId: participant._id
                });

                const transformedData = data.evaluateAutobiography.map((item: IBio) => ({
                    id: item.id ?? 0,
                    text: item.text ?? "",
                    comment: item.comment ?? "",
                    mark: item.mark ?? "",
                    start: item.start ?? 0,
                    end: item.end ?? 0,
                    background: item.background ?? "",
                }));

                if (Array.isArray(transformedData)) {
                    setMarkedTextsBack(transformedData);
                } else {
                    console.error("Expected evaluateAutobiography to be an array", transformedData);
                }

            } catch (error: any) {
                setError(error);
            }
        };

        if (markedTexts.length === 0 && sample?._id && participant?._id) {
            fetchData();
        }
    }, []);



    const handleOpenBox = () => {
        setOpen(!open)
    }

    const handleSaveEvalueAutobiography = async (submitForm?: boolean) => {
        if (submitForm && markedTexts.length === 0) {
            setNotificationData({
                title: "Preencha pelo menos um campo!",
                description: "Para salvar, é obrigatório adicionar um comentário.",
                type: "aviso"
            });

            return;
        }

        try {
            const responsePromises = markedTexts.map(markedText =>
                patchSaveEvalueAutobiography({
                    sampleId: sample._id,
                    participantId: participant._id,
                    idEvalueAutobiography: markedText.id,
                    textEvalueAutobiography: markedText.text,
                    commentEvalueAutobiography: markedText.comment,
                    markEvalueAutobiography: markedText.mark,
                    startEvalueAutobiography: markedText.start,
                    endEvalueAutobiography: markedText.end,
                    backgroundEvalueAutobiography: markedText.background,
                    submitForm: submitForm || false,
                })
            );

            const responses = await Promise.all(responsePromises);
            const success = responses.every(response => response === true);

            if (success) {
                setNotificationData({
                    title: "Comentários salvos com sucesso!",
                    description: "Os comentários foram salvos com sucesso!",
                    type: "success"
                });
                window.location.reload()
            } else {
                setNotificationData({
                    title: "Erro ao salvar os comentários!",
                    description: "Houve um erro ao salvar os comentários!",
                    type: "erro"
                });
            }
        } catch (error) {
            setNotificationData({
                title: "Erro ao salvar os comentários!",
                description: "Houve um erro ao salvar os comentários!",
                type: "erro"
            });
            console.error(error);
        }
    };


    const handleTextSelection = () => {
        const textElement = document.getElementById("autobiography");
        if (textElement) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const { startContainer, endContainer } = range;

                if (textElement.contains(startContainer) && textElement.contains(endContainer)) {
                    const selectedText = range.toString();

                    if (selectedText.length < 250) {
                        const preSelectionRange = range.cloneRange();
                        preSelectionRange.selectNodeContents(textElement);
                        preSelectionRange.setEnd(range.startContainer, range.startOffset);
                        const start = preSelectionRange.toString().length;
                        const end = start + selectedText.length;

                        setSelectedText(selectedText);
                        setSelectionRange({ start, end });
                        selection.removeAllRanges();
                        setLimit(false);
                    } else {
                        setNotificationData({
                            title: "Seleção fora do limite permitido!",
                            description: "Por favor, selecione o texto dentro da autobiografia.",
                            type: "aviso"
                        });
                    }
                } else {
                    setNotificationData({
                        title: "Seleção fora do limite permitido!",
                        description: "Por favor, selecione o texto dentro da autobiografia.",
                        type: "aviso"
                    });

                }
            } else {
                setNotificationData({
                    title: "Nenhum texto selecionado!",
                    description: "Selecione o texto para fazer a marcação!",
                    type: "aviso"
                });

            }
        }
    };

    const handleRemoveComment = (id: number) => {
        setMarkedTexts(prev => prev.filter(markedText => markedText.id !== id));
        setNotificationData({
            title: "Comentário Excluído",
            description: "O comentário e a marcação foram excluídos com sucesso!",
            type: "success"
        });
    };

    const handleRemoveCommentBack = (id: number) => {
        setMarkedTextsBack(prev => prev.filter(markedTextsBack => markedTextsBack.id !== id));
        setNotificationData({
            title: "Comentário Excluído",
            description: "O comentário e a marcação foram excluídos com sucesso!",
            type: "success"
        });

    }

    const handleAddComment = (title: string, bg: string,) => {
        if (selectedText && commentInputRef.current && selectionRange) {
            const comment = commentInputRef.current.value;
            if (comment) {
                const { start, end } = selectionRange;
                const newMarkedText: MarkedText = {
                    id: Date.now(),
                    text: selectedText,
                    comment,
                    mark: title,
                    start,
                    end,
                    background: bg,
                };

                setMarkedTexts(prev => {
                    const updatedMarkedTexts = [...prev, newMarkedText];
                    updatedMarkedTexts.sort((a, b) => a.start - b.start);
                    return updatedMarkedTexts;
                });
                setSelectedText(null);
                setSelectionRange(null);
                commentInputRef.current.value = '';
                setOpen(true)

            }
        }
    };

    const Marks = [
        { title: "Criatividade", gradienteBG: `bg-gradient-to-r from-red-400 to-red-500`, bg: "bg-red-400", borderColor: `border-red-500` },
        { title: "Liderança", gradienteBG: `bg-gradient-to-r from-amber-400 to-amber-500`, bg: "bg-amber-400", borderColor: "border-amber-500" },
        { title: "Características Gerais", gradienteBG: `bg-gradient-to-r from-lime-400 to-lime-500`, bg: "bg-lime-400", borderColor: "border-lime-500" },
        { title: "Habilidades acima da média", gradienteBG: `bg-gradient-to-r from-sky-400 to-sky-500`, bg: "bg-sky-400", borderColor: "border-sky-500" },
        { title: "Comprometimento com a tarefa", gradienteBG: `bg-gradient-to-r from-violet-400 to-violet-500`, bg: "bg-violet-400", borderColor: "border-violet-500" },
        { title: "Atividades artísticas e esportivas", gradienteBG: `bg-gradient-to-r from-pink-400 to-pink-500`, bg: "bg-pink-400", borderColor: "border-pink-500" },
    ];

    const renderMarkedTexts = (text: string) => {
        const parts = [];
        let lastIndex = 0;

        markedTexts.forEach((markedText, index) => {
            if (markedText.start >= lastIndex) {
                const before = text.substring(lastIndex, markedText.start);
                const marked = text.substring(markedText.start, markedText.end);

                parts.push(<span key={`${index}-before`}>{before}</span>);
                parts.push(
                    <HoverCard.Root key={markedText.id}>
                        <HoverCard.Trigger>
                            <span className={`rounded-sm font-semibold px-1
                                ${markedText.background}`}>
                                {marked}
                            </span>
                        </HoverCard.Trigger>
                        <HoverCard.Content size="3" className={`!p-3 drop-shadow-xl ${markedText.mark === "Criatividade" ? "bg-gradient-to-tl from-red-50 to-red-400 " :
                            markedText.mark === "Liderança" ? "bg-gradient-to-tl from-amber-50 to-amber-400" :
                                markedText.mark === "Características Gerais" ? "bg-gradient-to-tl from-lime-50 to-lime-400" :
                                    markedText.mark === "Habilidades acima da média" ? "bg-gradient-to-tl from-sky-50 to-sky-400" :
                                        markedText.mark === "Comprometimento com a tarefa" ? "bg-gradient-to-tl from-violet-50 to-violet-400" :
                                            markedText.mark === "Atividades artísticas e esportivas" ? "bg-gradient-to-tl from-pink-50 to-pink-400" : ""} 
                                    }  `} >
                            <Flex gap="4" direction="column">
                                <Box>
                                    <Text as="p" size="3" mb="2" className='font-bold'>
                                        Comentário
                                    </Text>
                                    <Text size="2" as="p" className='text-justufy'>
                                        {markedText.comment}
                                    </Text>

                                </Box>
                                <Flex direction="column" align="center">
                                    <Separator size="4" className="my-2" />
                                    <Alert
                                        trigger={
                                            <Box>
                                                <Tooltip content={"Excluir marcação"}>
                                                    <Button className='w-full' size='Extra Small' color="red" title={''} children={<Icon.Trash />} />
                                                </Tooltip>
                                            </Box>}

                                        title={'Excluir marcação'}
                                        description={'Tem certeza que deseja excluir a marcação e o comentário?'}
                                        buttoncancel={<Button color="gray" title={'Cancelar'} size={'Small'}>
                                        </Button>}
                                        buttonAction={<Button onClick={() => handleRemoveComment(markedText.id)} title={'Sim, Excluir'} color="red" size={'Small'}>
                                        </Button>} />
                                </Flex>
                            </Flex>
                        </HoverCard.Content>
                    </HoverCard.Root>
                );
                lastIndex = markedText.end;
            }
        });
        markedTextsBack.forEach((markedTextBack, index) => {
            if (markedTextBack.start >= lastIndex) {
                const before = text.substring(lastIndex, markedTextBack.start);
                const marked = text.substring(markedTextBack.start, markedTextBack.end);

                parts.push(<span key={`${index}-before `}>{before}</span>);
                parts.push(
                    <HoverCard.Root key={markedTextBack.id}>
                        <HoverCard.Trigger>
                            <span className={`rounded-sm font-semibold px-1
                                ${markedTextBack.background}`}>
                                {marked}
                            </span>
                        </HoverCard.Trigger>
                        <HoverCard.Content size="3" className={`!p-3 drop-shadow-xl ${markedTextBack.mark === "Criatividade" ? "bg-gradient-to-tl from-red-50 to-red-400 " :
                            markedTextBack.mark === "Liderança" ? "bg-gradient-to-tl from-amber-50 to-amber-400" :
                                markedTextBack.mark === "Características Gerais" ? "bg-gradient-to-tl from-lime-50 to-lime-400" :
                                    markedTextBack.mark === "Habilidades acima da média" ? "bg-gradient-to-tl from-sky-50 to-sky-400" :
                                        markedTextBack.mark === "Comprometimento com a tarefa" ? "bg-gradient-to-tl from-violet-50 to-violet-400" :
                                            markedTextBack.mark === "Atividades artísticas e esportivas" ? "bg-gradient-to-tl from-pink-50 to-pink-400" : ""} 
                                    }  `} >
                            <Flex gap="4" direction="column">

                                <Box>
                                    <Text as="p" size="3" mb="2" className='font-bold'>
                                        Comentário
                                    </Text>
                                    <Text size="2" as="p" className='text-justufy'>
                                        {markedTextBack.comment}
                                    </Text>

                                </Box>
                                <Flex direction="column" align="center" gap="2">
                                    <Separator size="4" />

                                    <Alert
                                        trigger={
                                            <Box >
                                                <Tooltip content={"Excluir marcação"}>
                                                    <Button size='Extra Small' color="red" title={''} children={<Icon.Trash />} />
                                                </Tooltip>
                                            </Box>}

                                        title={'Excluir marcação'}
                                        description={'Tem certeza que deseja excluir a marcação e o comentário?'}
                                        buttoncancel={<Button color="gray" title={'Cancelar'} size={'Small'}>
                                        </Button>}
                                        buttonAction={<Button onClick={() => handleRemoveCommentBack(markedTextBack.id)} title={'Sim, Excluir'} color="red" size={'Small'} >
                                        </Button>} />
                                </Flex>
                            </Flex>
                        </HoverCard.Content>
                    </HoverCard.Root>
                );
                lastIndex = markedTextBack.end;
            }
        });
        parts.push(<span key="last-part">{text.substring(lastIndex)}</span>);
        return parts;
    };

    return (

        <Notify
            open={!!notificationData.title}
            onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
            title={notificationData.title}
            description={notificationData.description}
            icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
            className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
        >
            <div className=" min-h-screen px-4 max-xl:p-2">
                {/* Cabeçalho */}
                <header className="mb-2 max-xl:mb-4 text-center">
                    <Flex align="center" justify="center" gap="3" className="mb-4">
                        <Icon.User weight="bold" size={32} className="text-violet-600" />
                        <h1 className="heading-1">{participant.personalData.fullName}</h1>
                    </Flex>
                    <Text size="5" className="text-neutral-600">
                        Análise de Autobiografia
                    </Text>
                </header>

                {/* Corpo Principal */}
                <main className="max-w-7xl mx-auto">
                    <Flex direction={isDesktop ? "row" : "column"} gap="6">
                        {/* Coluna de Marcadores */}
                        <Box className={`desktop card-container w-full ${isDesktop ? 'max-w-[25%]' : ''}`}>
                            <Flex direction="column" p="4" gap="4">
                                <Flex align="center" gap="3" className="mb-2 ">
                                    <Icon.Highlighter size={24} className="text-violet-600" />
                                    <h2 className="heading-2">Marcadores</h2>
                                </Flex>

                                {Marks.map((mark, index) => (
                                    <Popover.Root key={index}>
                                        <Popover.Trigger>
                                            <button
                                                className={`btn-primary w-full p-3 text-left rounded-lg ${mark.gradienteBG} text-white font-medium hover:shadow-md`}
                                                onClick={handleTextSelection}
                                            >
                                                {mark.title}
                                            </button>
                                        </Popover.Trigger>
                                        <Popover.Content className={`${limit ? "invisible" : ""} ${mark.gradienteBG}`} width="360px">
                                            <Flex gap="3">
                                                <Box flexGrow="1">
                                                    <TextArea
                                                        className="bg-white"
                                                        placeholder="Escreva um comentário..."
                                                        style={{ height: 80 }}
                                                        ref={commentInputRef}
                                                    />
                                                    <Flex gap="3" mt="3" justify="between">
                                                        <Popover.Close>
                                                            <Button
                                                                onClick={() => handleAddComment(mark.title, mark.bg)}
                                                                title={"Inserir Comentário"}
                                                                className="w-full"
                                                                color="green"
                                                                size={"Medium"}
                                                            />
                                                        </Popover.Close>
                                                    </Flex>
                                                </Box>
                                            </Flex>
                                        </Popover.Content>
                                    </Popover.Root>
                                ))}
                            </Flex>
                        </Box>
                        <Flex
                            className={`w-full mobo card-container overflow-x-auto flex gap-2  rounded-xl transition-all duration-300`}

                        >
                            <Flex p="4" gap="3" align="center" justify={'start'} className="mb-3 border-b border-neutral-100">
                                <Flex gap="3" align="center" className="">
                                    <Icon.Highlighter size={24} className="text-violet-600" />
                                    <Text as="label" size="5" className="font-bold heading-2">
                                        Marcadores
                                    </Text>

                                </Flex>
                                <Icon.CaretDown
                                    onClick={() => setOpenMarks(!openMarks)}
                                    size={25}
                                    className={`heading-2 cursor-pointer transform transition-transform duration-300 ease-in-out ${openMarks ? "rotate-180" : ""
                                        }`}
                                />
                            </Flex>
                            <div className={`mb-2 transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden flex flex-wrap gap-3 max-sm:gap-1 justify-center ${!openMarks
                                ? "opacity-100 max-h-[500px] translate-y-0"
                                : "opacity-0 max-h-0 -translate-y-2"
                                }`}>
                                {Marks.map((mark, index) => (
                                    <Popover.Root key={index}>
                                        <Popover.Trigger>
                                            <div className=" rounded group group/item" children={<button
                                                className={` btn-primary-mobo flex-shrink-0 w-10 h-10 text-sm font-semibold text-white rounded-full ${mark.gradienteBG} active:scale-95 transition-transform border border-white`}
                                                onClick={handleTextSelection}
                                            >
                                            </button>} >

                                            </div>
                                        </Popover.Trigger>
                                        <Popover.Content sideOffset={5} align="start" className={`z-50 bg-white p-4 rounded shadow-lg w-[90vw] ${mark.gradienteBG} max-w-sm ${limit ? "invisible" : ""}`}>
                                            <Text className={`text-sm font-semibold  text-white rounded-full px-2 py-1`}>
                                                {mark.title}
                                            </Text>
                                            <TextArea
                                                className={`w-full`}
                                                placeholder="Escreva um comentário...."
                                                style={{ height: 80 }}
                                                ref={commentInputRef}
                                            />
                                            <Flex gap="3" mt="3" justify="between">
                                                <Popover.Close>
                                                    <Button
                                                        onClick={() => handleAddComment(mark.title, mark.bg)}
                                                        title="Inserir Comentário"
                                                        className="w-full"
                                                        color="green"
                                                        size="Small"
                                                    />
                                                </Popover.Close>
                                            </Flex>
                                        </Popover.Content>
                                    </Popover.Root>
                                ))}
                            </div>

                            <div className={`transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden  ${openMarks
                                ? "opacity-100 max-h-[500px] translate-y-0"
                                : "opacity-0 max-h-0 -translate-y-2"
                                }`}>
                                {Marks.map((mark, index) => (
                                    <Popover.Root key={index}>
                                        <Popover.Trigger>
                                            <button
                                                className={`btn-primary-mobo w-[80%] py-3 px-2 text-left rounded-lg ${mark.gradienteBG} text-white font-medium hover:shadow-md mb-2`}
                                                onClick={handleTextSelection}
                                            >
                                                {mark.title}
                                            </button>
                                        </Popover.Trigger>
                                        <Popover.Content className={limit ? "invisible" : ""} width="360px">
                                            <Flex gap="3">
                                                <Box flexGrow="1">
                                                    <TextArea
                                                        className="bg-white"
                                                        placeholder="Escreva um comentário..."
                                                        style={{ height: 80 }}
                                                        ref={commentInputRef}
                                                    />
                                                    <Flex gap="3" mt="3" justify="between">
                                                        <Popover.Close>
                                                            <Button
                                                                onClick={() => handleAddComment(mark.title, mark.bg)}
                                                                title={"Inserir Comentário"}
                                                                className="w-full"
                                                                color="green"
                                                                size={"Medium"}
                                                            />
                                                        </Popover.Close>
                                                    </Flex>
                                                </Box>
                                            </Flex>
                                        </Popover.Content>
                                    </Popover.Root>
                                ))}
                            </div>

                        </Flex>

                        {/* Área de Texto */}
                        <Box className="card-container  w-[70%] max-xl:w-full">
                            <Flex direction="column" className="h-full">
                                <Flex p="4" align="center" gap="3" className="border-b border-neutral-100">
                                    <Icon.Notebook size={24} className="text-violet-600" />
                                    <h2 className="heading-2">Autobiografia</h2>
                                </Flex>
                                <Box className="p-6 overflow-auto h-[60vh]">
                                    <p id="autobiography" className="text-justify leading-relaxed text-neutral-700">
                                        {renderMarkedTexts(participant?.autobiography?.text || "")}
                                    </p>
                                </Box>
                            </Flex>
                        </Box>

                        {/* Painel de Comentários */}
                        <Box
                            id="comments-panel"
                            className={`card-container ${isDesktop ? 'w-[350px]' : 'w-full'}
                            transition-all duration-300 ease-in-out overflow-hidden ${open ? "opacity-100 scale-100 max-xl:max-h-[1000px]" : "opacity-0 scale-95 translate-x-4 !w-0 max-xl:max-h-0"}`}
                        >
                            <Flex direction="column" className="h-full">
                                <Flex p="4" align="center" gap="3" className="border-b border-neutral-100">
                                    <Icon.ChatCircleText size={24} className="text-violet-600" />
                                    <h2 className="heading-2">Comentários</h2>
                                </Flex>
                                <Box className={`p-4 overflow-auto h-[50vh] `} >
                                    {markedTexts.map((marked, index) => (
                                        <Box key={index} className={`mb-4 last:mb-0 p-3  rounded-lg ${marked.background} text-left`}>
                                            <Text size="2" className="font-medium text-neutral-700 mb-1 ">
                                                {marked.mark}: &nbsp;
                                            </Text>
                                            <Text size="1" className="text-neutral-500 mb-2">
                                                "{marked.text}"
                                            </Text>
                                            <br></br>
                                            <Text size="2" className="text-neutral-700 font-medium ">
                                                Comentário: &nbsp;
                                            </Text>
                                            <Text size="1" className="text-neutral-500 mb-2">
                                                {marked.comment}
                                            </Text>
                                        </Box>
                                    ))}
                                    {markedTextsBack.map((marked, index) => (
                                        <Box key={index} className={`mb-4 last:mb-0 p-3  rounded-lg ${marked.background} text-left`}>
                                            <Text size="2" className="font-medium text-neutral-700 mb-1 ">
                                                {marked.mark}: &nbsp;
                                            </Text>
                                            <Text size="1" className="text-neutral-500 mb-2">
                                                "{marked.text}"
                                            </Text>
                                            <br></br>
                                            <Text size="2" className="text-neutral-700 font-medium ">
                                                Comentário: &nbsp;
                                            </Text>
                                            <Text size="1" className="text-neutral-500 mb-2">
                                                {marked.comment}
                                            </Text>
                                        </Box>
                                    ))}
                                </Box>
                            </Flex>
                        </Box>
                    </Flex>

                    {/* Ações */}
                    <Flex justify="center" gap="4" className="mt-8">
                        <Button
                            onClick={() => handleSaveEvalueAutobiography(true)}
                            size="Medium"
                            title="Salvar Análise"
                            className="btn-primary px-8"
                            color="green"
                        />
                        <Button
                            color="primary"
                            size="Medium"
                            title={`${open ? "Ocultar" : "Mostrar"} Comentários`}
                            onClick={() => handleOpenBox()}

                        />
                    </Flex>
                </main>

                <BackToTop />
            </div>
        </Notify>
    );
};

export default EvaluateAutobiography;
