import { AlertDialog, Box, Flex, IconButton, Text, Strong, Tooltip } from "@radix-ui/themes"
import * as Icon from "@phosphor-icons/react"
import { Button } from "../Button/Button";


const ActionButtonExplain = () => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Box>
          <Tooltip content={"Visualizar Ações"}>
            <IconButton size="1" variant="surface" radius="full" className="hover:cursor-pointer">
              <Icon.QuestionMark size={15} />
            </IconButton>
          </Tooltip>
        </Box>
      </AlertDialog.Trigger>
      <AlertDialog.Content>
        <AlertDialog.Title className="mb-2">Tipos de Ação:</AlertDialog.Title>
        <AlertDialog.Description className="flex gap-2 mb-2">
          <Tooltip content="Visualizar Informações completas do Participante">
            <IconButton size="2" color="lime" radius="full" variant="outline" className="">
              <Icon.IdentificationCard size={20} />
            </IconButton>
          </Tooltip>
          <Text>
            <Strong>
              Visualizar Informações completas do Participante
            </Strong>
            <br></br>
            Esta seção permite visualizar todas as informações detalhadas do participante, incluindo os dados pessoais. É uma ferramenta útil para ter acesso completo ao perfil do participante, facilitando a consulta e o acompanhamento de suas informações.
          </Text>
        </AlertDialog.Description>
        <AlertDialog.Description className="flex gap-2 mb-2">
          <IconButton color="cyan" radius="full" variant="outline" >
            <Icon.ClipboardText size={20} />
          </IconButton>
          <Text>
            <Strong>
              Comparar as respostas do avaliado com as respostas das 2ª fontes
            </Strong>
            <br></br>
            Esta funcionalidade permite comparar as respostas fornecidas pelo avaliado com aquelas provenientes das segunda fontes, facilitando a análise das divergências e semelhanças. É uma ferramenta útil para garantir a precisão e consistência das informações, ajudando na avaliação mais completa do participante..
          </Text>
        </AlertDialog.Description>
        <AlertDialog.Description className="flex gap-2">
          <IconButton color="bronze" radius="full" variant="outline" >
            <Icon.IdentificationBadge size={20} />
          </IconButton>
          <Text>
            <Strong>
              Visualizar Autobiografia
            </Strong>
            <br></br>
            Esta opção permite acessar a autobiografia do participante, onde ele compartilha sua trajetória pessoal e experiências. É uma maneira de conhecer mais sobre sua história, valores e motivações, oferecendo um panorama completo de sua vida e visão.
          </Text>
        </AlertDialog.Description>
        <AlertDialog.Action>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button
                color="red"
                title={"Voltar"} size={"Medium"}
              />
            </AlertDialog.Cancel>
          </Flex>
        </AlertDialog.Action>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}

export default ActionButtonExplain;


