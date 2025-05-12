// src/pages/NotFoundPage/NotFoundPage.tsx
import { Button, Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "@phosphor-icons/react";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-off-white to-white">
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
          size="3"
          className="mt-6 mx-auto"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={18} weight="bold" />
          Voltar para página anterior
        </Button>

        <div className="mt-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="text-white hover:bg-primary"
          >
            Ir para página inicial →
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;