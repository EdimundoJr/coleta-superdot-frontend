import * as Form from "@radix-ui/react-form";
import { FormEvent, useState } from "react";
import { InputField } from "../InputField/InputField";
import isEmail from "validator/lib/isEmail";
import { DeepPartial } from "react-hook-form";
import { IParticipant } from "../../interfaces/participant.interface";
import { postAddParticipants } from "../../api/sample.api";
import { DataList, IconButton, Separator, Table } from "@radix-ui/themes";
import * as  Icon from "@phosphor-icons/react";
import { Button } from "../Button/Button";


interface ParticipantsIndicationFormProps {
    setNotificationData: (data: { title: string; description: string; type: string }) => void;
    onFinish: (participants: IParticipant[]) => void;
    sampleId: string;
}

const ParticipantsIndicationForm = ({ setNotificationData, onFinish, sampleId }: ParticipantsIndicationFormProps) => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [participants, setParticipants] = useState([] as DeepPartial<IParticipant>[]);

    const validateFields = () => {
        if (!fullName.length || !email.length) {
            setNotificationData({
                title: "Campos vazios!",
                description: "Por favor, preencha todos os campos.",
                type: "erro"
            });
            return false;
        }

        if (!isEmail(email)) {
            setNotificationData({
                title: "E-mail inválido!",
                description: "É necessário informar um e-mail válido.",
                type: "erro"
            });
            return false;
        }

        return true;
    };

    const handleAddPeople = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!validateFields()) {
            return;
        }

        const personAlreadyAdded = participants?.find((people) => people?.personalData?.email === email);
        if (personAlreadyAdded) {
            setNotificationData({
                title: "Pessoa já indicada!",
                description: "Você já indicou essa pessoa, não é possível indicar novamente.",
                type: "erro"
            });
            return;
        }

        participants?.push({
            personalData: {
                fullName,
                email,

            },
            addressData: {
                state: "bahia",
            },

        });

        setFullName("");
        setEmail("");
        setNotificationData({
            title: "Pessoa indicada com sucesso!",
            description: "Ao clicar no botão FINALIZAR, a pessoa receberá um e-mail informativo.",
            type: "success"
        });
    };

    const handleDeleteParticipantIndicated = (email: string) => {
        const arrCleaned = participants?.filter((people) => people?.personalData?.email !== email);
        setParticipants(arrCleaned);
        setNotificationData({
            title: "Pessoa removida!",
            description: "A pessoa foi removida das indicações.",
            type: "success"
        });
    };

    const onSubmit = async () => {
        try {
            const response = await postAddParticipants({ sampleId, participants });
            if (response.status === 201) {
                setNotificationData({
                    title: "Indicações concluídas.",
                    description: "Obrigado por indicar os participantes. As indicações foram registradas.",
                    type: "success"
                });
                onFinish(participants as IParticipant[]);
            }
        } catch (err: any) {
            console.error(err);
            setNotificationData({
                title: "Participante já registrado!",
                description: "Todos os participantes que você indicou já estão cadastrados na amostra.",
                type: "erro"
            });
        }
    };

    return (
        <>
            <Form.Root onSubmit={handleAddPeople}>
                <div className="md:flex gap-2">
                    <InputField
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        label="Nome completo"
                        placeholder="Informe o nome do participante"
                    />
                    <InputField
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="E-mail"
                        type="email"
                        placeholder="Informe o e-mail do participante"
                    />
                </div>
                {(participants?.length || 0) > 0 && (
                    <>
                        <Table.Root variant="surface" className="w-full mt-3 desktop">
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Nome</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">E-mail</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Remover indicação</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {participants?.map((people) => (
                                    <Table.Row align="center">
                                        <Table.Cell justify="center">{people?.personalData?.fullName}</Table.Cell>
                                        <Table.Cell justify="center">{people?.personalData?.email}</Table.Cell>
                                        <Table.Cell justify="center">
                                            <IconButton
                                                onClick={() => handleDeleteParticipantIndicated(people?.personalData?.email as string)}
                                                color="red"
                                                size="2"
                                                className="hover:cursor-pointer"
                                                variant="soft"
                                                radius="full">
                                                <Icon.Trash
                                                    size={20}
                                                    weight="bold"
                                                />

                                            </IconButton>

                                        </Table.Cell>
                                    </Table.Row>

                                ))}
                            </Table.Body>
                        </Table.Root>
                        <div className="mobo ">
                            <DataList.Root orientation={"vertical"} className="!font-roboto"  >
                                <DataList.Item >
                                    <p className="text-[16px] font-bold text-center  border-b-black mt-5">Informações do participante</p>
                                    {participants?.map((participant) => (
                                        <div className="w-full p-2 rounded-lg mb-5 border-2 card-container" key={participant._id}>

                                            <DataList.Label minWidth="88px" >Nome</DataList.Label>

                                            <DataList.Value >{participant?.personalData?.fullName}</DataList.Value>
                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label minWidth="88px">E-mail</DataList.Label>

                                            <DataList.Value >
                                                {participant?.personalData?.email}
                                            </DataList.Value>
                                            <Separator size={"4"} className="mb-2 mt-2" />

                                            <DataList.Label color="red"
                                                onClick={() => handleDeleteParticipantIndicated(participant?.personalData?.email as string)} minWidth="88px" className="flex   justify-center mb-2 border border-red-300 cursor-pointer hover:bg-red-100 rounded-md">
                                                Remover</DataList.Label>

                                        </div>
                                    ))}
                                </DataList.Item>

                            </DataList.Root>
                        </div>
                    </>
                )}
                <div className="flex justify-between mt-5 gap-2">
                    <Form.Submit asChild>
                        <Button size="Small" className="hover:cursor-pointer" title={`Adicionar`} color={"primary"}
                            children={<Icon.PlusCircle size={18} weight="bold" />}
                        ></Button>
                    </Form.Submit>
                    <Button
                        size="Small"
                        className={`disabled:hover:cursor-not-allowed`}
                        color={participants.length ? "green" : "white"}
                        disabled={!participants.length}
                        onClick={onSubmit}
                        title={"Salvar alterações"} children={<Icon.FloppyDisk size={18} weight="bold" />}                   >

                    </Button>
                </div>
            </Form.Root>
        </>
    );
};

export default ParticipantsIndicationForm;
