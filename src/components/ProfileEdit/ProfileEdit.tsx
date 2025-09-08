import * as Icon from "@phosphor-icons/react";
import { useState } from "react";
import { Button } from "../Button/Button";

interface UserOptionsProps {
  currentUser: {
    name: string;
    email: string;
    avatar: string;
  };
  onSave?: (updatedData: {
    name: string;
    avatar?: string;
    newPassword?: string;
  }) => void;
}

export const ProfileEdit = ({ currentUser, onSave }: UserOptionsProps) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
  const [name, setName] = useState(currentUser.name);
  const [avatarPreview, setAvatarPreview] = useState(currentUser.avatar);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSave) {
      const updatedData: any = { name };
      if (avatarPreview !== currentUser.avatar) {
        updatedData.avatar = avatarPreview;
      }
      if (activeTab === 'security' && newPassword) {
        updatedData.newPassword = newPassword;
      }
      onSave(updatedData);
    }
  };

  return (
    <div className="bg-white card-container overflow-hidden max-w-3xl mx-auto">

      <div className="flex flex-col md:flex-row">

        <div className="w-full md:w-56 bg-gray-50 p-4 border-r border-gray-200">
          <div className="flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'profile'
                ? 'bg-white/30 text-secondary font-medium shadow-sm'
                : 'text-gray-600 hover:bg-secondary/30'
                }`}
            >
              <Icon.User className="mr-3" size={20} weight={activeTab === 'profile' ? 'fill' : 'regular'} />
              Perfil
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-4 py-3 rounded-lg transition-all ${activeTab === 'security'
                ? 'bg-white/30 text-secondary font-medium shadow-sm'
                : 'text-gray-600 hover:bg-secondary/30 '
                }`}
            >
              <Icon.LockKey className="mr-3" size={20} weight={activeTab === 'security' ? 'fill' : 'regular'} />
              Segurança
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'profile' ? (
              <>
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <img
                      src={avatarPreview}
                      alt="User avatar"
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary "
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer  transition-colors shadow-lg"
                      title="Alterar foto"
                    >
                      <Icon.Camera size={16} />
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>

                  <div className="w-full max-w-md space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome
                      </label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg    transition-all"
                        placeholder="Seu nome"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={currentUser.email}
                        disabled
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-4 max-w-md mx-auto">
                <div>
                  <label htmlFor="current-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Senha atual
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-lg  transition-all pr-10"
                      placeholder="Digite sua senha atual"
                    />
                    <Icon.Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                </div>

                <div>
                  <label htmlFor="new-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Nova senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg  transition-all pr-10"
                      placeholder="Digite a nova senha"
                    />
                    <Icon.Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Mínimo de 8 caracteres, incluindo números e símbolos.
                  </p>
                </div>

                <div>
                  <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border  rounded-lg focus:ring-2  transition-all pr-10"
                      placeholder="Confirme a nova senha"
                    />
                    <Icon.Lock className="absolute right-3 top-3 text-gray-400" size={18} />
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center pt-4 border-t border-gray-200">
              <Button type="submit" title={"Salvar alterações"} color="primary" children={<Icon.FloppyDisk size={18} weight="bold" />}></Button>



            </div>
          </form>
        </div>
      </div>
    </div>
  );
};