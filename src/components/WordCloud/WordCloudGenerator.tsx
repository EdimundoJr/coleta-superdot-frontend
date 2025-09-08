import React, { useState, useEffect, useRef } from 'react';
import { Text } from '@visx/text';
import { scaleLog } from '@visx/scale';
import Wordcloud from '@visx/wordcloud/lib/Wordcloud';
import * as Switch from '@radix-ui/react-switch';

interface WordCloudGeneratorProps {
  textBio?: string[];
}

interface CustomWord {
  text: string;
  value: number;
  color: string;
}

const colors = ['#143059', '#2F6B9A', '#82a6c2', '#FF6B6B', '#4ECDC4', '#FFD700'];

const WordCloudGenerator: React.FC<WordCloudGeneratorProps> = ({ textBio = [] }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  const [spiralType, setSpiralType] = useState<'archimedean' | 'rectangular'>('archimedean');
  const [withRotation, setWithRotation] = useState(false);

  const getRotationDegree = () => {
    const rand = Math.random();
    return rand > 0.5 ? 60 : -60;
  };

  const wordFreq = (texts: string[]): CustomWord[] => {
    const stopWords = new Set([
      'de', 'a', 'o', 'que', 'e', 'do', 'da', 'em', 'um', 'para', 'é', 'com', 'não', 'uma', 'os', 'no', 'se', 'na', 'por', 'mais', 'as', 'dos', 'como', 'mas', 'foi', 'ao', 'ele', 'das', 'tem', 'à', 'seu', 'sua', 'ou', 'ser', 'quando', 'muito', 'há', 'nos', 'já', 'está', 'eu', 'também', 'só', 'pelo', 'pela', 'até', 'isso', 'ela', 'entre', 'era', 'depois', 'sem', 'mesmo', 'aos', 'ter', 'seus', 'quem', 'nas', 'me', 'esse', 'eles', 'estão', 'você', 'tinha', 'foram', 'essa', 'num', 'nem', 'suas', 'meu', 'às', 'minha', 'têm', 'numa', 'pelos', 'elas', 'havia', 'seja', 'qual', 'será', 'nós', 'tenho', 'lhe', 'deles', 'essas', 'esses', 'pelas', 'este', 'fosse', 'dele', 'tu', 'te', 'vocês', 'vos', 'lhes', 'meus', 'minhas', 'teu', 'tua', 'teus', 'tuas', 'nosso', 'nossa', 'nossos', 'nossas', 'dela', 'delas', 'esta', 'estes', 'estas', 'aquele', 'aquela', 'aqueles', 'aquelas', 'isto', 'aquilo', 'estou', 'está', 'estamos', 'estão', 'estive', 'esteve', 'estivemos', 'estiveram', 'estava', 'estávamos', 'estavam', 'estivera', 'estivéramos', 'esteja', 'estejamos', 'estejam', 'estivesse', 'estivéssemos', 'estivessem', 'estiver',
      'estivermos', 'estiverem', 'hei', 'há', 'havemos', 'hão', 'houve', 'houvemos', 'houveram', 'houvera', 'houvéramos', 'haja', 'hajamos', 'hajam', 'houvesse', 'houvéssemos', 'houvessem', 'houver', 'houvermos', 'houverem', 'houverei',
      'houverá', 'houveremos', 'houverão', 'houveria', 'houveríamos', 'houveriam', 'sou', 'somos', 'são', 'era', 'éramos', 'eram', 'fui', 'foi', 'fomos', 'foram', 'fora', 'fôramos', 'seja', 'sejamos', 'sejam', 'fosse', 'fôssemos', 'fossem',
      'for', 'formos', 'forem', 'serei', 'será', 'seremos', 'serão', 'seria', 'seríamos', 'seriam', 'tenho', 'tem', 'temos', 'tém', 'tinha', 'tínhamos', 'tinham', 'tive', 'teve', 'tivemos', 'tiveram', 'tivera', 'tivéramos', 'tenha', 'tenhamos',
      'tenham', 'tivesse', 'tivéssemos', 'tivessem', 'tiver', 'tivermos', 'tiverem', 'terei', 'terá', 'teremos', 'terão', 'teria', 'teríamos', 'teriam', 'tu', 'ia',
    ]);

    const wordCounts: Record<string, number> = {};
    const allText = texts.join(' ').normalize('NFD').replace(/[^\w\s]/gi, '').toLowerCase();

    allText.split(/\s+/).forEach((word) => {
      const cleaned = word.replace(/[.,\/#!$%^&*;:{}=\-_`~()]/g, '');
      if (cleaned && !stopWords.has(cleaned)) {
        wordCounts[cleaned] = (wordCounts[cleaned] || 0) + 1;
      }
    });

    const maxValue = Math.max(...Object.values(wordCounts), 1);
    return Object.entries(wordCounts).map(([text, value]) => ({
      text,
      value,
      color: colors[Math.floor((value / maxValue) * (colors.length - 1))],
    }));
  };

  const words = wordFreq(textBio);

  const fontScale = scaleLog({
    domain: [Math.min(...words.map((w) => w.value)), Math.max(...words.map((w) => w.value))],
    range: [10, 100],
  });

  const handleFullScreen = () => {
    if (containerRef.current) {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
      containerRef.current.requestFullscreen();
    }
    setIsFullScreen(true)
  };

  const exitFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setDimensions({ width: 300, height: 300 });

    }
    setIsFullScreen(false)

  };

  useEffect(() => {
    const handleResize = () => {
      if (!document.fullscreenElement && containerRef.current) {
        setDimensions({ width: 300, height: 300 });
        containerRef.current.style.width = '300px';
        containerRef.current.style.height = '300px';
      }
    };
    setIsFullScreen(false)

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return (
    <div
      className='m-auto'
    >
      <div className="card-container p-3">
        <div className="flex max-xl:flex-col items-center gap-4">
          {/* Controle do tipo de espiral */}
          <div className="flex flex-col space-y-1">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Tipo de Espiral
            </label>
            <select
              value={spiralType}
              onChange={(e) => setSpiralType(e.target.value as 'archimedean' | 'rectangular')}
              className="px-3 py-2 border rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
            >
              <option value="archimedean">Arquimediana</option>
              <option value="rectangular">Retangular</option>
            </select>
          </div>

          {/* Controle de rotação */}
          <div className="flex flex-col items-center gap-2">
            <label className="text-sm font-medium text-gray-700">
              Rotação Automática
            </label>
            <Switch.Root
              className="w-11 h-6 rounded-full relative data-[state=checked]:bg-primary bg-gray-300 transition-colors duration-200"
              checked={withRotation}
              onCheckedChange={setWithRotation}
            >
              <Switch.Thumb className="block w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 translate-x-0.5 data-[state=checked]:translate-x-[26px]" />
            </Switch.Root>
          </div>
        </div>
      </div>
      <div
        ref={containerRef}
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          position: 'relative',
          background: 'white',
          cursor: 'pointer'
        }}
        className='m-auto mt-2'
        onClick={!isFullScreen ? handleFullScreen : undefined}
      >
        <Wordcloud
          words={words}
          width={dimensions.width}
          height={dimensions.height}
          fontSize={(w) => fontScale(w.value)}
          padding={2}
          spiral={spiralType}
          rotate={withRotation ? getRotationDegree : 0}
          random={() => 0.5}
          fontStyle={""}
        >
          {(cloudWords) => cloudWords.map((w, i) => (
            <Text
              key={w.text}
              fill={colors[i % colors.length]}
              textAnchor="middle"
              transform={`translate(${w.x}, ${w.y}) rotate(${w.rotate})`}
              fontSize={w.size}
              fontFamily={w.font}
            >
              {w.text}
            </Text>
          ))}
        </Wordcloud>
        {isFullScreen && (
          <button
            onClick={exitFullScreen}
            className='overlay-message'
          >
            Fechar Tela Cheia
          </button>
        )}



      </div>

      {!isFullScreen && (
        <div className={`overlay-message max-sm:w-[80%]`}>
          *Clique para tela cheia
        </div>
      )}
    </div>
  );
};

export default WordCloudGenerator;