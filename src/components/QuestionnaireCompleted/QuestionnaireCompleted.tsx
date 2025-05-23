import * as Icon from "@phosphor-icons/react";
import { Flex } from "@radix-ui/themes";
import { useNavigate } from 'react-router-dom';
import { clearTokens } from "../../utils/tokensHandler";
const QuestionnaireCompleted = () => {
  const navigate = useNavigate();

  function handleClose() {
    clearTokens();
    navigate("/");
  }

  return (
    <Flex className="relative bg-gradient-to-r from-violet-500 to-primary overflow-hidden border-none w-full h-screen">
      <div className="relative h-full w-full p-2 m-auto flex items-center justify-center">
        {/* Elementos decorativos */}
        <div className="absolute  flex items-center justify-center max-sm:hidden">
          <div className="absolute transform  
          w-64 h-64 lg:w-96 lg:h-96 
          bg-purple-500/20 rounded-full 
          top-1/4 left-1/4
          lg:top-1/3 lg:left-1/3
          animate-pulse">
          </div>

          <div className="absolute transform  
          w-64 h-64 lg:w-96 lg:h-96 
          bg-purple-200/20 rounded-full 
          bottom-1/4 right-1/4
          lg:bottom-1/3 lg:right-1/3
          animate-pulse delay-300">
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="relative z-10 bg-white/10 backdrop-blur-lg rounded-2xl p-8 max-sm:p-4 shadow-2xl m-auto w-[50%] transform transition-all hover:scale-[1.02] max-sm:hover:scale-100 duration-300">
          <div className="flex flex-col items-center space-y-6 max-sm:space-y-4">
            <div className="p-4 max-sm:p-2 bg-white/20 rounded-full animate-bounce">
              <Icon.CheckCircle className="w-12 h-12 max-sm:w-8 max-sm:h-8 text-white" />
            </div>

            <div className="text-center space-y-4 max-sm:space-y-2">
              <h2 className="heading-2 !text-white mb-2 max-sm:mb-1">
                Questionário Finalizado!
              </h2>

              <p className="text-lg max-sm:text-[14px] text-purple-100/90 font-medium leading-relaxed max-sm:leading-snug">
                Este questionário foi finalizado. Todas as respostas foram registradas com sucesso e não podem mais ser editadas. Obrigado pela sua participação!
              </p>

              <div className="flex justify-center space-x-4 max-sm:space-x-2 mt-6 max-sm:mt-4">
                <div className="flex flex-col items-center gap-4 w-full">
                  <button
                    onClick={handleClose}
                    className="flex items-center bg-white/20 hover:bg-white/30 px-6 py-3 max-sm:px-4 max-sm:py-2 rounded-xl max-sm:rounded-lg text-white font-semibold max-sm:text-sm transition-all duration-300 w-full justify-center"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos flutuantes */}
        <div className="absolute top-8 right-8 max-sm:hidden w-16 h-16 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-16 left-12 max-sm:hidden w-8 h-8 bg-white/10 rounded-full animate-float-delayed"></div>
      </div>
    </Flex>

  );
};

export default QuestionnaireCompleted;
