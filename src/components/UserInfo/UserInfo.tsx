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
import Modal from '../Modal/Modal';
import { ProfileEdit } from '../ProfileEdit/ProfileEdit'
import { useMemo } from 'react';

interface UserInfoProps {
  sampleFile?: SampleFile;
  className?: string;
  variant?: 'compact' | 'full';
}



export function UserInfo({ sampleFile, className }: UserInfoProps) {

  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<null | Users>(null);
  const [loading, setLoading] = useState(true);
  const [openProfileModal, setOpenProfileModal] = useState(false);

  const [error, setError] = useState();


  const profilePhotoCache = useMemo(() => {
    return new Map<string, string>();
  }, []);

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
      const profilePhoto = userData?.personalData.profilePhoto;

      if (!profilePhoto) {
        setLoading(false);
        return;
      }

      const cacheKey = profilePhoto;

      if (profilePhotoCache.has(cacheKey) && !sampleFile) {
        setImageUrl(profilePhotoCache.get(cacheKey)!);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const url = await seeAttachmentImage(cacheKey);
        profilePhotoCache.set(cacheKey, url);
        setImageUrl(url);
      } catch (error) {
        console.error("Erro ao recuperar a imagem:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [sampleFile, userData?.personalData?.profilePhoto]);



  const navigate = useNavigate();

  const logout = () => {
    clearTokens();
    navigate("/");
  };

  function openProfileEditModal() {
    setOpenProfileModal(true);
  }
  const handleProfileSave = (updatedData: {
    fullName?: string;
    profilePhoto?: string;
  }) => {
    setUserData((prev) => prev ? {
      ...prev,
      personalData: {
        ...prev.personalData,
        fullName: updatedData.fullName || prev.personalData.fullName,
        profilePhoto: updatedData.profilePhoto || prev.personalData.profilePhoto,
      },
    } : null);

    setOpenProfileModal(false);
  };

  return (
    <>
      {userData && (
        <Modal
          open={openProfileModal}
          setOpen={setOpenProfileModal}
          title="Configurações da Conta"
          accessibleDescription="Gerencie suas informações pessoais e segurança"
          accessibleDescription2=""
          className=""
        >
          <ProfileEdit
            currentUser={{
              fullName: userData.personalData?.fullName || 'Nome não disponível',
              email: userData.email || 'Email não disponível',
              profilePhoto: imageUrl || NoImg
            }}
            onSave={handleProfileSave}
          />
        </Modal>
      )}
      <Box className={`flex items-center gap-3  ${className} `}>

        <DropdownMenu.Root>
          <DropdownMenu.Trigger className='desktop'>
            <button>
              <Card variant='ghost'>
                <Flex gap="3" align="center">
                  <Skeleton loading={loading} className="w-10 h-10">
                    <Avatar
                      size="4"
                      src={imageUrl || NoImg}
                      radius="full"
                      fallback={userData?.personalData?.profilePhoto || NoImg}
                    />
                  </Skeleton>
                  <Box>
                    <Skeleton loading={loading} className="mb-1">
                      <Text as="div" size="2" weight="bold" className='max-sm:hidden'>
                        {getFirstAndLastName(userData?.personalData?.fullName || ' ')}
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
            <DropdownMenu.Item className='hover:cursor-pointer' onClick={openProfileEditModal}>Editar Perfil</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <Alert
              trigger={<Button size='' className='w-[200px] !font-roboto' color='red' title={''}>

                <DropdownMenu.Item onSelect={(event) => event.preventDefault()} className='hover:cursor-pointer hover:bg-red-600 active:bg-red-700'>Sair</DropdownMenu.Item>

              </Button>}
              title={'Tem certeza que deseja sair da plataforma?'}
              description={''}
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
              <Avatar size="2" src={imageUrl ? imageUrl : NoImg} radius="full" fallback={userData?.personalData.profilePhoto ? userData?.personalData.profilePhoto : NoImg} />
            </Skeleton>
            <Box>
              <Skeleton loading={loading} className="mb-1">
                <Text as="div" size="2" weight="bold" className='max-sm:!text-[12px]'>
                  {getFirstAndLastName(userData?.personalData.fullName || ' ')}
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
        <Button size='Small' onClick={openProfileEditModal} color="" title={''} children={<Icon.Gear size={24} />} className='mobo' />
        <Alert
          trigger={<Icon.SignOut size={24} />}
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