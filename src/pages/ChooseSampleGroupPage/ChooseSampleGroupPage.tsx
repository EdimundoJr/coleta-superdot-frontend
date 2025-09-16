import { useEffect, useState } from "react";
import { SampleGroup, findAllSampleGroups } from "../../api/sampleGroup.api";
import { Card } from "../../components/Card/Card";
import { useNavigate } from "react-router-dom";
import { Box, Container, Skeleton } from "@radix-ui/themes";

import { GridComponent } from "../../components/Grid/Grid";
import SkeletonDataList from "../../components/Skeletons/SkeletonDataList";

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

    const scrollToTop = () => {

        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            window.scrollTo(0, 0);
        }
    };

    return (
        <>
            <header className="pt-8 pb-6 border-b border-gray-200 mb-8">
                <h2 className="heading-2 font-semibold text-gray-900">
                    Selecione um grupo para criar uma amostra.
                </h2>
            </header>
            <Container >
                <GridComponent columns={2} children={

                    loading
                        ? (
                            <SkeletonDataList itens={2} titles={1} columns={4} />
                        )
                        :
                        sampleGroups?.map((group, index) => (

                            <Card.Root key={index} className={`${group.available ? "!border-confirm" : ""} min-h-[300px]`}>
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
                                            scrollToTop();
                                        }}
                                    >
                                        {group.available ? "Selecionar" : "Em construção"}
                                    </Card.Action>
                                </Card.Actions>
                            </Card.Root>

                        ))}

                    className="gap-8 " >
                </GridComponent >
            </Container >
        </>
    );
};

export default ChooseSampleGroupPage;
