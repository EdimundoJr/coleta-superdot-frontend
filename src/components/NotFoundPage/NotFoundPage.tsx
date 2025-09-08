// src/pages/NotFoundPage/NotFoundPage.tsx
import { Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";
import { Button } from "../Button/Button";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className=" flex flex-col items-center justify-center p-4 bg-gradient-to-b from-off-white to-white w-full">
      <div className="max-w-md w-full text-center space-y-6">
        <Heading size="8" className="text-primary-500">
          404
        </Heading>

        <Heading size="5" className="text-gray-900">
          Página não encontrada
        </Heading>

        <Text className="text-gray-600">
          O conteúdo que você está tentando acessar não existe ou foi movido.
        </Text>

        <Button

          size="Medium"
          className="mt-6 mx-auto"
          onClick={() => navigate(-1)} title={"Voltar para página anterior"} children={<ArrowLeft size={20} weight="bold" />} />
      </div>
    </div>
  );
};

export default NotFoundPage;