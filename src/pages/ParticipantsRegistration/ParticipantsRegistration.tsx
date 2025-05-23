import ParticipantsRegistrationTable from "../../components/Table/ParticipantsRegistrationTable/ParticipantsRegistrationTable";
import { ReactNode, useEffect, useState } from "react";
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
import { Box, DataList, Flex, IconButton, Separator, Skeleton, Strong, Table, Text, Tooltip } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";
import EmptyState from "../../components/EmptyState/EmptyState";
import SkeletonURLCard from "../../components/Skeletons/SkeletonURLCard";
import SkeletonHeader from "../../components/Skeletons/SkeletonHeader";

const ParticipantsRegistration = () => {
    const [sample, setSample] = useState<ISample>({} as ISample);
    const [modalSecondSourcesOpen, setModalSecondSourcesOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [currentParticipant, setCurrentParticipant] = useState<IParticipant>();
    const [modalIndicateParticipantsOpen, setModalIndicateParticipantsOpen] = useState(false);
    const [notificationData, setNotificationData] = useState({
        title: "",
        description: "",
        type: "",
    });
    const [copied, setCopied] = useState(false);

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


    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(urlParticipantForm);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000); // volta pro ícone original após 2s
        } catch (error) {
            console.error("Erro ao copiar:", error);
        }
    };

    const handleSendTextToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotificationData({
            title: "Link copiado.",
            description: "O link foi copiado para a sua área de transferência.",
            type: "success"
        });
    };



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

    const StatItem = ({ icon, label, value, background }: { icon?: ReactNode; label: string; value: ReactNode; background?: string }) => (
        <Flex align="center" gap="2" className={`${background} p-2 px-4 rounded-lg`} >
            {icon && <span className="text-primary-600">{icon}</span>}
            <Text size="2" weight="medium" className="text-gray-600">{label}:</Text>
            <Text size="2" weight="bold" className="text-gray-900">{value}</Text>
        </Flex>
    );




    return (
        <>
            <Notify
                open={!!notificationData.title}
                onOpenChange={() => setNotificationData({ title: "", description: "", type: "" })}
                title={notificationData.title}
                description={notificationData.description}
                icon={notificationData.type === "erro" ? <Icon.XCircle size={30} color="white" weight="bold" /> : notificationData.type === "aviso" ? <Icon.WarningCircle size={30} color="white" weight="bold" /> : <Icon.CheckCircle size={30} color="white" weight="bold" />}
                className={notificationData.type === "erro" ? "bg-red-500" : notificationData.type === "aviso" ? "bg-yellow-400" : notificationData.type === "success" ? "bg-green-500" : ""}
            >


                {loading ? (
                    <SkeletonHeader />
                ) : (
                    <>
                        <header className="pt-8 pb-6 border-b border-gray-200 mb-8">
                            <h2 className="heading-2 font-semibold text-gray-900">
                                Gerenciamento de Participantes
                            </h2>
                            <p className="text-lg text-gray-600">
                                Amostra: <Strong className="text-primary-600 !font-roboto">{sample?.sampleGroup}</Strong>
                            </p>
                        </header>
                    </>)
                }

                <div className="card-container p-5 ">
                    {loading ? (
                        <SkeletonURLCard />
                    ) : (
                        <Flex direction="column" gap="4">
                            <Flex align="center" gap="2">
                                <Icon.Info size={24} className="text-primary-600" />
                                <Text size="5" weight="bold">URL de Cadastro</Text>
                            </Flex>

                            <Flex align="center" gap="3" className={`${copied ? "bg-confirm" : "bg-violet-200"} p-3 rounded`}>
                                <Text className="text-ellipsis overflow-hidden whitespace-nowrap flex-1 bg-gray-50 rounded p-2">
                                    {urlParticipantForm}
                                </Text>
                                <Tooltip content="Copiar URL">
                                    <IconButton
                                        variant="soft"
                                        onClick={() => {
                                            handleCopy();
                                            handleSendTextToClipBoard(urlParticipantForm)
                                        }}
                                        className="transition-transform duration-150 active:scale-90"
                                    >
                                        <div className="relative w-[20px] h-[20px]">
                                            <Icon.Copy
                                                className={`absolute inset-0 transition-opacity duration-300 ${copied ? "opacity-0" : "opacity-100"}`}
                                                width={20}
                                                height={20}
                                            />

                                            {/* Ícone de check */}
                                            <Icon.Check
                                                className={`absolute inset-0  transition-opacity duration-300 ${copied ? "opacity-100" : "opacity-0"}`}
                                                width={20}
                                                height={20}
                                            />
                                        </div>
                                    </IconButton>
                                </Tooltip>
                            </Flex>

                            <Separator size="4" />

                            {/* Estatísticas com Layout Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <StatItem
                                    icon={<Icon.Users size={20} />}
                                    label="Total Permitido"
                                    value={sample?.qttParticipantsAuthorized}
                                    background={"bg-violet-200"}
                                />
                                <StatItem
                                    icon={<Icon.UserPlus size={20} />}
                                    label="Cadastrados"
                                    value={sample?.participants?.length}
                                    background={"bg-green-200"}
                                />
                                <StatItem
                                    icon={<Icon.Clock size={20} />}
                                    label="Pendentes"
                                    value={(sample?.qttParticipantsAuthorized || 0) - (sample?.participants?.length || 0)} background={"bg-amber-200"} />
                                {sample?.participants?.length !== sample?.qttParticipantsAuthorized && (
                                    <Button

                                        size="Large"

                                        className="w-full md:w-auto bg-am"
                                        children={<Icon.PlusCircle size={20} />}
                                        onClick={() => setModalIndicateParticipantsOpen(true)} title={"Adicionar Participantes"} color={"green"}                                >


                                    </Button>
                                )}
                            </div>


                        </Flex>
                    )}
                </div>

                <div className="card-container-border-variante">
                    <ParticipantsRegistrationTable
                        sampleId={sample?._id || ""}
                        data={sample?.participants}
                        onClickToViewSecondSources={handleViewSecondSources}
                        onClickToCopySecondSourceURL={handleSendTextToClipBoard}
                    />
                </div>


                <Modal
                    open={modalIndicateParticipantsOpen}
                    setOpen={setModalIndicateParticipantsOpen}
                    title={"Indicar Novos Participantes"} accessibleDescription={""}
                >
                    <ParticipantsIndicationForm
                        setNotificationData={setNotificationData}
                        sampleId={sample?._id as string}
                        onFinish={handleFinishParticipantIndication}
                    />
                </Modal>

                {/* Modal de Segundas Fontes Aprimorado */}
                <Modal
                    open={modalSecondSourcesOpen}
                    setOpen={setModalSecondSourcesOpen}
                    title="Segundas Fontes" accessibleDescription={""}                    >
                    {currentParticipant?.secondSources?.length ? (
                        <>

                            <Table.Root className="hidden md:table">
                                <Table.Header className="bg-gray-50">
                                    <Table.Row>
                                        {["Nome", "Status", "Relação", "Início", "Término"].map((header) => (
                                            <Table.ColumnHeaderCell key={header} className="font-semibold">
                                                {header}
                                            </Table.ColumnHeaderCell>
                                        ))}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {currentParticipant.secondSources.map((secondSource) => (
                                        <Table.Row key={secondSource._id} className="hover:bg-gray-50" align="center">
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

                            {/* Cards Mobile */}
                            <div className="mobo">
                                <DataList.Root orientation={"vertical"} className="!font-roboto " >
                                    <DataList.Item >
                                        <p className="text-[16px] font-bold text-center  border-b-black">Informações do participante Segunda fonte</p>
                                        {currentParticipant?.secondSources?.map((secondSource) => (
                                            <div className="w-full p-2 rounded-lg card-container mb-5 " key={secondSource._id}>


                                                <DataList.Label minWidth="88px" >Nome</DataList.Label>

                                                <DataList.Value >{secondSource.personalData?.fullName}</DataList.Value>
                                                <Separator size={"4"} className="mb-2 mt-2" />
                                                <DataList.Label minWidth="88px">Andamento</DataList.Label>

                                                <DataList.Value >
                                                    {getFormFillStatus(secondSource)}
                                                </DataList.Value>
                                                <Separator size={"4"} className="mb-2 mt-2" />
                                                <DataList.Label minWidth="88px">Relação</DataList.Label>

                                                <DataList.Value >
                                                    {secondSource.personalData?.relationship}
                                                </DataList.Value>
                                                <Separator size={"4"} className="mb-2 mt-2" />
                                                <DataList.Label minWidth="88px">Data de início</DataList.Label>

                                                <DataList.Value >
                                                    {secondSource.adultForm?.startFillFormAt
                                                        ? DateTime.fromISO(secondSource.adultForm.startFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                        : "Não iniciado"}
                                                </DataList.Value>
                                                <Separator size={"4"} className="mb-2 mt-2" />
                                                <DataList.Label minWidth="88px">Data de finalização</DataList.Label>

                                                <DataList.Value >
                                                    {secondSource.adultForm?.endFillFormAt
                                                        ? DateTime.fromISO(secondSource.adultForm.endFillFormAt).toFormat("dd/LL/yyyy - HH:mm")
                                                        : "Não iniciado"}
                                                </DataList.Value>
                                            </div>
                                        ))}
                                    </DataList.Item>

                                </DataList.Root>


                            </div>
                        </>
                    ) : (
                        <EmptyState
                            icon={<Icon.UserGear size={40} />}
                            title="Nenhuma segunda fonte encontrada!"
                            description="Adicione segundas fontes através do formulário do participante."
                        />
                    )}
                </Modal>
            </Notify >

        </ >
    );
};

export default ParticipantsRegistration;
