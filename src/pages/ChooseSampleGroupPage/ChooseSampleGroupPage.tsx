import { useEffect, useState } from "react";
import { SampleGroup, findAllSampleGroups } from "../../api/sampleGroup.api";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import { Box, Container, Flex, Skeleton } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react"
import { Header } from "../../components/Header/Header";
import { GridComponent } from "../../components/Grid/Grid";
import Notify from "../../components/Notify/Notify";

const ChooseSampleGroupPage = () => {
    const [sampleGroups, setSampleGroups] = useState<SampleGroup[]>();
    const [loading, setLoading] = useState(true)
    const navigate = useNavigate();


    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setLoading(false);
        }, 1000);

        const getSampleGroups = async () => {
            const response = await findAllSampleGroups();
            if (response.status === 200) {
                setSampleGroups(response.data);
            }
        };
        getSampleGroups();
        return () => clearTimeout(timeoutId);
    }, []);

    return (

       <>
            {/* <Notify
                open={!!notificationTitle}
                onOpenChange={() => setNotificationTitle("")}
                title={notificationTitle}
                description={notificationDescription}
                icon={<Icon.XCircle size={20} color="red" />}
                className="border-red-400"
            ></Notify> */}
            <Header title="Identificação de Grupo" icon={<Icon.FolderSimplePlus size={24} />}></Header>
            <Flex direction="column" className="mb-4">
                <h3>Selecione um grupo para criar uma amostra.</h3>
            </Flex>
            <Container className="mb-4">
                <GridComponent children={
                    <>
                        {sampleGroups?.map((group, index) => {
                            return (
                                <Skeleton loading={loading}>
                                    <Box>
                                        <Card.Root key={index}>
                                            <Card.Header>{group.title}</Card.Header>
                                            <Card.Content>
                                                <ul>
                                                    {group.forms.map((form, index) => (
                                                        <li key={index}>{form}</li>
                                                    ))}
                                                </ul>
                                            </Card.Content>
                                            <Card.Actions className="justify-end">
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
                                    </Box>
                                </Skeleton>

                            );
                        })}
                    </>
                } columns={2} className="gap-8">
                </GridComponent>

            </Container>
            </>
    );
};

export default ChooseSampleGroupPage;
