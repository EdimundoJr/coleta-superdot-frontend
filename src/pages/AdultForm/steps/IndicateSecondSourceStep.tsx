import { Cross2Icon } from "@radix-ui/react-icons";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../../components/InputField/InputField";
import { FormEvent, useState } from "react";
import { Relationships } from "../../../utils/consts.utils";
import isEmail from "validator/lib/isEmail";
import { AxiosError } from "axios";
import { putSaveSecondSources } from "../../../api/participant.api";
import { IParticipant } from "../../../interfaces/participant.interface";
import { Flex, Select } from "@radix-ui/themes";
import { Button } from "../../../components/Button/Button";

interface IndicateSecondSourceStepProps {
    formData: IParticipant;
    setFormData: (data: IParticipant) => void;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string; type: String }) => void;
    sampleId: string;
    saveAndExit: () => void;
    previousStep: () => void;
}

/*
 * In this step, the participant will indicate the second sources to fill out the
 * Second Source Adult Form.
 */
const IndicateSecondSourceStep = ({
    formData,
    setFormData,
    nextStep,
    sampleId,
    saveAndExit,
    previousStep,
    setNotificationData,
}: IndicateSecondSourceStepProps) => {
    const [relationship, setRelationship] = useState<Relationships>(Relationships.FRIEND);
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [teacherSubject, setTeacherSubject] = useState("");

    const validateFields = () => {
        if (!fullName.length || !email.length) {
            setNotificationData({
                title: "Campos vazios!",
                description: "Por favor, preencha todos os campos.",
                type: "erro"
            });
            return false;
        }

        if (relationship === Relationships.TEACHER && !teacherSubject.length) {
            setNotificationData({
                title: "Indique a matéria!",
                description: "É necessário indicar a matéria ministrada pelo professor.",
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

    /**
     * The function `handleAddPeople` is used to add a person to a list of second sources, with
     * validation and notification handling.
     * @param [e] - The parameter `e` is an optional parameter of type `FormEvent<HTMLFormElement>`. It
     * represents the event object that is triggered when the form is submitted.
     * @returns The function `handleAddPeople` returns nothing (`void`).
     */
    const handleAddPeople = (e?: FormEvent<HTMLFormElement>) => {
        if (!formData) return;
        e?.preventDefault();
        if (!validateFields()) {
            return;
        }

        const personAlreadyAdded = formData?.secondSources?.find((people) => people.personalData?.email === email);
        if (personAlreadyAdded) {
            setNotificationData({
                title: "Pessoa já indicada!",
                description: "Você já indicou essa pessoa, não é possível indicar novamente.",
                type: "erro"
            });
            return;
        }

        // Already has members in this array
        if (formData?.secondSources?.length) {
            setFormData({
                ...formData,
                secondSources: [
                    ...formData.secondSources,
                    {
                        personalData: {
                            relationship,
                            fullName,
                            email,
                        },
                        teacherSubject,
                    },
                ],
            });
        } else {
            // First member of this array
            setFormData({
                ...formData,
                secondSources: [
                    {
                        personalData: {
                            relationship,
                            fullName,
                            email,
                        },
                        teacherSubject,
                    },
                ],
            });
        }

        setRelationship(Relationships.FRIEND);
        // Reset fields
        setFullName("");
        setEmail("");
        setTeacherSubject("");
        setNotificationData({
            title: "Pessoa indicada com sucesso!",
            description: "Ao finalizar essa etapa, a pessoa receberá um e-mail informativo.",
            type: "ok"
        });
    };

    /**
     * The function `handleDeleteSourceIndicated` removes a person from a list of second sources and
     * updates the notification data.
     * @param {string} sourceEmail - The sourceEmail parameter is a string that represents the email of
     * the source to be deleted.
     */
    const handleDeleteSourceIndicated = (sourceEmail: string) => {
        const sourceCleaned = formData.secondSources?.filter((people) => people.personalData?.email !== sourceEmail);
        setFormData({ ...formData, secondSources: sourceCleaned });
        setNotificationData({
            title: "Pessoa removida!",
            description: "A pessoa foi removida das indicações.",
            type: "ok"
        });
    };

    /**
     * The `onSubmit` function is an asynchronous function that handles the submission of second
     * sources data, sends a request to save the data, and handles any errors that may occur.
     * @returns The function `onSubmit` returns nothing.
     */
    const onSubmit = async (exit?: boolean) => {
        if (!formData.secondSources?.length) return;

        try {
            const response = await putSaveSecondSources({ sampleId, secondSources: formData.secondSources });
            if (response.status === 200) {
                setNotificationData({
                    title: "Indicações concluídas.",
                    description: "As indicações foram registradas e os e-mails foram enviados.",
                    type: "ok"
                });
                if (exit) {
                    saveAndExit();
                } else {
                    nextStep();
                }
            }
        } catch (err: any) {
            console.error(err);
            if (err instanceof AxiosError) {
                if (err.response?.status === 409) {
                    setNotificationData({
                        title: "E-mail em uso.",
                        description: "Esse e-mail já está sendo utilizado.",
                        type: "erro"
                    });
                } else {
                    setNotificationData({
                        title: "Erro no servidor.",
                        description:
                            "Ocorreu um erro ao tentar salvar as inforamções, contate o responsável pela pesquisa ou os responsáveis pela plataforma.",
                        type: "erro"
                    });
                }
            }
        }
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
                    Para fazer a indicação, informe abaixo o nome e o e-mail de quantos pessoas quiser. Essas pessoas
                    irão receber uma notificação por e-mail informando que foram indicadas por você e receberão um link
                    responder o formulário de segunda fonte.
                </p>
            </section>
            <section>
                <Form.Root onSubmit={handleAddPeople}>
                    <div className="md:flex">
                        <Form.Field className="mb-6 w-full px-3" name="relationType">
                            <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide">
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
                            {/* <select
                                className="h-[35px] w-full rounded-[4px] px-4 text-sm "
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value as Relationships)}
                            >
                                <option>Amigo</option>
                                <option>Parente</option>
                                <option>Professor</option>
                            </select> */}
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
                        <Button size="Extra Small" title={"Adicionar"} color={"primary"} className="m-auto" />
                    </Form.Submit>
                </Form.Root>
                {(formData.secondSources?.length || 0) > 0 && (
                    <table className="my-4 w-full ">
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
                            {formData.secondSources?.map((people) => (
                                <tr>
                                    <td>{people.personalData?.relationship}</td>
                                    <td>{people.personalData?.fullName}</td>
                                    <td>{people.personalData?.email}</td>
                                    <td>{people.teacherSubject}</td>
                                    <td>
                                        <Cross2Icon
                                            className="mx-auto cursor-pointer"
                                            onClick={() =>
                                                handleDeleteSourceIndicated(people.personalData?.email as string)
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </section>

            <Flex align={"center"} justify={"center"} className="gap-6">
                <Button size="Medium" onClick={previousStep} title={"Voltar"} color={"primary"}>

                </Button>
                <Button
                    size="Medium" onClick={() => onSubmit(true)} title={"Salvar e sair"} color={"primary"}>

                </Button>
                <Button
                    size="Medium"
                    className=" disabled:bg-neutral-dark disabled:hover:cursor-not-allowed"
                    disabled={!formData.secondSources?.length}
                    onClick={() => onSubmit()} title={"Salvar e continuar"} color={"primary"}                    >

                </Button>

            </Flex>
        </div>
    );
};

export default IndicateSecondSourceStep;
