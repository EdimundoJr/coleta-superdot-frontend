import { useEffect, useState } from "react";
import { ISample } from "../../interfaces/sample.interface";
import { InputField } from "../../components/InputField/InputField";
import * as Form from "@radix-ui/react-form";
import { SelectField } from "../../components/SelectField/SelectField";
import { ClipboardIcon, EyeOpenIcon, IdCardIcon } from "@radix-ui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import { stateWithSample } from "../../validators/navigationStateValidators";

const AnalysisPage = () => {
    const [sample, setSample] = useState({} as ISample);

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (stateWithSample(location.state)) {
            setSample(location.state.sample);
        } else {
            navigate("/app/my-samples");
        }
    }, [location, navigate]);

    return (
        <div className="mx-8">
            <header className="my-10">
                <h1>{sample.sampleGroup}</h1>
                <h3>{sample.participants?.length} Avaliado(s)</h3>
            </header>
            <section className="my-5">
                <h6>Resultados Individuai(s)</h6>
                <Form.Root>
                    <InputField label="PESQUISAR PELO NOME DO AVALIADO" name="participant-name" />
                    <div className="gap-4 sm:flex">
                        <SelectField label="FILTRAR POR ÁREA DO SABER" name="knowledge-area" />
                        <InputField label="PONTUAÇÃO MÍNIMA (ESCORE)" name="min-punctuation" />
                    </div>
                    <div className="flex justify-center gap-5">
                        <Form.Submit asChild>
                            <button className="button-primary">Aplicar Filtros</button>
                        </Form.Submit>
                        <button type="reset" className="button-neutral-light">
                            Limpar Filtros
                        </button>
                    </div>
                </Form.Root>

                <div className="m-7 flex justify-between">
                    <button className="button-primary">Comparar Avaliados Selecionados</button>
                    <button className="button-primary">Gerar nuvem de palavras dos avaliados selecionados</button>
                </div>

                <div className="overflow-x-scroll">
                    <table>
                        <thead className="multi-rows">
                            <tr>
                                <th colSpan={4}></th>
                                <th colSpan={2}>Indicadores de AH/SD</th>
                                <th colSpan={3}>Áreas do saber</th>
                                <th></th>
                            </tr>
                            <tr>
                                <th>
                                    <input type="checkbox"></input>
                                </th>
                                <th>Nome do Avaliado</th>
                                <th>Pontuação</th>
                                <th>Quant. 2ªs fontes</th>
                                <th>De acordo com o questionário</th>
                                <th>De acordo com o pesquisador</th>
                                <th>Áreas indicadas pelo avaliado</th>
                                <th>Áreas gerais Indicadas pelo pesquisador</th>
                                <th>Áreas específicas Indicadas pelo pesquisador</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sample.participants?.map((participant) => (
                                <tr>
                                    <td>
                                        <input type="checkbox"></input>
                                    </td>
                                    <td>{participant.personalData.fullName}</td>
                                    <td>{participant.adultForm?.totalPunctuation}</td>
                                    <td>{participant.secondSources?.length}</td>
                                    <td>{participant.adultForm?.giftednessIndicators}</td>
                                    <td>-</td>
                                    <td>
                                        <div className="flex">
                                            {participant.adultForm?.knowledgeAreas?.length
                                                ? participant.adultForm.knowledgeAreas[0]
                                                : ""}{" "}
                                            <EyeOpenIcon />
                                        </div>
                                    </td>
                                    <td>
                                        <button className="button-secondary">Definir</button>
                                    </td>
                                    <td>
                                        <button className="button-secondary">Definir</button>
                                    </td>
                                    <td>
                                        <div className="flex items-center justify-between">
                                            <span
                                                className="cursor-pointer"
                                                title="Visualizar todas as informações do participante."
                                            >
                                                <IdCardIcon />
                                            </span>
                                            <span
                                                className="cursor-pointer"
                                                title="Comparar as respostas do avaliado com as respostas das 2ª fontes"
                                            >
                                                <ClipboardIcon />
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AnalysisPage;
