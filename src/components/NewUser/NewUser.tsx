import * as Icon from "@phosphor-icons/react";
import Modal from "../Modal/Modal";
import { useEffect, useState } from "react";

interface WelcomeModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  isNewUser: boolean;
}

const WelcomeModal = ({ open, setOpen, isNewUser }: WelcomeModalProps) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dontShow = localStorage.getItem('dontShowWelcome');
      if (dontShow === 'true' && !isNewUser) {
        setOpen(false);
      }
    }
  }, [isNewUser, setOpen]);

  const handleClose = () => {
    if (checked) {
      localStorage.setItem('dontShowWelcome', 'true');
    }
    setOpen(false);
  };
  return (
    <Modal
      open={open}
      setOpen={setOpen}
      title=""
      accessibleDescription=""
      accessibleDescription2=""
      className="relative min-h-[400px] max-sm:min-h-[300px] bg-gradient-to-r from-violet-500 to-primary  overflow-hidden border-none max-w-4xl max-sm:max-w-[95%]"
    >
      <div className="relative h-full p-2 ">
        {/* Elementos decorativos */}
        <div className="absolute  flex items-center justify-center max-sm:hidden">
          <div className="absolute transform -translate-x-1/2 -translate-y-1/2 
              w-64 h-64 lg:w-96 lg:h-96 
              bg-purple-500/20 rounded-full 
              top-1/4 left-1/4
              lg:top-1/3 lg:left-1/3
              animate-pulse">
          </div>

          <div className="absolute transform translate-x-1/2 translate-y-1/2 
              w-64 h-64 lg:w-96 lg:h-96 
              bg-purple-200/20 rounded-full 
              bottom-1/4 right-1/4
              lg:bottom-1/3 lg:right-1/3
              animate-pulse delay-300">
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-sm:p-4 mx-4 max-sm:mx-0 shadow-2xl max-w-2xl  transform transition-all hover:scale-[1.02] max-sm:hover:scale-100 duration-300">
          <div className="flex flex-col items-center space-y-6 max-sm:space-y-4">
            <div className="p-4 max-sm:p-2 bg-white/20 rounded-full animate-bounce">
              <Icon.CheckCircle className="w-12 h-12 max-sm:w-8 max-sm:h-8 text-white" />
            </div>

            <div className="text-center space-y-4 max-sm:space-y-2">
              <h2 className="heading-2 !text-white mb-2 max-sm:mb-1">
                Acesso liberado ao Superdot

              </h2>

              <p className="text-lg max-sm:text-[14px] text-purple-100/90 font-medium leading-relaxed max-sm:leading-snug">
                Agora você tem acesso ao <strong className="!font-roboto">Superdot</strong> — uma plataforma inovadora voltada à identificação
                de pessoas com Altas Habilidades/Superdotação. Este software foi desenvolvido para apoiar pesquisadores
                especializados no processo de cadastro, análise e comparação de dados entre participantes.
              </p>

              <div className="flex justify-center space-x-4 max-sm:space-x-2 mt-6 max-sm:mt-4">
                <div className="flex flex-col items-center gap-4 w-full">
                  <button
                    onClick={handleClose}
                    className="flex items-center bg-white/20 hover:bg-white/30 px-6 py-3 max-sm:px-4 max-sm:py-2 rounded-xl max-sm:rounded-lg text-white font-semibold max-sm:text-sm transition-all duration-300 w-full justify-center"
                  >
                    <Icon.Rocket className="mr-2 max-sm:mr-1 max-sm:w-4 max-sm:h-4" />
                    Começar Jornada
                  </button>

                  {/* Checkbox para não mostrar novamente */}
                  <label className="flex items-center gap-2 text-purple-100/90 text-sm cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => setChecked(e.target.checked)}
                      className="w-4 h-4 accent-purple-500 rounded focus:ring-purple-500"
                    />
                    Não mostrar esta mensagem novamente
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos flutuantes */}
        <div className="absolute top-8 right-8 max-sm:hidden w-16 h-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-16 left-12 max-sm:hidden w-8 h-8 bg-white/10 rounded-full animate-float-delayed"></div>
      </div>
    </Modal>
  );
};

export default WelcomeModal;