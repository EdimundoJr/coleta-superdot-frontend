import React from 'react';
import ReactWordcloud from 'react-wordcloud';

interface WordCloudGeneratorProps {
  texts?: string[];
}

const WordCloudGenerator: React.FC<WordCloudGeneratorProps> = ({  texts = [] }) => {

  const getWordCounts = (texts: string[]) => {

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
   

    const combinedText = texts.join(' ');

    // Limpeza e contagem das palavras
    const wordsArray = combinedText.split(/\s+/);
    const wordCounts: { [word: string]: number } = {};
    wordsArray.forEach(word => {
      const cleanedWord = word.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()"]/g, '').toLowerCase();
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
    fontSizes: [20, 60],
    padding: 0,
    rotations: 3,
    transitionDuration: 1000,
  };

  const words = getWordCounts(texts);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactWordcloud words={words} options={options} />
    </div>
  );
};


export default WordCloudGenerator;
