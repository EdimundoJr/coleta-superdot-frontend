import * as Form from "@radix-ui/react-form";
import { FormEvent, useState } from "react";
import { InputField } from "../InputField/InputField";
import isEmail from "validator/lib/isEmail";
import { Cross2Icon } from "@radix-ui/react-icons";
import { DeepPartial } from "react-hook-form";
import { IParticipant } from "../../interfaces/participant.interface";
import { postAddParticipants } from "../../api/sample.api";

interface ParticipantsIndicationFormProps {
    setNotificationData: (data: { title: string; description: string }) => void;
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
            });
            return false;
        }

        if (!isEmail(email)) {
            setNotificationData({
                title: "E-mail inválido!",
                description: "É necessário informar um e-mail válido.",
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
            });
            return;
        }

        participants?.push({
            personalData: {
                fullName,
                email,
            },
        });

        setFullName("");
        setEmail("");
        setNotificationData({
            title: "Pessoa indicada com sucesso!",
            description: "Ao clicar no botão FINALIZAR, a pessoa receberá um e-mail informativo.",
        });
    };

    const handleDeleteParticipantIndicated = (email: string) => {
        const arrCleaned = participants?.filter((people) => people?.personalData?.email !== email);
        setParticipants(arrCleaned);
        setNotificationData({
            title: "Pessoa removida!",
            description: "A pessoa foi removida das indicações.",
        });
    };

    const onSubmit = async () => {
        try {
            const response = await postAddParticipants({ sampleId, participants });
            if (response.status === 201) {
                setNotificationData({
                    title: "Indicações concluídas.",
                    description: "As indicações foram registradas e os e-mails foram enviados.",
                });
                onFinish(participants as IParticipant[]);
            }
        } catch (err: any) {
            console.error(err);
            setNotificationData({
                title: "Participante já registrado!",
                description: "Todos os participantes que você indicou já estão cadastrados na amostra.",
            });
        }
    };

    return (
        <>
            <p className="mb-10">
                Digite o nome e o e-mail de cada participante que deseja indicar e clique no botão ADICIONAR. Em
                seguida, clique em FINALIZAR para enviar um e-mail a todos os participantes indicados.
            </p>
            <Form.Root onSubmit={handleAddPeople}>
                <div className="md:flex">
                    <InputField
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        label="Nome completo"
                        placeholder="Informe o nome da pessoa"
                    />
                    <InputField
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        label="E-mail"
                        type="email"
                        placeholder="Informe o e-mail da pessoa"
                    />
                </div>
                {(participants?.length || 0) > 0 && (
                    <table className="bg-dark-gradient my-4 w-full border-collapse rounded-md text-white">
                        <thead>
                            <tr>
                                <th>Nome</th>
                                <th>E-mail</th>
                                <th>Remover indicação</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white text-primary">
                            {participants?.map((people) => (
                                <tr>
                                    <td>{people?.personalData?.fullName}</td>
                                    <td>{people?.personalData?.email}</td>
                                    <td>
                                        <Cross2Icon
                                            className="mx-auto cursor-pointer"
                                            onClick={() =>
                                                handleDeleteParticipantIndicated(people?.personalData?.email as string)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
                <div className="flex justify-between">
                    <Form.Submit asChild>
                        <button className="button-secondary">ADICIONAR</button>
                    </Form.Submit>
                    <button
                        disabled={!participants.length}
                        className="button-primary disabled:bg-opacity-30 disabled:hover:bg-none"
                        onClick={onSubmit}
                    >
                        FINALIZAR
                    </button>
                </div>
            </Form.Root>
        </>
    );
};

export default ParticipantsIndicationForm;
