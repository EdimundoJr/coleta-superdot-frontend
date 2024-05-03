import { Avatar, Box, Text, Separator , Flex, Section, } from '@radix-ui/themes';
import NoImg from "../../assets/no-image.jpg"
import { ReactNode, useEffect, useState } from 'react';
import { seeAttachmentImage } from '../../api/sample.api';
import { SampleFile } from '../../interfaces/sample.interface';
import { getUser, Users } from '../../api/researchers.api';
import * as Form from "@radix-ui/react-form";
import { InputField } from "../../components/InputField/InputField";
import * as Icon from "@phosphor-icons/react"




interface HeaderProps {
    title: String;
    icon?: React.ReactNode;
    children?: ReactNode;
    sampleFile?: SampleFile;
}


export function Header({ title, icon, children, sampleFile }: HeaderProps) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [userData, setUserData] = useState<null | Users>(null);
    const [error, setError] = useState();


    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUser();
                setUserData(data);
            } catch (error: any) {
                setError(error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const url = await seeAttachmentImage(`${userData?.profilePhoto}`);
                setImageUrl(url);
            } catch (error) {
                console.error("Erro ao recuperar a imagem:", error);
            }
        };
        fetchImage();
    }, [sampleFile, userData?.profilePhoto]);





    return (        
        <Section size={'1'} className="left-0 right-0 top-0 w-full pt-3 pb-3 pr-10 pl-10 font-roboto">
           
            <Box className="flex justify-between mb-5">

                <Flex align="center" className="gap-2">
                    <Text as="p" className="text-gray-300"> Página / </Text>
                    <Text as="p" className="">{title}</Text>
                    {icon}
                </Flex>

                <Flex>
                    <Form.Root className="flex flex-col sm:flex-row items-center justify-between px-10 py-10 pt-0 pb-1 ">
                        <Form.Submit asChild>
                        </Form.Submit>
                        <InputField icon={<button className="items-center">
                            <Icon.MagnifyingGlass />
                            </button>} placeholder="Faça sua busca aqui..." label="" name="participant-name" className="" />
                    </Form.Root>
                    <Flex justify="center" align="center" gap="3" >


                        <Avatar size="4" src={imageUrl ? imageUrl : NoImg} radius="full" fallback="" className='' />

                    </Flex>

                </Flex>

            </Box>
            <h3>{children}
            </h3>
            <Separator my="3" size="4" />
        </Section>
    );
}
