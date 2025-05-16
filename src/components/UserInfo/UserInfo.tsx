import { Avatar, Box, Text, Flex, Card, Skeleton, DropdownMenu } from '@radix-ui/themes';
import NoImg from "../../assets/no-image.jpg"
import { useEffect, useState } from 'react';
import { seeAttachmentImage } from '../../api/sample.api';
import { SampleFile } from '../../interfaces/sample.interface';
import { getUser, Users } from '../../api/researchers.api';

import * as Icon from "@phosphor-icons/react"
import { clearTokens } from '../../utils/tokensHandler';
import { useNavigate } from 'react-router-dom';
import { Alert } from '../Alert/Alert';
import { Button } from '../Button/Button';

interface UserInfoProps {
  sampleFile?: SampleFile;
  className?: string;
  variant?: 'compact' | 'full';
}



export function UserInfo({ sampleFile, className }: UserInfoProps) {

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<null | Users>(null);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUser();
        setUserData(data);
      } catch (error: any) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  const getFirstAndLastName = (fullName: string) => {
    if (typeof fullName !== 'string') {
      return '';
    }
    const names = fullName.split(' ');
    if (names.length > 1) {
      return `${names[0]} ${names[names.length - 1]}`;
    } else {
      return fullName;
    }
  };

  useEffect(() => {
    const fetchImage = async () => {
      if (userData?.researcher.profilePhoto === "undefined") {
        return;
      } else {
        try {
          const url = await seeAttachmentImage(`${userData?.researcher.profilePhoto}`);
          setImageUrl(url);
        } catch (error) {
          console.error("Erro ao recuperar a imagem:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchImage();
  }, [sampleFile, userData?.researcher.profilePhoto]);

  const navigate = useNavigate();

  const logout = () => {
    clearTokens();
    navigate("/");
  };

  return (
    <>
      <Box className={`flex items-center gap-3  ${className} `}>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='desktop'>
            <button>
              <Card variant='ghost'>
                <Flex gap="3" align="center">
                  <Skeleton loading={loading} className="w-10 h-10">
                    <Avatar size="4" src={imageUrl ? imageUrl : NoImg} radius="full" fallback={userData?.researcher.profilePhoto ? userData?.researcher.profilePhoto : NoImg} />
                  </Skeleton>
                  <Box>
                    <Skeleton loading={loading} className="mb-1">
                      <Text as="div" size="2" weight="bold" className='max-sm:hidden'>
                        {userData?.researcher.fullName}
                      </Text>
                    </Skeleton>

                    <Skeleton loading={loading} className="w-20 h-3">
                      <Text as="div" size="2" color="gray" className='max-sm:hidden'>
                        {userData?.role || ' '}
                      </Text>
                    </Skeleton>
                  </Box>
                  <Icon.CaretDown className='desktop' />
                </Flex>
              </Card>
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content variant="soft" className='w-full mt-1'>
            {/* <DropdownMenu.Item className='hover:cursor-pointer' >Editar Perfil</DropdownMenu.Item>
            <DropdownMenu.Separator /> */}
            <Alert
              trigger={<Button size='' className='w-[200px]' color='red' title={''}>

                <DropdownMenu.Item onSelect={(event) => event.preventDefault()} className='hover:cursor-pointer hover:bg-red-600 active:bg-red-700'>Sair</DropdownMenu.Item>

              </Button>}
              title={'Tem certeza que deseja sair da plataforma?'} description={''}
              buttoncancel={<Button size='Small' color="gray" title={'Cancelar'} />}
              buttonAction={<Button size='Small' onClick={logout}
                color="red"
                title={'Sim, desejo sair.'} />} />
          </DropdownMenu.Content>
        </DropdownMenu.Root>

      </Box >
      <Flex direction={'row'} align="center" className={`gap-3 !justify-between w-full ${className} mobo-flex`}>
        <Card variant='ghost' >
          <Flex gap="3" align="center">
            <Skeleton loading={loading} className="w-10 h-10">
              <Avatar size="2" src={imageUrl ? imageUrl : NoImg} radius="full" fallback={userData?.researcher.profilePhoto ? userData?.researcher.profilePhoto : NoImg} />
            </Skeleton>
            <Box>
              <Skeleton loading={loading} className="mb-1">
                <Text as="div" size="2" weight="bold" className='max-sm:!text-[12px]'>
                  {userData?.researcher.fullName}
                </Text>
              </Skeleton>

              <Skeleton loading={loading} className="w-20 h-3">
                <Text as="div" size="2" color="gray" className='max-sm:!text-[12px]'>
                  {userData?.role || ' '}
                </Text>
              </Skeleton>
            </Box>
            <Icon.CaretDown className='desktop' />
          </Flex>
        </Card>
        <Alert
          trigger={<Icon.SignOut size={30} />}
          title={'Tem certeza que deseja sair da plataforma?'} description={''}
          buttoncancel={<Button size='Small' color="gray" title={'Cancelar'} />}
          buttonAction={<Button size='Small' onClick={logout}
            color="red"
            title={'Sim, desejo sair.'} />} />

      </Flex>

    </>
  );
};

export default UserInfo;