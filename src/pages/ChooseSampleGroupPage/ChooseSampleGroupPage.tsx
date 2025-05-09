import { useEffect, useState } from "react";
import { SampleGroup, findAllSampleGroups } from "../../api/sampleGroup.api";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import { Box, Container } from "@radix-ui/themes";

import { GridComponent } from "../../components/Grid/Grid";

const ChooseSampleGroupPage = () => {
    const [sampleGroups, setSampleGroups] = useState<SampleGroup[]>();
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();


    useEffect(() => {

        const getSampleGroups = async () => {
            const response = await findAllSampleGroups();
            if (response.status === 200) {
                setSampleGroups(response.data);
                setLoading(false)
            }
        };
        getSampleGroups();

    }, []);

    return (

        <>



            <header className="pt-8 pb-6 border-b border-gray-200 mb-8">
                <h2 className="heading-2 font-semibold text-gray-900">
                    Selecione um grupo para criar uma amostra.
                </h2>
            </header>
            <Container className="mb-4 p-4">
                <GridComponent columns={2} children={
                    <>
                        {sampleGroups?.map((group, index) => {
                            return (

                                <Box>
                                    <Card.Root loading={loading} key={index} className={`${group.available ? "!border-confirm" : ""}`}>
                                        <Card.Header>{group.title}</Card.Header>
                                        <Card.Content>
                                            <ul>
                                                {group.forms.map((form, index) => (
                                                    <li key={index}>{form}</li>
                                                ))}
                                            </ul>
                                        </Card.Content>
                                        <Card.Actions className={`justify-end `}>
                                            <Card.Action
                                                disabled={!group.available}
                                                onClick={() => {
                                                    navigate("/app/create-sample", {
                                                        state: {
                                                            groupSelected: group.title,
                                                        },
                                                    });
                                                    window.scrollTo(0, 0);
                                                }}

                                            >
                                                {group.available ? "Selecionar" : "Em construção"}

                                            </Card.Action>

                                        </Card.Actions>

                                    </Card.Root>
                                </Box>

                            );
                        })}
                    </>
                } className="gap-8 "

                >
                </GridComponent>


            </Container>
        </>
    );
};

export default ChooseSampleGroupPage;
