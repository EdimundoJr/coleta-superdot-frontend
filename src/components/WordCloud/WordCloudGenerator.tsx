import React, { useEffect, useRef, useState } from 'react';
import ReactWordcloud from 'react-wordcloud';

interface WordCloudGeneratorProps {
  textBio?: string[];
}

const WordCloudGenerator: React.FC<WordCloudGeneratorProps> = ({ textBio = [] }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const handleFullScreen = () => {
    const elem = containerRef.current;

    if (elem) {
      // Define altura em tela cheia
      elem.style.height = '100vh';

      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if ((elem as any).webkitRequestFullscreen) {
        (elem as any).webkitRequestFullscreen();
      } else if ((elem as any).msRequestFullscreen) {
        (elem as any).msRequestFullscreen();
      }
    }
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen?.();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen();
    } else if ((document as any).msExitFullscreen) {
      (document as any).msExitFullscreen();
    }
  };

  useEffect(() => {
    const handleChange = () => {
      const isNowFullScreen = !!document.fullscreenElement;
      setIsFullScreen(isNowFullScreen);

      // Resetar altura ao sair do fullscreen
      if (!isNowFullScreen && containerRef.current) {
        containerRef.current.style.height = '300px';
      }
    };

    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const getWordCounts = (textBio: string[]) => {

    const stopWords = [
      'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na',
      'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser',
      'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre',
      'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você',
      'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia',
      'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu',
      'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas',
      'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo', 'estou',
      'está', 'estamos', 'estão', 'estive', 'esteve', 'estivemos', 'estiveram', 'estava', 'estávamos', 'estavam',
      'estivera', 'estivéramos', 'esteja', 'estejamos', 'estejam', 'estivesse', 'estivéssemos', 'estivessem', 'estiver',
      'estivermos', 'estiverem', 'hei', 'há', 'havemos', 'hão', 'houve', 'houvemos', 'houveram', 'houvera', 'houvéramos',
      'haja', 'hajamos', 'hajam', 'houvesse', 'houvéssemos', 'houvessem', 'houver', 'houvermos', 'houverem', 'houverei',
      'houverá', 'houveremos', 'houverão', 'houveria', 'houveríamos', 'houveriam', 'sou', 'somos', 'são', 'era', 'éramos',
      'eram', 'fui', 'foi', 'fomos', 'foram', 'fora', 'fôramos', 'seja', 'sejamos', 'sejam', 'fosse', 'fôssemos', 'fossem',
      'for', 'formos', 'forem', 'serei', 'será', 'seremos', 'serão', 'seria', 'seríamos', 'seriam', 'tenho', 'tem', 'temos',
      'tém', 'tinha', 'tínhamos', 'tinham', 'tive', 'teve', 'tivemos', 'tiveram', 'tivera', 'tivéramos', 'tenha', 'tenhamos',
      'tenham', 'tivesse', 'tivéssemos', 'tivessem', 'tiver', 'tivermos', 'tiverem', 'terei', 'terá', 'teremos', 'terão',
      'teria', 'teríamos', 'teriam', 'tu',
    ];


    const combinedText = textBio.join(' ');

    // Limpeza e contagem das palavras
    const wordsArray = combinedText.split(/\s+/);
    const wordCounts: { [word: string]: number } = {};
    wordsArray.forEach(word => {
      const cleanedWord = word.normalize('NFD').replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"]/g, '').toLowerCase();
      if (cleanedWord && !stopWords.includes(cleanedWord)) {
        wordCounts[cleanedWord] = (wordCounts[cleanedWord] || 0) + 1;
      }
    });

    return Object.entries(wordCounts).map(([text, value]) => ({ text, value }));
  };

  const options = {
    enableTooltip: false,
    deterministic: true,
    fontFamily: 'roboto',
    fontSizes: [20, 60] as [number, number],
    padding: 0,
    rotations: 3,
    transitionDuration: 1000,
  };

  const words = getWordCounts(textBio);

  return (
    <div
      ref={containerRef}
      className="relative "
      style={{ height: '300px', width: '300px', cursor: 'pointer', background: 'white', }}
      onClick={!isFullScreen ? handleFullScreen : undefined}
    >
      <ReactWordcloud words={words} options={options} />

      {isFullScreen && (
        <button
          onClick={exitFullScreen}
          style={{
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 10,
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            padding: '8px 12px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Fechar
        </button>
      )}
      <p className='text-[14px] text-gray-500'>*Clique na imagem para ver em tela cheia.</p>
    </div>
  );
};


export default WordCloudGenerator;
