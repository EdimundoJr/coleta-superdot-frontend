import { DataList, Separator, Tooltip, IconButton, Badge } from "@radix-ui/themes";



const quantificacaoRespostas = [
  {
    pergunta: 1,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não", pontosNC: 1 },
  },
  {
    pergunta: 2,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Não", pontosC: 2, respostaNC: "Sim", pontosNC: 1 },
  },
  {
    pergunta: 3,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não", pontosNC: 1 },
  },
  {
    pergunta: 4,
    adulto: { respostaComum: "-", pontosC: "-", respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Sim ou Não", pontosC: 1, respostaNC: "-", pontosNC: "-" },
  },
  {
    pergunta: 5,
    adulto: { respostaComum: "Antes dos 6 anos", pontosC: 2, respostaNC: "Qualquer outra idade", pontosNC: 1 },
    adulto2: { respostaComum: "Sim ou Não", pontosC: 1, respostaNC: "-", pontosNC: "-" },
  },
  {
    pergunta: 6,
    adulto: { respostaComum: "10-20", pontosC: 2, respostaNC: "Menos de 10-20", pontosNC: 1 },
    adulto2: { respostaComum: "10-20", pontosC: 2, respostaNC: "Menos de 10-20", pontosNC: 1 },
  },
  {
    pergunta: 7,
    adulto: { respostaComum: "Pouco comuns para a faixa etária ou meio social", pontosC: 2, respostaNC: "Assuntos comuns e populares", pontosNC: 1 },
    adulto2: { respostaComum: "Pouco comuns para a faixa etária ou meio social", pontosC: 2, respostaNC: "Assuntos comuns e populares", pontosNC: 1 },
  },
  {
    pergunta: 8,
    adulto: { respostaComum: "Muito mais velhos ou muito mais novos do que eles", pontosC: 1, respostaNC: "Assuntos comuns e populares", pontosNC: "-" },
    adulto2: { respostaComum: "Muito mais velhos ou muito mais novos do que eles", pontosC: 1, respostaNC: "Assuntos comuns e populares", pontosNC: "-" },
  },
  {
    pergunta: 9,
    adulto: { respostaComum: "Qualquer uma", pontosC: 1, respostaNC: "-", pontosNC: "-" },
    adulto2: { respostaComum: "Qualquer uma", pontosC: 1, respostaNC: "-", pontosNC: "-" },
  },
  {
    pergunta: "10-22",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: "23-30",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: 31,
    adulto: { respostaComum: "Frequentemente ou sempre (acadêmico), Nunca, raramente (produtivo-criativo)", pontosC: 2, respostaNC: "Às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre (acadêmico), Nunca, raramente (produtivo-criativo)", pontosC: 2, respostaNC: "Às vezes", pontosNC: 1 },
  },
  {
    pergunta: "32-41",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: "42-46",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: "47-49",
    adulto: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
    adulto2: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
  },
  {
    pergunta: "50-54",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, às vezes", pontosNC: 1 },
  },
  {
    pergunta: 55,
    adulto: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
    adulto2: { respostaComum: "Nunca, raramente", pontosC: 2, respostaNC: "Às vezes, frequentemente ou sempre", pontosNC: 1 },
  },
  {
    pergunta: "56-62",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
  },
  {
    pergunta: "63-67",
    adulto: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
    adulto2: { respostaComum: "Frequentemente ou sempre", pontosC: 2, respostaNC: "Nunca, raramente, Às vezes", pontosNC: 1 },
  },
  {
    pergunta: 68,
    adulto: { respostaComum: "Independente de quantas opções foram marcadas", pontosC: 1, respostaNC: "Não", pontosNC: 1 },
    adulto2: { respostaComum: "Independente de quantas opções foram marcadas", pontosC: 1, respostaNC: "Não", pontosNC: 1 },
  },
  {
    pergunta: 69,
    adulto: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não ou outra", pontosNC: 1 },
    adulto2: { respostaComum: "Sim", pontosC: 2, respostaNC: "Não ou outra", pontosNC: 1 },
  },
  {
    pergunta: 70,
    adulto: { respostaComum: "De 10 a 20 ou mais de 20", pontosC: 2, respostaNC: "Menos de 5, 5 a 10 ou outra", pontosNC: 1 },
    adulto2: { respostaComum: "De 10 a 20 ou mais de 20", pontosC: 2, respostaNC: "Menos de 5, 5 a 10 ou outra", pontosNC: 1 },
  },
];



export default function InstrumentResponsesList() {
  return (
    <div className="w-full space-y-2">
      {quantificacaoRespostas.map((item) => (
        <DataList.Item key={item.pergunta} className="rounded-md border px-3 py-2">
          <div className="grid grid-cols-2 gap-x-2 text-xs">
            <div>
              <Badge variant="soft" color="purple" className="text-sm font-semibold">
                Pergunta {item.pergunta}
              </Badge>
            </div>

          </div>

          <span className="text-sm font-medium">Respostas</span>

          <div className="grid grid-cols-2 gap-x-2 text-xs mt-1">
            {/* Coluna: Adulto */}
            <div>
              <span className="block font-medium underline">Adulto</span>
              {item.adulto.respostaComum && (
                <>
                  <span className="font-medium">Comum:</span> {item.adulto.respostaComum}
                  <br />
                  <span className="font-medium">Pontos:</span> {item.adulto.pontosC}
                  <br />
                </>
              )}
              {item.adulto.respostaNC && (
                <>
                  <span className="font-medium">Não comum:</span> {item.adulto.respostaNC}
                  <br />
                  <span className="font-medium">Pontos:</span> {item.adulto.pontosNC}
                </>
              )}
              {/* Caso só haja "pontos" direto, como nas perguntas 9 a 70 */}
              {item.adulto.pontos && (
                <>
                  <span className="font-medium">Resposta:</span> {item.adulto.respostaComum}
                  <br />
                  <span className="font-medium">Pontos:</span> {item.adulto.pontos}
                </>
              )}
            </div>

            {/* Coluna: Adulto - 2ª Fonte */}
            <div>
              <span className="block font-medium underline">2ª Fonte</span>
              {item.adulto2.respostaComum && (
                <>
                  <span className="font-medium">Comum:</span> {item.adulto2.respostaComum}
                  <br />
                  <span className="font-medium">Pontos:</span> {item.adulto2.pontosC}
                  <br />
                </>
              )}
              {item.adulto2.respostaNC && (
                <>
                  <span className="font-medium">Não comum:</span> {item.adulto2.respostaNC}
                  <br />
                  <span className="font-medium">Pontos:</span> {item.adulto2.pontosNC}
                </>
              )}
              {item.adulto2.pontos && (
                <>
                  <span className="font-medium">Resposta:</span> {item.adulto2.respostaComum}
                  <br />
                  <span className="font-medium">Pontos:</span> {item.adulto2.pontos}
                </>
              )}
            </div>
          </div>
        </DataList.Item>
      ))}

      <DataList.Item className="rounded-md border bg-gray-50 px-3 py-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold">Totais</span>
        </div>
        <div className="grid grid-cols-2 gap-x-2 text-xs mt-1">
          <div>
            <span className="font-medium">OIIAHSD-Adulto:</span> 132
          </div>
          <div>
            <span className="font-medium">OIIAHSD-Adulto-2ª Fonte:</span> 138
          </div>
        </div>
      </DataList.Item>
    </div>
  );
}

