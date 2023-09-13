import { CopyIcon, Cross2Icon } from "@radix-ui/react-icons";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../../components/InputField/InputField";
import { FormEvent, useState } from "react";
import { Relationships } from "../../../utils/consts.utils";
import isEmail from "validator/lib/isEmail";
import { postIndicateSecondSources } from "../../../api/participant.api";
import { AxiosError } from "axios";
import { ISecondSource } from "../../../interfaces/secondSource.interface";
import { deserializeJWTParticipantToken } from "../../../utils/tokensHandler";

interface IndicateSecondSourceStepProps {
    nextStep: () => void;
    setNotificationTitle: (title: string) => void;
    setNotificationDescription: (description: string) => void;
    sampleId: string;
}

const IndicateSecondSourceStep = ({
    nextStep,
    setNotificationTitle,
    setNotificationDescription,
    sampleId,
}: IndicateSecondSourceStepProps) => {
    const [peopleIndicateds, setPeopleIndicateds] = useState<ISecondSource[]>([]);

    const [relationship, setRelationship] = useState<Relationships>(Relationships.FRIEND);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [teacherSubject, setTeacherSubject] = useState("");

    let participantId: string | undefined;
    try {
        participantId = deserializeJWTParticipantToken().participantId;
    } catch (e) {
        setNotificationTitle("Sessão expirada!");
        setNotificationDescription("Por favor, recarregue a página.");
    }

    const validateFields = () => {
        if (!fullName || !email) {
            setNotificationTitle("Campos vazios!");
            setNotificationDescription("Por favor, preencha todos os campos.");
            return false;
        }

        if (relationship === Relationships.TEACHER && !teacherSubject) {
            setNotificationTitle("Indique a matéria!");
            setNotificationDescription("É necessário indicar a matéria ministrada pelo professor.");
            return false;
        }

        if (!isEmail(email)) {
            setNotificationTitle("E-mail inválido!");
            setNotificationDescription("É necessário informar um e-mail válido.");
            return false;
        }

        return true;
    };

    const handleAddPeople = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (!validateFields()) {
            return;
        }

        const peopleAlreadyAdded = peopleIndicateds.find((people) => people.personalData.email === email);
        if (peopleAlreadyAdded) {
            setNotificationTitle("Pessoa já indicada!");
            setNotificationDescription("Você já indicou essa pessoa, não é possível indicar novamente.");
            return;
        }

        setPeopleIndicateds([
            ...peopleIndicateds,
            {
                personalData: {
                    relationship,
                    fullName,
                    email,
                },
                teacherSubject,
            },
        ]);
        setRelationship(Relationships.FRIEND);
        setFullName("");
        setEmail("");
        setTeacherSubject("");
        setNotificationTitle("Pessoa indicada com sucesso!");
        setNotificationDescription("Ao finalizar essa etapa, a pessoa receberá um e-mail informativo.");
    };

    const handleDeleteSourceIndicated = (sourceEmail: string) => {
        const sourceCleaned = peopleIndicateds.filter((people) => people.personalData.email !== sourceEmail);
        setPeopleIndicateds(sourceCleaned);
        setNotificationTitle("Pessoa removida!");
        setNotificationDescription("A pessoa foi removida das indicações.");
    };

    const onSubmit = async () => {
        try {
            const response = await postIndicateSecondSources(sampleId, peopleIndicateds);
            if (response.status === 200) {
                setNotificationTitle("Indicações concluídas.");
                setNotificationDescription("As indicações foram registradas e os e-mails foram enviados.");
                nextStep();
            }
        } catch (err: any) {
            console.error(err);
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    setNotificationTitle("E-mail em uso.");
                    setNotificationDescription("Esse e-mail já está sendo utilizado.");
                } else {
                    setNotificationTitle("Erro no servidor.");
                    setNotificationDescription(
                        "Ocorreu um erro ao tentar salvar as inforamções, contate o responsável pela pesquisa ou os responsáveis pela plataforma."
                    );
                }
            }
        }
    };

    const urlSecondSource = `${
        import.meta.env.VITE_FRONTEND_URL
    }/formulario-adulto-segunda-fonte/${sampleId}/${participantId}`;

    const handleSendTextToClipBoard = (text: string) => {
        navigator.clipboard.writeText(text);
        setNotificationTitle("Link copiado.");
        setNotificationDescription("O link foi copiado para a sua área de transferência.");
    };

    return (
        <div className="grid gap-y-10">
            <header>
                <h1>Indicar pessoas para preencher o formulário de segunda fonte</h1>
                <h3>Leia as instruções abaixo.</h3>
            </header>
            <section className="my-2 w-full bg-white p-4 text-black ">
                <p>
                    O formulário de segunda fonte deve ser respondido por pessoas que sejam próximas a você. O ideal é
                    que essas pessoas te conheçam a, no mínimo, dois anos.
                </p>
                <p>
                    As respostas das segundas fontes ajudará o pesquisador a efetuar uma avaliação mais precisa sobre
                    você. Sendo assim, indique o maior número de pessoas que voce puder, sempre tendo o cuidado de
                    indicar pessoas que realmente te conhecem, pois isso evitará uma distorção na avaliação.
                </p>
            </section>
            <section className="my-2 w-full bg-white p-4 text-black">
                <p>
                    Para fazer a indicação, você pode compartilhar a URL abaixo com as pessoas que irão preencher o
                    formulário.
                </p>
                <h3 className="flex items-center justify-center gap-x-2">
                    {urlSecondSource}{" "}
                    <CopyIcon className="cursor-pointer" onClick={() => handleSendTextToClipBoard(urlSecondSource)} />
                </h3>
            </section>
            <section className="my-2 w-full bg-white p-4 text-black">
                <p>
                    Além disso, também precisamos que você informe o nome e o e-mail de pelo menos uma pessoa. Essa
                    pessoa irá receber uma notificação por e-mail informando que foi indicada por você e que precisa
                    responder o formulário de segunda fonte.
                </p>
            </section>
            <section>
                <Form.Root onSubmit={handleAddPeople}>
                    <div className="md:flex">
                        <Form.Field className="mb-6 w-full px-3" name="relationType">
                            <Form.Label className="mb-2 block text-left text-xs font-bold uppercase tracking-wide">
                                Tipo de relação
                            </Form.Label>
                            <select
                                className="h-[35px] w-full rounded-[4px] px-4 text-sm "
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value as Relationships)}
                            >
                                <option>Amigo</option>
                                <option>Parente</option>
                                <option>Professor</option>
                            </select>
                        </Form.Field>
                        <InputField
                            name="fullName"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            label="Nome completo"
                            placeholder="Informe o nome da pessoa"
                        />
                    </div>
                    <div className="md:flex">
                        <InputField
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="E-mail"
                            type="email"
                            placeholder="Informe o e-mail da pessoa"
                        />
                        {relationship === Relationships.TEACHER && (
                            <InputField
                                name="teacherSubject"
                                value={teacherSubject}
                                onChange={(e) => setTeacherSubject(e.target.value)}
                                label="Matéria"
                                placeholder="Informe a matéria ministrada pelo professor"
                            />
                        )}
                    </div>
                    <Form.Submit asChild>
                        <button className="button-primary">Adicionar</button>
                    </Form.Submit>
                </Form.Root>
                {peopleIndicateds.length > 0 && (
                    <table className="my-4 w-full border-collapse bg-white text-black">
                        <thead>
                            <tr>
                                <th>Tipo de relação</th>
                                <th>Nome completo</th>
                                <th>E-mail</th>
                                <th>Matéria</th>
                                <th>Remover segunda fonte</th>
                            </tr>
                        </thead>
                        <tbody>
                            {peopleIndicateds.map((people) => (
                                <tr>
                                    <td>{people.personalData.relationship}</td>
                                    <td>{people.personalData.fullName}</td>
                                    <td>{people.personalData.email}</td>
                                    <td>{people.teacherSubject}</td>
                                    <td>
                                        <Cross2Icon
                                            className="mx-auto cursor-pointer"
                                            onClick={() => handleDeleteSourceIndicated(people.personalData.email)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>
            <button onClick={onSubmit} disabled={!peopleIndicateds.length} className="button-primary mx-auto w-1/2">
                Continuar
            </button>
        </div>
    );
};

export default IndicateSecondSourceStep;
