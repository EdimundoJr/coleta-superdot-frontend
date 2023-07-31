import { useEffect, useState } from "react";
import { SampleGroup, findAllSampleGroups } from "../../api/sampleGroup.api";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";

const ChooseSampleGroupPage = () => {
    const [sampleGroups, setSampleGroups] = useState<SampleGroup[]>();
    const navigate = useNavigate();

    useEffect(() => {
        const getSampleGroups = async () => {
            const response = await findAllSampleGroups();
            if (response.status === 200) {
                setSampleGroups(response.data);
            }
        };
        getSampleGroups();
    }, []);

    return (
        <>
            <header className="p-6 text-4xl font-bold">Identificação de Grupo</header>
            <h3>Selecione um grupo para criar uma amostra</h3>
            <div className="mt-10 grid grid-cols-1 content-center justify-items-center gap-x-3 gap-y-8 md:grid-cols-2 xl:grid-cols-3">
                {sampleGroups?.map((group, index) => {
                    return (
                        <Card.Root key={index}>
                            <Card.Header>{group.title}</Card.Header>
                            <Card.Content>
                                <ul>
                                    {group.forms.map((form, index) => (
                                        <li key={index}>{form}</li>
                                    ))}
                                </ul>
                            </Card.Content>
                            <Card.Actions>
                                <Card.Action
                                    disabled={!group.available}
                                    onClick={() =>
                                        navigate("/app/create-sample", {
                                            state: {
                                                groupSelected: group.title,
                                            },
                                        })
                                    }
                                >
                                    {group.available ? "Selecionar" : "Em construção"}
                                </Card.Action>
                            </Card.Actions>
                        </Card.Root>
                    );
                })}
            </div>
        </>
    );
};

export default ChooseSampleGroupPage;
