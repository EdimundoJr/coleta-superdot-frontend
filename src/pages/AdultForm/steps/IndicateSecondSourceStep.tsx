import { Cross2Icon } from "@radix-ui/react-icons";
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../../components/InputField/InputField";
import { FormEvent, useState } from "react";
import { Relationships } from "../../../utils/consts.utils";
import isEmail from "validator/lib/isEmail";
import { AxiosError } from "axios";
import { putSaveSecondSources } from "../../../api/participant.api";
import { IParticipant } from "../../../interfaces/participant.interface";
import { DataList, Flex, Separator, Table, Text } from "@radix-ui/themes";
import { Button } from "../../../components/Button/Button";

interface IndicateSecondSourceStepProps {
    formData: IParticipant;
    setFormData: (data: IParticipant) => void;
    nextStep: () => void;
    setNotificationData: (data: { title: string; description: string; type: string }) => void;
    sampleId: string;
    saveAndExit: () => void;
    previousStep: () => void;
    header: string;
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
    header,
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
            type: "success"
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
            type: "success"
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
                    type: "success"
                });
                if (exit) {
                    saveAndExit();
                } else {
                    nextStep();
                    window.scrollTo(0, 0);
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
        <Flex direction="column" className="bg-off-white p-5 font-roboto text-slate-950 rounded-2xl w-[100%] gap-y-5 m-auto max-sm:p-0">
            <header className="text-primary">
                <h3 className="text-xl max-sm:text-lg md:text-xl lg:text-2xl font-bold">
                    {header}
                </h3>

            </header>

            <section className="my-2 w-full  text-black ">
                <p className="leading-none text-justify max-md:text-[14px]" >
                    O formulário de segunda fonte deve ser respondido por pessoas que sejam próximas a você. O ideal é
                    que essas pessoas te conheçam a, no mínimo, dois anos.

                    As respostas das segundas fontes ajudará o pesquisador a efetuar uma avaliação mais precisa sobre
                    você. Sendo assim, indique o maior número de pessoas que voce puder, sempre tendo o cuidado de
                    indicar pessoas que realmente te conhecem, pois isso evitará uma distorção na avaliação.

                    Para fazer a indicação, informe abaixo o nome e o e-mail de quantos pessoas quiser. Essas pessoas
                    irão receber uma notificação por e-mail informando que foram indicadas por você e receberão um link
                    responder o formulário de segunda fonte.
                </p>
            </section>
            <section>
                <Form.Root onSubmit={handleAddPeople} className="mb-5">
                    <div className="flex flex-col gap-5">
                        <Form.Field className="mb-6 w-full " name="relationType">
                            <Form.Label className="block text-left text-xs font-bold uppercase tracking-wide">
                                Tipo de relação
                            </Form.Label>
                            <select
                                className="h-[40px] w-full rounded-[4px] px-4 text-sm"
                                value={relationship}
                                onChange={(e) => setRelationship(e.target.value as Relationships)}
                            >
                                <option>Amigo</option>
                                <option>Parente</option>
                                <option>{Relationships.TEACHER}</option>
                            </select>

                        </Form.Field>
                        <InputField
                            name="fullName"
                            className="mb-2"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            label="Nome completo"
                            placeholder="Informe o nome da pessoa"
                        />
                        <InputField
                            name="email"
                            className="mb-2 "
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            label="E-mail"
                            type="email"
                            placeholder="Informe o e-mail da pessoa"
                        />

                        <InputField
                            name="teacherSubject"
                            className={`${relationship === Relationships.TEACHER ? "" : "invisible"} mb-2 `}
                            value={teacherSubject}
                            onChange={(e) => setTeacherSubject(e.target.value)}
                            label="Matéria"
                            placeholder="Informe a matéria ministrada pelo professor"
                        />

                    </div>

                    <Form.Submit asChild className="mt-5">
                        <Button size="Extra Small" title={"Adicionar"} color={"green"} className="m-auto" />
                    </Form.Submit>
                </Form.Root>
                {(formData.secondSources?.length || 0) > 0 && (
                    <>
                        {/* <Table.Root variant="surface" className="w-full overflow-x-visible truncate drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] mt-4 max-lg:hidden">
                            <Table.Header className="text-[16px]">
                                <Table.Row align="center" className="text-center">
                                    <Table.ColumnHeaderCell className="border-l">Tipo de relação Mobo</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Nome completo</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">E-mail</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Matéria</Table.ColumnHeaderCell>
                                    <Table.ColumnHeaderCell className="border-l">Remover</Table.ColumnHeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {formData.secondSources?.map((people) => (
                                    <Table.Row key={people.personalData?.email}>
                                        <Table.Cell className="border-l">{people.personalData?.relationship}</Table.Cell>
                                        <Table.Cell className="border-l">{people.personalData?.fullName}</Table.Cell>
                                        <Table.Cell className="border-l">{people.personalData?.email}</Table.Cell>
                                        <Table.Cell className="border-l">{people.teacherSubject}</Table.Cell>
                                        <Table.Cell className="border-l text-center align-middle">
                                            <Flex align={"center"} justify={"center"}>
                                                <Cross2Icon
                                                    className="cursor-pointer"
                                                    color="red"
                                                    onClick={() => people.personalData?.email && handleDeleteSourceIndicated(people.personalData.email)}
                                                />
                                            </Flex>
                                        </Table.Cell>
                                    </Table.Row>
                                ))}
                            </Table.Body>
                        </Table.Root> */}
                        <div className="">
                            <DataList.Root orientation={"vertical"} className="!font-roboto"  >

                                {formData.secondSources?.map((people) => (
                                    <DataList.Item className="w-full p-3 rounded-lg mb-5 card-container" key={people.personalData?.email}>

                                        <p className="text-[16px] font-bold text-center">Informações do participante (SF) </p>
                                        <DataList.Label minWidth="88px" >Tipo de relação</DataList.Label>

                                        <DataList.Value >{people.personalData?.relationship}</DataList.Value>
                                        <Separator size={"4"} className="" />

                                        <DataList.Label minWidth="88px">Nome</DataList.Label>

                                        <DataList.Value >{people.personalData?.fullName}</DataList.Value>
                                        <Separator size={"4"} className="" />

                                        <DataList.Label minWidth="88px">E-mail</DataList.Label>

                                        <DataList.Value >{people.personalData?.email}</DataList.Value>
                                        <Separator size={"4"} className="" />

                                        <DataList.Label minWidth="88px">Matéria</DataList.Label>

                                        <DataList.Value >{people.teacherSubject ? people.teacherSubject : "Não possui."}</DataList.Value>
                                        <Separator size={"4"} className="mb-2" />

                                        <DataList.Label color="red"
                                            onClick={() => people.personalData?.email && handleDeleteSourceIndicated(people.personalData.email)} minWidth="88px" className="flex justify-center mb-2 border border-red-500 cursor-pointer hover:bg-red-100">Remover</DataList.Label>
                                    </DataList.Item>

                                ))}

                            </DataList.Root>
                        </div>
                    </>

                )}
            </section>

            <Flex align={"center"} justify={"center"} className="gap-6 max-sm:gap-2">
                <Button size="Medium" onClick={previousStep} title={"Voltar"} color={"primary"}>

                </Button>
                <Button
                    size="Medium" onClick={() => onSubmit(true)} title={"Salvar e Sair"} color={"primary"}>

                </Button>
                <Button
                    size="Medium"
                    className=" disabled:bg-neutral-dark disabled:hover:cursor-not-allowed"
                    disabled={!formData.secondSources?.length}
                    onClick={() => onSubmit()} title={"Salvar e Continuar"} color={!formData.secondSources?.length ? "gray" : "green"}                    >

                </Button>

            </Flex>
        </Flex>
    );
};

export default IndicateSecondSourceStep;
