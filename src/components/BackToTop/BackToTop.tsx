import { useState, useEffect } from 'react';
import * as Icon from '@phosphor-icons/react';

const BackToTop = () => {
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowButton(window.scrollY > 100);
    };


    const scrollHandler = setTimeout(() => {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    }, 100);

    return () => {
      clearTimeout(scrollHandler);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {

    try {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      window.scrollTo(0, 0);
    }
  };

  return (
    <button
      onClick={scrollToTop}
      aria-label="Voltar ao topo"
      className={`
        fixed bottom-6 right-6 z-50 p-3 w-12 h-12 rounded-full bg-primary text-white shadow-lg transition-all duration-300 ease-in-out transform hover:scale-110 active:scale-95 hover:bg-secondary
        ${showButton ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-10 pointer-events-auto'}
        md:bottom-8 md:right-8 
        touch-pan-x select-none 
      `}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <Icon.ArrowUp size={24} weight="bold" />
      <span className="sr-only">Voltar ao topo</span>
    </button>
  );
};

export default BackToTop;