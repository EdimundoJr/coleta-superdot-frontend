import React, { useState, useRef, useEffect } from 'react';
import { Header } from '../../components/Header/Header';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { useLocation } from "react-router-dom";
import { Box, Flex, Text, HoverCard, Separator, Tooltip, Popover, TextArea } from '@radix-ui/themes';
import Notify from '../../components/Notify/Notify';
import { Button } from "../../components/Button/Button"
import { Alert } from '../../components/Alert/Alert';
import { getParticipantDataBio, patchSaveEvalueAutobiography } from '../../api/participant.api';
import { ISample } from '../../interfaces/sample.interface';
import IBio from '../../interfaces/evaluateAutobiography.interface';



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
    const [notificationTitle, setNotificationTitle] = useState("");
    const [notificationDescription, setNotificationDescription] = useState("");
    const [notificationIcon, setNotificationIcon] = useState<React.ReactNode>();
    const [notificationClass, setNotificationClass] = useState("");
    const [limit, setLimit] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [error, setError] = useState();

    const location = useLocation();
    const { participant, sample } = location.state as LocationState;

    console.log(markedTextsBack)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await getParticipantDataBio({
                    sampleId: sample._id,
                    participantId: participant._id
                });

                const transformedData = data.evaluateAutobiography.map((item: IBio) => ({
                    id: item.id,
                    text: item.text,
                    comment: item.comment,
                    mark: item.mark,
                    start: item.start,
                    end: item.end,
                    background: item.background,
                }));

                if (Array.isArray(transformedData)) {
                    setMarkedTextsBack(transformedData);
                } else {
                    console.error("Expected evaluateAutobiography to be an array", transformedData);
                }

                console.log(transformedData);
            } catch (error: any) {
                setError(error);
            }
        };

        if (markedTexts.length === 0 && sample?._id && participant?._id) {
            fetchData();
        }
    }, []);



    const handleSaveEvalueAutobiography = async (submitForm?: boolean) => {
        if (submitForm && markedTexts.length === 0) {
            setNotificationTitle("Preencha pelo menos um campo");
            setNotificationDescription("Para salvar, é obrigatório adicionar um comentário.");
            setNotificationIcon(<Icon.WarningCircle size={30} color="white" weight="bold" />)
            setNotificationClass("bg-yellow-400");
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
                setNotificationTitle("Comentários Salvos!");
                setNotificationDescription("Os comentários foram salvos com sucesso!");
                setNotificationIcon(<Icon.CheckCircle size={30} color="white" weight="bold" />);
                setNotificationClass("bg-green-500")
                window.location.reload()
            } else {
                setNotificationTitle("Erro ao salvar os comentários!");
                setNotificationDescription("Houve um erro ao salvar os comentários!");
                setNotificationIcon(<Icon.XCircle size={30} color="white" weight="bold" />);
                setNotificationClass("bg-red-500")
            }
        } catch (error) {
            setNotificationTitle("Erro ao salvar os comentários!");
            setNotificationDescription("Houve um erro ao salvar os comentários!");
            setNotificationIcon(<Icon.XCircle size={30} color="white" weight="bold" />);
            setNotificationClass("bg-red-500")
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
                        console.log(selectedText);
                    } else {
                        setNotificationTitle("Limite de caracteres atingido.");
                        setNotificationDescription("Selecione menos caracteres para a marcação!");
                        setLimit(true);
                        setNotificationIcon(<Icon.WarningCircle size={30} color="white" weight="bold" />);
                        setNotificationClass("bg-yellow-400");
                    }
                } else {
                    setNotificationTitle("Seleção fora do limite permitido!");
                    setNotificationDescription("Por favor, selecione o texto dentro da autobiografia.");
                    setLimit(true);
                    setNotificationIcon(<Icon.WarningCircle size={30} color="white" weight="bold" />);
                    setNotificationClass("bg-yellow-400");
                }
            } else {
                setNotificationTitle("Nenhum texto selecionado!");
                setNotificationDescription("Selecione o texto para fazer a marcação!");
                setLimit(true);
                setNotificationIcon(<Icon.WarningCircle size={30} color="white" weight="bold" />);
                setNotificationClass("bg-yellow-400");
            }
        }
    };

    const handleRemoveComment = (id: number) => {
        setMarkedTexts(prev => prev.filter(markedText => markedText.id !== id));
        setNotificationTitle("Comentário Excluído")
        setNotificationDescription("O comentário e a marcação foram excluídos com sucesso!")
        setNotificationIcon(<Icon.CheckCircle size={30} color="white" />)
        setNotificationClass("bg-green-500")
    };

    const handleRemoveCommentBack = (id: number) => {
        setMarkedTextsBack(prev => prev.filter(markedTextsBack => markedTextsBack.id !== id));
        setNotificationTitle("Comentário Excluído")
        setNotificationDescription("O comentário e a marcação foram excluídos com sucesso!")
        setNotificationIcon(<Icon.CheckCircle size={30} color="white" />)
        setNotificationClass("bg-green-500") 
    }

    // const handleOpenBox = () => {
    //     if (open === false) {
    //         setOpen(true)
    //     } else {
    //         setOpen(false)
    //     }

    // }
    const handleAddComment = (title: string, bg: string) => {
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
        { title: "Criatividade", gradienteBG: `bg-gradient-to-r from-red-400 to-red-500`, bg: "bg-red-400", borderColor: "border-red-500" },
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
                        <HoverCard.Content size="3">
                            <Flex gap="4" direction="column">

                                <Box>
                                    <Text as="div" size="3" color="gray" mb="2" className='font-bold'>
                                        Comentário
                                    </Text>
                                    <Text size="2" as="p" className='text-justufy'>
                                        {markedText.comment}
                                    </Text>

                                </Box>
                                <Flex direction="column" align="center">
                                    <Separator size="4"></Separator>

                                    <Alert
                                        trigger={
                                            <Box>
                                                <Tooltip content={"Excluir marcação"}>
                                                    <Button size='Medium' color="red" title={''} children={<Icon.Trash />} />
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
                        <HoverCard.Content size="3" >
                            <Flex gap="4" direction="column">

                                <Box>
                                    <Text as="div" size="3" color="gray" mb="2" className='font-bold'>
                                        Comentário
                                    </Text>
                                    <Text size="2" as="p" className='text-justufy'>
                                        {markedTextBack.comment}
                                    </Text>

                                </Box>
                                <Flex direction="column" align="center">
                                    <Separator size="4"></Separator>

                                    <Alert
                                        trigger={
                                            <Box>
                                                <Tooltip content={"Excluir marcação"}>
                                                    <Button size='Medium' color="red" title={''} children={<Icon.Trash />} />
                                                </Tooltip>
                                            </Box>}

                                        title={'Excluir marcação'}
                                        description={'Tem certeza que deseja excluir a marcação e o comentário?'}
                                        buttoncancel={<Button color="gray" title={'Cancelar'} size={'Small'}>
                                        </Button>}
                                        buttonAction={<Button onClick={() => handleRemoveCommentBack(markedTextBack.id)} title={'Sim, Excluir'} color="red" size={'Small'}>
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
            open={!!notificationTitle}
            onOpenChange={() => setNotificationTitle("")}
            title={notificationTitle}
            description={notificationDescription}
            icon={notificationIcon}
            className={notificationClass}
        >
            <Header title="Avaliar Autobiografia" icon={<Icon.Books size={24} />} />
            <Box>
                <Flex direction="row" justify="center" align="center" gap="2" className='mb-5'>
                    <Icon.User weight="bold" size={30} />
                    <Text as="label" size="8">{participant.personalData.fullName}   </Text>
                </Flex>
            </Box>
            <Flex gap="6" className='w-full h-[450px] mt-5'>
                <Box className='bg-violet-300 rounded-xl '>
                    <Flex align="center" direction="column" >
                        <Flex gap="3" direction="row" className="mt-3">
                            <Text as="label" size="5" className="font-bold mb-5 text-white">
                                Marcadores
                            </Text>
                            <Icon.Highlighter size={25} color='white' weight="bold" />
                        </Flex>

                        {Marks.map((mark, index) => (
                            <Flex key={index} justify="center" className="w-full mb-3 rounded group group/item">
                                <Popover.Root>
                                    <Popover.Trigger>
                                        <Flex align="center" className="relative  group/edit group-hover/item:drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] group-active:translate-x-5 ">
                                            <button
                                                className={`relative z-10 m-auto w-[200px] h-[50px] px-5 rounded-none text-[14px] text-white font-semibold ${mark.gradienteBG}`}
                                                onClick={handleTextSelection}>
                                                {mark.title}
                                                <div className={`absolute top-0 right-[-40px] w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[40px] 
                                                ${mark.borderColor}`}></div>
                                            </button>

                                        </Flex>
                                    </Popover.Trigger>
                                    <Popover.Content className={limit ? "invisible" : ""} width="360px">
                                        <Flex gap="3">
                                            <Box flexGrow="1">
                                                <TextArea
                                                    className='bg-white'
                                                    placeholder="Escreva um comentário..."
                                                    style={{ height: 80 }}
                                                    ref={commentInputRef}
                                                />
                                                <Flex gap="3" mt="3" justify="between">
                                                    <Popover.Close>
                                                        <Button onClick={() => handleAddComment(mark.title, mark.bg)} title={'Salvar Comentário'} className={`w-full`} color="green" size={''} />
                                                    </Popover.Close>
                                                </Flex>
                                            </Box>
                                        </Flex>
                                    </Popover.Content>
                                </Popover.Root>
                            </Flex>
                        ))}
                    </Flex>
                </Box>
                <Flex className='w-full overflow-auto border-2 rounded-lg  bg-white'>
                    <p id="autobiography" className="p-10 text-justify h-[450px] ">
                        {renderMarkedTexts(participant?.autobiography?.text || "")}
                    </p>
                </Flex>
                {/* <Button
                    color={'primary'}
                    size='Extra Small'
                    className={`absolute top-40 right-10 `}
                    title={`${open === false ? "Mostrar" : "Ocultar"} marcações`}
                    onClick={() => handleOpenBox()}

                ></Button> */}
                <Box className={`${!open ? "scale-0" : "scale-100 w-[50%]"} bg-white`}>
                    <Flex direction="column" className={`p-2 border-2 rounded-lg h-[450px] overflow-auto origin-right ${!open ? "scale-0" : "scale-100"} duration-500 `}>
                        {markedTexts.map((marked, index) => (
                            <Box className={`${!open ? "scale-0" : "transition-opacity opacity-100"} border-b-2 mb-1 p-2 '}`}>
                                <Box>
                                    <p>Marcação:</p>
                                    <p key={index} className={`${marked.background} mb-1 text-justify rounded-sm px-1`}>
                                        {marked.text}
                                    </p>
                                    <p>Comentário:</p>
                                    <p className='font-semibold  text-justify'>
                                        {marked.comment}
                                    </p>
                                </Box>
                            </Box>
                        ))}
                    </Flex>
                </Box>
            </Flex>
            <Box className='w-[200px] m-auto'>
                <Button onClick={() => handleSaveEvalueAutobiography(true)} size='Medium' title={'Salvar'} className='w-full' color={'green'} />


            </Box>
        </Notify>
    );
};

export default EvaluateAutobiography;
