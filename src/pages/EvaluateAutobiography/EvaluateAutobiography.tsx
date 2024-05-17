import React, { useState, useRef } from 'react';
import { Header } from '../../components/Header/Header';
import * as Icon from '@phosphor-icons/react';
import { IParticipant } from '../../interfaces/participant.interface';
import { useLocation } from "react-router-dom";
import { Box, Button, Flex, Popover, TextArea,  Text, HoverCard } from '@radix-ui/themes';
import { GridComponent } from '../../components/Grid/Grid';

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
    const commentInputRef = useRef<HTMLTextAreaElement>(null);

    const location = useLocation();
    const { participant } = location.state as LocationState;
    console.log(markedTexts)              

    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (selection && !selection.isCollapsed) {
            const selectedText = selection.toString();
           
            setSelectedText(selectedText);
            selection.removeAllRanges();
        }
    };        

    const handleAddComment = (title: string) => {
        if (selectedText && commentInputRef.current) {
            const comment = commentInputRef.current.value;
            if (comment) {
                const text = participant?.autobiography?.text || '';
                const start = text.indexOf(selectedText);
                const end = start + selectedText.length;
                const mark = title
                const newMarkedText: MarkedText = {
                    id: Date.now(),
                    text: selectedText,
                    comment,
                    mark,
                    start,
                    end,
                };
                setMarkedTexts([...markedTexts, newMarkedText]);                
                setSelectedText(null);
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
            const before = text.substring(lastIndex, markedText.start);
            const marked = text.substring(markedText.start, markedText.end);

            parts.push(<span key={`${index}-before`}>{before}</span>);
            parts.push(
                <HoverCard.Root key={markedText.id}>
                            <HoverCard.Trigger>
                                <span className={
                                    markedText.mark === 'Criatividade' ? "bg-yellow-300":
                                    markedText.mark === 'Liderança' ? "bg-gray-300":
                                    markedText.mark === 'Características Gerais' ? "bg-amber-500":
                                    markedText.mark === 'Habilidades acima da média' ? "bg-green-500":
                                    markedText.mark === 'Comprometimento com a tarefa' ? "bg-blue-300":
                                    markedText.mark === 'Atividades artísticas e esportivas' ? "bg-pink-400":
                                    ""
                                }                                
                                
                                >{marked}</span>
                            </HoverCard.Trigger>
                            <HoverCard.Content maxWidth="300px">
                                <Flex gap="4">
                                    <Box>
                                        <Text as="div" size="2" color="gray" mb="2">
                                            Comentário
                                        </Text>
                                        <Text as="div" size="2">
                                        {markedText.comment}
                                        </Text>
                                    </Box>
                                </Flex>
                            </HoverCard.Content>
                        </HoverCard.Root>               
            );

            lastIndex = markedText.end;
        });

        parts.push(<span key="last-part">{text.substring(lastIndex)}</span>);
        return parts;
    };

    return (
        <Box className="flex flex-col relative border-t-4 border-primary rounded-tl-[30px] w-full bg-[#fbfaff] p-5">
            <Header title="Avaliar Autobiografia" icon={<Icon.Books size={24} />} />
            <h1> Avaliar Autobiografia, Marcar Texto e Adicionar Comentários</h1>
            <h3>{participant.personalData.fullName}</h3>

            <Flex direction="column" align="center" className="bg-violet-300 h-50 mt-3 pb-4">
                <Flex direction="row" className="p-4">
                    <Text as="label" size="6" className="m-auto">
                        Marcadores
                    </Text>
                </Flex>
                <GridComponent
                    columns={3}
                    children={
                        <>
                            {Marks.map((mark, index) => (
                                <Flex key={index} justify="center" className="w-full m-2">
                                    <Popover.Root>
                                        <Popover.Trigger>
                                            <Button color={mark.color} variant="outline" size="4" onClick={() =>
                                                handleTextSelection()
                                            } className="m-auto p-2">
                                                <Flex align="center" className="gap-3">
                                                    <Box className={`w-5 h-5 ${mark.bg}`} />
                                                    {mark.title}
                                                </Flex>
                                            </Button>
                                        </Popover.Trigger>
                                        <Popover.Content width="360px">
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
                        </>
                    }
                    className="w-fit"
                />
            </Flex>


            <p className="mb-4 p-3">
                {renderMarkedText(participant?.autobiography?.text || "")}
            </p>
        </Box>
    );
};

export default EvaluateAutobiography;
