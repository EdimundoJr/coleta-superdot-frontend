// src/pages/ForbiddenPage/ForbiddenPage.tsx
import { Heading, Text } from "@radix-ui/themes";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Warning } from "@phosphor-icons/react";
import { Button } from "../../components/Button/Button";

export const ForbiddenPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-gradient-to-b from-off-white to-white w-full h-screen">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <Warning size={64} className="text-yellow-500" weight="fill" />
        </div>

        <Heading size="8" className="text-yellow-600">
          Acesso Negado
        </Heading>

        <Heading size="5" className="text-gray-900">
          Você não tem permissão para acessar esta página
        </Heading>

        <Text className="text-gray-600">
          Esta área requer privilégios de administrador. Se você acredita que isso é um erro, entre em contato com o suporte.
        </Text>

        <Button
          size="Medium"
          className="mt-6 mx-auto"
          onClick={() => navigate(-1)}
          title={"Voltar para página anterior"}
          color="primary"
        >
          <ArrowLeft size={20} weight="bold" />
        </Button>
      </div>
    </div>
  );
};

export default ForbiddenPage;