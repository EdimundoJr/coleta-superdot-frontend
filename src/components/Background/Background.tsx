
interface BackgroundComponentProps {
  children?: React.ReactNode;
  classNameCard?: string
}
export const BackgroundComponent: React.FC<BackgroundComponentProps> = ({ children, classNameCard }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-violet-600 via-purple-500 to-primary flex items-center justify-center p-4 overflow-hidden">
      {/* Esferas de fundo principais */}
      <div className="absolute inset-0 flex items-center justify-center max-sm:hidden overflow-hidden">
        <div className="absolute transform -translate-x-1/2 -translate-y-1/2 
                  w-64 h-64 lg:w-96 lg:h-96 
                  bg-white/10 rounded-full 
                  top-1/4 left-1/4
                  lg:top-1/3 lg:left-1/3
                  animate-pulse">
        </div>

        <div className="absolute transform translate-x-1/2 translate-y-1/2 
                  w-64 h-64 lg:w-96 lg:h-96 
                  bg-white/10 rounded-full 
                  bottom-1/4 right-1/4
                  lg:bottom-1/3 lg:right-1/3
                  animate-pulse delay-300">
        </div>

        <div className="absolute top-20 left-20 w-12 h-12 bg-white/10 rounded-full animate-float"></div>
        <div className="absolute bottom-20 right-20 w-16 h-16 bg-white/10 rounded-full animate-float-delayed"></div>
        <div className="absolute top-1/2 right-1/4 w-10 h-10 bg-white/10 rounded-full animate-float"></div>
      </div>
      {children ?
        <div className="relative z-20 w-full">
          <div className={` ${classNameCard}`}>
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500/10 to-rose-500/10 rounded-3xl blur-lg opacity-50"></div>
            {children}
          </div>
        </div>
        : <></>
      }

    </div>



  );
};

export default BackgroundComponent;
