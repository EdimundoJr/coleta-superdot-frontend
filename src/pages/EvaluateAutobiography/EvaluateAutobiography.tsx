import React, { useState, useRef } from 'react';
import { Header } from '../../components/Header/Header';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { useLocation } from "react-router-dom";
import { Box, Flex, Popover, TextArea, Text, HoverCard, Separator, Tooltip } from '@radix-ui/themes';
import Notify from '../../components/Notify/Notify';
import { ScrollToTop } from '../../components/ScrollToTop/ScrollToTop';
import { Button } from "../../components/Button/Button"
import { Alert } from '../../components/Alert/Alert';

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
    participant: IParticipant;
}

const EvaluateAutobiography: React.FC = () => {
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

    const location = useLocation();
    const { participant } = location.state as LocationState;
    console.log(markedTexts)

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

    const renderMarkedText = (text: string) => {
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
                        <HoverCard.Content size="3" className={`border-2 border-${markedText.background}`}>
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
                                                    <Button color="red" title={''} children={<Icon.Trash />} />
                                                </Tooltip>
                                            </Box>}
                                        title={'Excluir marcação'}
                                        description={'Tem certeza que deseja excluir a marcação e o comentário?'}
                                        buttoncancel={<Button color="gray" title={'Cancelar'}>
                                        </Button>}
                                        buttonAction={<Button onClick={() => handleRemoveComment(markedText.id)} title={'Sim, Excluir'} color="red">
                                        </Button>} />
                                </Flex>
                            </Flex>
                        </HoverCard.Content>
                    </HoverCard.Root>
                );
                lastIndex = markedText.end;
            }
        });
        parts.push(<span key="last-part">{text.substring(lastIndex)}</span>);
        return parts;
    };

    return (
        <Box className="flex flex-col relative border-t-4 border-primary rounded-tl-[30px] w-full bg-[#fbfaff] p-5">
            <Notify
                open={!!notificationTitle}
                onOpenChange={() => setNotificationTitle("")}
                title={notificationTitle}
                description={notificationDescription}
                icon={notificationIcon}
                className={notificationClass}
            />
            <ScrollToTop />
            <Header title="Avaliar Autobiografia" icon={<Icon.Books size={24} />} />
            <Box>
                <Flex direction="row" justify="center" align="center" gap="2" className='mb-10'>
                    <Icon.User weight="bold" size={30} />
                    <Text as="label" size="8">{participant.personalData.fullName}</Text>
                </Flex>
            </Box>
            <Flex gap="6" className='w-full h-[550px] mt-5 mb-5'>
                <Box className='bg-violet-300 rounded-xl '>
                    <Flex align="center" direction="column" >
                        <Flex gap="3" direction="row" className=" mt-3">
                            <Text as="label" size="5" className="font-bold text-white">
                                Marcadores
                            </Text>
                            <Icon.Highlighter size={25} color='white' weight="bold" />
                        </Flex>

                        {Marks.map((mark, index) => (
                            <Flex key={index} justify="center" className="w-full m-2 rounded group group/item">
                                <Popover.Root>
                                    <Popover.Trigger>
                                        <Flex align="center" className="relative m-2 group/edit group-hover/item:drop-shadow-[0_4px_16px_rgba(22,22,22,0.3)] group-active:translate-x-5 ">
                                            <button
                                                className={`relative z-10 m-auto w-[200px] h-[50px] px-5 rounded-none text-[14px] text-white font-semibold ${mark.gradienteBG}`}
                                                onClick={handleTextSelection} >
                                                {mark.title}
                                                <div className={`absolute top-0 right-[-40px] w-0 h-0 border-t-[25px] border-t-transparent border-b-[25px] border-b-transparent border-l-[40px] 
                                                ${mark.borderColor}`}></div>
                                            </button>

                                        </Flex>
                                    </Popover.Trigger>
                                    <Popover.Content className={limit ? "hidden" : ""} width="360px">
                                        <Flex gap="3">
                                            <Box flexGrow="1">
                                                <TextArea
                                                    placeholder="Escreva um comentário..."
                                                    style={{ height: 80 }}
                                                    ref={commentInputRef}
                                                />
                                                <Flex gap="3" mt="3" justify="between">
                                                    <Popover.Close>
                                                        <Button onClick={() => handleAddComment(mark.title, mark.bg)} title={'Salvar'} className={`w-full`} color="green" />
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
                <Flex className='w-full overflow-auto border-2 rounded-lg'>
                    <p id="autobiography" className="p-10 text-justify h-[550px]  ">
                        {renderMarkedText(participant?.autobiography?.text || "")}
                    </p>
                </Flex>
                {/* <Button
                    color={'primary'}
                    className={`absolute top-40  w-30 h-30 ${open === false ? "right-10" : "-right-20"}`}
                    title={'Mostrar marcações'}
                    onClick={() => handleOpenBox()}

                ></Button> */}
                <Box className={`${!open ? "scale-0" : "scale-100 w-[50%]"}`}>
                    <Flex direction="column" className={`p-2 border-2 rounded-lg h-[550px] overflow-auto origin-right ${!open ? "scale-0" : "scale-100"} duration-500 `}>
                        {markedTexts.map((marked, index) => (
                            <Box className={`${!open ? "scale-0" : "transition-opacity opacity-100"} border-b-2 mb-1 p-2 font-roboto  '}`}>
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
                <Button title={'Salvar'} className='w-full' color={'green'} />
            </Box>
        </Box >
    );
};

export default EvaluateAutobiography;
