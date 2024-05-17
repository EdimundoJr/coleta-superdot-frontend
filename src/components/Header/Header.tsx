import { Avatar, Box, Text, Separator, Flex, Section, Card, Skeleton, DropdownMenu, Button, AlertDialog, } from '@radix-ui/themes';
import NoImg from "../../assets/no-image.jpg"
import {  useEffect, useState } from 'react';
import { seeAttachmentImage } from '../../api/sample.api';
import { SampleFile } from '../../interfaces/sample.interface';
import { getUser, Users } from '../../api/researchers.api';

import * as Icon from "@phosphor-icons/react"
import { clearTokens } from '../../utils/tokensHandler';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
    title: String;
    icon?: React.ReactNode;    
    sampleFile?: SampleFile;
}

export function Header({ title, icon, sampleFile }: HeaderProps) {
    const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
    const [userData, setUserData] = useState<null | Users>(null);
    const [loading, setLoading] = useState(true);

    const [error, setError] = useState();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getUser();
                setUserData(data);
                setLoading(false);
                console.log(data);
            } catch (error: any) {
                setError(error);
                setLoading(false);
            }
        };

        // Verifica se os dados do usuário já foram carregados antes de fazer outra chamada
        if (!userData && loading) {
            fetchData();
        }
    }, [userData, loading]);

    useEffect(() => {
        const fetchImage = async () => {
            if (userData?.researcher.profilePhoto === "undefined") {
                return;
            } else {
                try {
                    const url = await seeAttachmentImage(`${userData?.researcher.profilePhoto}`);
                    setImageUrl(url);
                    setLoading(false);
                } catch (error) {
                    console.error("Erro ao recuperar a imagem:", error);
                    setLoading(false);
                }
            }
        };
        fetchImage();
    }, [sampleFile, userData?.researcher.profilePhoto]);

    const getFirstAndLastName = (fullName: string) => {
        const names = fullName.split(' ');
        if (names.length > 1) {
            return `${names[0]} ${names[names.length - 1]}`;
        } else {
            return fullName;
        }
    };

    const navigate = useNavigate();
    const logout = () => {
        clearTokens();
        navigate("/");
    };
    return (
        <Section size={'1'} className="w-full font-roboto p-4">
            <Flex justify="between" align="center">
                <Flex align="center" className="gap-2 ">
                    <Text as="p" size="6" className="text-gray-300"> Página / </Text>
                    <Text as="p" size="6" className="">{title}</Text>
                    {icon}
                </Flex>
                <Flex>
                    {/* <Form.Root className="flex flex-col sm:flex-row items-center justify-between px-10 py-10 pt-0 pb-0 ">
                        <Form.Submit asChild>
                        </Form.Submit>
                        <InputField icon={
                            <Icon.MagnifyingGlass size={20} />
                        } placeholder="Faça sua busca aqui..." label="" name="participant-name" className="" />
                    </Form.Root> */}
                    <Flex justify="center" align="center" gap="3" >
                        <Box maxWidth="240px">
                            <Skeleton loading={loading}>
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <button>
                                            <Card variant='ghost'>
                                                <Flex gap="3" align="center">
                                                    <Avatar size="4" src={imageUrl ? imageUrl : NoImg} radius="full" fallback={getFirstAndLastName(`${userData?.researcher.fullName}`)} />
                                                    <Box>
                                                        <Text as="div" size="2" weight="bold">
                                                            {getFirstAndLastName(`${userData?.researcher.fullName}`)}
                                                        </Text>
                                                        <Text as="div" size="2" color="gray">
                                                            {userData?.role}
                                                        </Text>
                                                    </Box>
                                                    <Icon.CaretDown />
                                                </Flex>
                                            </Card>
                                        </button>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content variant="soft" className='w-full mt-1'>
                                        <DropdownMenu.Item className='hover:cursor-pointer' >Editar Perfil</DropdownMenu.Item>
                                        <DropdownMenu.Separator />
                                        <AlertDialog.Root>
                                            <AlertDialog.Trigger className='hover:cursor-pointer'>
                                                <Button color='red' className='hover:bg-red-500 '>
                                                    <DropdownMenu.Item onSelect={(event) => event.preventDefault()} className='hover:cursor-pointer'>Sair</DropdownMenu.Item>
                                                </Button>
                                            </AlertDialog.Trigger>
                                            <AlertDialog.Content>
                                                <AlertDialog.Title>Tem certeza que deseja sair da plataforma?</AlertDialog.Title>
                                                <Flex gap="3" mt="4" justify="end">
                                                    <AlertDialog.Cancel>
                                                        <Button variant="soft" color="gray" className='hover:cursor-pointer'>
                                                            Cancelar
                                                        </Button>
                                                    </AlertDialog.Cancel>
                                                    <AlertDialog.Action>
                                                        <Button onClick={logout} variant="solid" color="red" className='hover:cursor-pointer'>
                                                            Sim, desejo sair.
                                                        </Button>
                                                    </AlertDialog.Action>
                                                </Flex>
                                            </AlertDialog.Content>
                                        </AlertDialog.Root>
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Skeleton>
                        </Box>
                    </Flex>
                </Flex>
            </Flex>           
            <Separator my="3" size="4" />
        </Section>
    );
}
