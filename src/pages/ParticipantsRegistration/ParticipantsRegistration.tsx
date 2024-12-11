import ParticipantsRegistrationTable from "../../components/Table/ParticipantsRegistrationTable/ParticipantsRegistrationTable";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ISample } from "../../interfaces/sample.interface";
import Modal from "../../components/Modal/Modal";
import { IParticipant } from "../../interfaces/participant.interface";
import { DateTime } from "luxon";
import Notify from "../../components/Notify/Notify";
import { TFormFillStatus } from "../../utils/consts.utils";
import { ISecondSource } from "../../interfaces/secondSource.interface";
import { DeepPartial } from "react-hook-form";
import ParticipantsIndicationForm from "../../components/ParticipantsIndicationForm/ParticipantsIndicationForm";
import { getSampleById } from "../../api/sample.api";
import { Button, Callout, Flex, IconButton, Skeleton, Strong, Table, Text } from "@radix-ui/themes";
import { Header } from "../../components/Header/Header";
import * as Icon from "@phosphor-icons/react";

const ParticipantsRegistration = () => {
    const [sample, setSample] = useState<ISample>({} as ISample);
    // const [currentPage, setCurrentPage] = useState(1);
    const [modalSecondSourcesOpen, setModalSecondSourcesOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentParticipant, setCurrentParticipant] = useState<IParticipant>();
    const [modalIndicateParticipantsOpen, setModalIndicateParticipantsOpen] = useState(false);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const getSampleInfo = async (sampleId: string) => {
            try {
                const response = await getSampleById({ sampleId });
                if (response.status === 200) {
                    setSample(response.data);
                    setLoading(false)
                }
            } catch (e) {
                console.error(e);
                setNotificationData({
                    title: "Erro no servidor",
                    description: "Não foi possível buscar as informações da amostra.",
                    type: "erro"

                });
            }
        };

        if (location.state.sampleId) {
            getSampleInfo(location.state.sampleId);
        } else {
            navigate(-1);
        }

        if (sample?.participants?.length !== sample?.qttParticipantsAuthorized) {
            setNotificationData({
                title: "Aviso!",
                description: "Você ainda não selecionou a quantidade total de participantes da pesquisa.",
                type: "aviso"
            })

        }

    }, [navigate, location]);

    const handleViewSecondSources = (participant: IParticipant) => {
        setCurrentParticipant(participant);
        setModalSecondSourcesOpen(true);
    };

    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };
    const handleSendTextToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotificationData({
            title: "Link copiado.",
            description: "O link foi copiado para a sua área de transferência.",
            type: "ok"
        });
    };

    useEffect(() => {

    }, []);

    const getFormFillStatus = (secondSource: DeepPartial<ISecondSource>): TFormFillStatus => {
        if (!secondSource.adultForm?.startFillFormAt) {
            return "Não iniciado";
        }

        if (!secondSource.adultForm.endFillFormAt) {
            return "Preenchendo";
        }

        return "Finalizado";
    };

    const handleFinishParticipantIndication = (participantsAdded: IParticipant[]) => {
        setModalIndicateParticipantsOpen(false);

        const newParticipantsArr = sample?.participants ?? [];
        newParticipantsArr.push(...participantsAdded);

        setSample({
            ...sample,
            participants: newParticipantsArr,
        });
    };

    const urlParticipantForm = `${import.meta.env.VITE_FRONTEND_URL}/formulario-adulto/${sample?._id}`;

    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
                title={notificationData.title}
                description={notificationData.description}
                icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
                className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : "bg-green-500"}

            >
                <Header title={`Minhas Amostras / Cadastrar Pessoas`} ></Header>



                <Flex direction="column">
                    <h3>{sample?.sampleGroup}</h3>
                    <Callout.Root variant="surface" size="3" className="m-auto w-fit mb-10">
                        <Skeleton loading={loading}>
                            <Text size="4" as="label" className="font-bold">Utilize os recursos
                                da página para adicionar mais participantes.</Text>

                            <Callout.Icon>
                                <Icon.Info size={20} />
                            </Callout.Icon>
                            <Callout.Text>
                                URL DO AVALIADO:
                            </Callout.Text>
                            <Callout.Text>
                                <Flex align="center" gap="4">
                                    <Strong>{urlParticipantForm}</Strong>
                                    <IconButton size="2"
                                        className="hover:cursor-pointer"
                                        variant="ghost"
                                        onClick={() => handleSendTextToClipBoard(urlParticipantForm)}
                                    >
                                        <Icon.Copy
                                            weight="bold"
                                            size={20}
                                        />
                                    </IconButton>
                                </Flex>

                            </Callout.Text>
                            <Callout.Text>Compartilhe a URL com os adultos que deseja adicionar à base de dados</Callout.Text>
                            <Flex justify="center">
                                <Callout.Text>Máximo de inscrições: <Strong>{sample?.qttParticipantsAuthorized}</Strong></Callout.Text>
                            </Flex>
                            {sample?.participants?.length !== sample?.qttParticipantsAuthorized ?
                                <Button color="grass" className=" hover:bg-green-400 mb-10 hover:cursor-pointer" onClick={() => setModalIndicateParticipantsOpen(true)}>
                                    <Icon.PlusCircle size={20}></Icon.PlusCircle>
                                    INDICAR PARTICIPANTES
                                </Button>
                                : <></>}
                            <Callout.Text>
                                <Flex justify="center" gap="1">
                                    Total de participantes:
                                    <Strong>{sample?.participants?.length}</Strong>
                                    (Aguardando <Strong>{(sample?.qttParticipantsAuthorized || 0) - (sample?.participants?.length || 0)
                                    }</Strong> participante(s))
                                </Flex>
                            </Callout.Text>
                        </Skeleton>
                    </Callout.Root>
                    <Skeleton loading={loading}>
                        <ParticipantsRegistrationTable
                            sampleId={sample?._id || ""}
                            data={sample?.participants}
                            // currentPage={currentPage}
                            // setCurrentPage={(newPage) => setCurrentPage(newPage)}
                            onClickToViewSecondSources={handleViewSecondSources}
                            onClickToCopySecondSourceURL={handleSendTextToClipBoard}
                        />

                        <Modal
                            open={modalIndicateParticipantsOpen}
                            setOpen={setModalIndicateParticipantsOpen}
                            title="Indicar participantes"
                            accessibleDescription="Digite o nome e o e-mail de cada participante que deseja indicar e clique no botão ADICIONAR.Em
                    seguida, clique em FINALIZAR para enviar um e-mail a todos os participantes indicados."

                        >

                            <ParticipantsIndicationForm
                                setNotificationData={setNotificationData}
                                sampleId={sample?._id as string}
                                onFinish={handleFinishParticipantIndication}
                            />

                        </Modal>
                    </Skeleton>
                    {/* MODAL TO SHOW SECOND SOURCES */}
                    <Modal
                        open={modalSecondSourcesOpen}
                        setOpen={setModalSecondSourcesOpen}
                        title="Segundas fontes"
                        accessibleDescription="Abaixo estão listadas as informações das segundas fontes do participante."
                    >

                        <Table.Root variant="surface" className="w-full">
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Nome</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Andamento</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Relação</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Data de início</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Data de finalização</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {currentParticipant?.secondSources?.map((secondSource) => (
                                    <Table.Row key={secondSource._id} align="center">
                                        <Table.Cell justify="center">{secondSource.personalData?.fullName}</Table.Cell>
                                        <Table.Cell justify="center">{getFormFillStatus(secondSource)}</Table.Cell>
                                        <Table.Cell justify="center">{secondSource.personalData?.relationship}</Table.Cell>
                                        <Table.Cell justify="center"> {secondSource.adultForm?.startFillFormAt &&
                                            DateTime.fromISO(secondSource.adultForm.startFillFormAt).toFormat(
                                                "dd/LL/yyyy - HH:mm"
                                            )}</Table.Cell>
                                        <Table.Cell justify="center"> {secondSource.adultForm?.endFillFormAt &&
                                            DateTime.fromISO(secondSource.adultForm.endFillFormAt).toFormat(
                                                "dd/LL/yyyy - HH:mm"
                                            )}</Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root>
                    </Modal>

                </Flex>
            </Notify >

        </ >
    );
};

export default ParticipantsRegistration;
