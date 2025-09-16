import {
  Avatar,
  Box,
  Text,
  Flex,
  Card,
  Skeleton,
  DropdownMenu,
  IconButton
} from '@radix-ui/themes';
import {
  CaretDown,
  Gear,
  SignOut,
  User,
  Pencil
} from '@phosphor-icons/react';
import NoImg from "../../assets/no-image.jpg"
import { useEffect, useState } from 'react';
import { seeAttachmentImage } from '../../api/sample.api';
import { SampleFile } from '../../interfaces/sample.interface';
import { getUser, Users } from '../../api/researchers.api';
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

export function UserInfo({ sampleFile, className, variant = 'full' }: UserInfoProps) {
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [userData, setUserData] = useState<null | Users>(null);
  const [loading, setLoading] = useState(true);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [error, setError] = useState<any>();

  const profilePhotoCache = useMemo(() => {
    return new Map<string, string>();
  }, []);

  const navigate = useNavigate();

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
  }, [sampleFile, userData?.personalData?.profilePhoto, profilePhotoCache]);

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

  // Componente de avatar com skeleton
  const AvatarWithSkeleton = () => (
    <Skeleton loading={loading} width="40px" height="40px" >
      <Avatar
        size="4"
        src={imageUrl || NoImg}
        radius="full"
        fallback={userData?.personalData?.fullName?.charAt(0) || <User size={20} />}
        className="transition-all duration-300 hover:scale-105 border-2 border-white shadow-md"
      />
    </Skeleton>
  );

  // Componente de informações do usuário
  const UserDetails = () => (
    <Box className="max-sm:hidden">
      <Skeleton loading={loading} className="mb-1">
        <Text as="div" size="2" weight="bold" className="text-gray-900 truncate max-w-[140px]">
          {getFirstAndLastName(userData?.personalData?.fullName || ' ')}
        </Text>
      </Skeleton>
      <Skeleton loading={loading}>
        <Text as="div" size="1" color="gray" className="font-medium">
          {userData?.role || ' '}
        </Text>
      </Skeleton>
    </Box>
  );

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

      {/* Versão Desktop */}
      <Box className={`hidden sm:flex items-center ${className} desktop`}>
        <DropdownMenu.Root>
          <DropdownMenu.Trigger>
            <button className="flex items-center gap-3 p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
              <AvatarWithSkeleton />
              {variant === 'full' && <UserDetails />}
              <CaretDown size={16} weight="bold" className="text-gray-600" />
            </button>
          </DropdownMenu.Trigger>

          <DropdownMenu.Content
            variant="soft"
            sideOffset={8}
            className="min-w-[220px] p-2 rounded-xl shadow-lg border border-gray-100"
          >
            <DropdownMenu.Item
              className="flex items-center gap-2 p-3 rounded-lg  text-gray-900 hover:bg-gray-100 focus:bg-gray-100 !cursor-pointer"
              onClick={openProfileEditModal}
            >
              <Pencil size={16} />
              Editar Perfil
            </DropdownMenu.Item>

            <DropdownMenu.Separator className="my-1 bg-gray-100" />

            <Alert
              trigger={
                <DropdownMenu.Item
                  onSelect={(e) => e.preventDefault()}
                  className="flex items-center gap-2 p-3 rounded-lg !cursor-pointer text-red-600 hover:bg-red-200 focus:bg-red-200"
                >
                  <SignOut size={16} />
                  Sair
                </DropdownMenu.Item>
              }
              title={'Tem certeza que deseja sair da plataforma?'}
              description={''}
              buttoncancel={<Button size='Small' color="gray" title={'Cancelar'} />}
              buttonAction={
                <Button
                  size='Small'
                  onClick={logout}
                  color="red"
                  title={'Sim, desejo sair.'}
                />
              }
            />
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </Box>

      {/* Versão Mobile */}
      <div

        className={`sm:hidden w-full px-2 py-1 shadow-sm rounded-xl ${className} mobo-flex !align-center  w-full flex flex-col  !items-center `}
      >
        <div className=' flex items-center !justify-between w-full'>
          <IconButton
            variant="ghost"
            size="3"
            onClick={openProfileEditModal}
            className=" rounded-full transition-transform hover:scale-105 shadow-sm"
          >
            <Gear size={30} className='text-white' />
          </IconButton>

          <Box className="text-center">
            <AvatarWithSkeleton />

            <Text as="div" size="3" weight="bold" className="text-white mt-3">
              {getFirstAndLastName(userData?.personalData?.fullName || " ")}
            </Text>
            <Text as="div" size="2" className="font-medium text-white">
              {userData?.role || " "}
            </Text>
          </Box>
          <Alert
            trigger={<IconButton
              variant="ghost"
              size="3"
              className="rounded-full  shadow-sm"
            >
              <SignOut size={30} className='text-white' />
            </IconButton>}
            title="Tem certeza que deseja sair da plataforma?"
            buttoncancel={<Button size="Small" color="gray" title="Cancelar" />}
            buttonAction={<Button
              size="Small"
              onClick={logout}
              color="red"
              title="Sim, desejo sair." />} description={''} />
        </div>
      </div>


    </>
  );
};

export default UserInfo;