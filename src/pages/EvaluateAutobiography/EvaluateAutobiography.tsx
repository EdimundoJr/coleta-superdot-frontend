import React, { useState, useRef } from 'react';
import { Header } from '../../components/Header/Header';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { useLocation } from "react-router-dom";
import { Box, Button, Flex, Popover, TextArea, Text, HoverCard } from '@radix-ui/themes';
import { GridComponent } from '../../components/Grid/Grid';
import Notify from '../../components/Notify/Notify';

interface MarkedText {
    id: number;
    text: string;
    comment: string;
    mark: string;
    start: number;
    end: number;
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
    const [limit, setLimit] = useState<boolean>(false);

    const location = useLocation();
    const { participant } = location.state as LocationState;
    
    const handleTextSelection = () => {
        const textElement = document.getElementById("autobiography");
        if (textElement) {
            const selection = window.getSelection();
            if (selection) {
                if (!selection.isCollapsed) {
                    const range = selection.getRangeAt(0);
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
                        setNotificationTitle("Limite de caracteres exercido");
                        setNotificationDescription("Selecione menos caracteres para a marcação!");
                        setLimit(true);
                    }
                } else {
                    setNotificationTitle("Nenhum texto selecionado!");
                    setNotificationDescription("Selecione o texto para fazer a marcação!");
                    setLimit(true);
                }
            }
        }
    };

    const handleAddComment = (title: string) => {
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
                };

                setMarkedTexts(prev => {
                    const updatedMarkedTexts = [...prev, newMarkedText];
                    updatedMarkedTexts.sort((a, b) => a.start - b.start);
                    return updatedMarkedTexts;
                });
                setSelectedText(null);
                setSelectionRange(null);
                commentInputRef.current.value = '';
            }
        }
    };

    const Marks = [
        { title: "Criatividade", bg: "bg-yellow-300", color: "yellow" },
        { title: "Liderança", bg: "bg-gray-300", color: "gray" },
        { title: "Características Gerais", bg: "bg-amber-500", color: "tomato" },
        { title: "Habilidades acima da média", bg: "bg-green-500", color: "green" },
        { title: "Comprometimento com a tarefa", bg: "bg-blue-300", color: "blue" },
        { title: "Atividades artísticas e esportivas", bg: "bg-pink-400", color: "pink" },
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
                            <span className={
                                markedText.mark === 'Criatividade' ? "bg-yellow-300" :
                                    markedText.mark === 'Liderança' ? "bg-gray-300" :
                                        markedText.mark === 'Características Gerais' ? "bg-amber-500" :
                                            markedText.mark === 'Habilidades acima da média' ? "bg-green-500" :
                                                markedText.mark === 'Comprometimento com a tarefa' ? "bg-blue-300" :
                                                    markedText.mark === 'Atividades artísticas e esportivas' ? "bg-pink-400" :
                                                        ""
                            }>
                                {marked}
                            </span>
                        </HoverCard.Trigger>
                        <HoverCard.Content>
                            <Flex gap="4">
                                <Box>
                                    <Text as="div" size="3" color="gray" mb="2" className='font-bold'>
                                        Comentário
                                    </Text>
                                    <Text as="p" size="2" className='text-wrap mt-4'>
                                        {markedText.comment}
                                    </Text>
                                </Box>
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
                icon={<Icon.XCircle size={30} color="white" />}
                className="bg-red-400"
            />
            <Header title="Avaliar Autobiografia" icon={<Icon.Books size={24} />} />
            <h1>Avaliar Autobiografia, Marcar Texto e Adicionar Comentários</h1>
            <h3>{participant.personalData.fullName}</h3>

            <Flex direction="column" align="center" className="bg-violet-300 h-50 mt-3 pb-4">
                <Flex direction="row" className="p-4">
                    <Text as="label" size="6" className="m-auto">
                        Marcadores
                    </Text>
                </Flex>
                <GridComponent
                    columns={3}
                    className="w-fit"
                >
                    {Marks.map((mark, index) => (
                        <Flex key={index} justify="center" className="w-full m-2">
                            <Popover.Root>
                                <Popover.Trigger>
                                    <Button color={mark.color} variant="outline" size="4" onClick={handleTextSelection}
                                        className="m-auto p-2">
                                        <Flex align="center" className="gap-3">
                                            <Box className={`w-5 h-5 ${mark.bg}`} />
                                            {mark.title}
                                        </Flex>
                                    </Button>
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
                                                    <Button onClick={() => handleAddComment(mark.title)} color="green" size="1">
                                                        Salvar
                                                    </Button>
                                                </Popover.Close>
                                            </Flex>
                                        </Box>
                                    </Flex>
                                </Popover.Content>
                            </Popover.Root>
                        </Flex>
                    ))}
                </GridComponent>
            </Flex>

            <p id="autobiography" className="mb-4 p-3">
                {renderMarkedText(participant?.autobiography?.text || "")}
            </p>
        </Box>
    );
};

export default EvaluateAutobiography;
