import { Badge, Box, Flex, Grid, Text } from "@radix-ui/themes";
import * as Icon from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";

interface DcardProps {
  title: string;
  description?: string;
  iconBase?: Icon.IconProps;
  seeButton: string;
  style?: string;
  styleButton?: string;
  linkTo?: string;
  colorBadge?: "gray" | "gold" | "bronze" | "brown" | "yellow" | "amber" | "orange" | "tomato" | "red" | "ruby" | "crimson" | "pink" | "plum" | "purple" | "violet" | "iris" | "indigo" | "blue" | "cyan" | "teal" | "jade" | "green" | "grass" | "lime" | "mint" | "sky" | undefined;

}

export default function Dcard({ title, description, iconBase, style, seeButton, linkTo, colorBadge, styleButton }: DcardProps) {

  const navigate = useNavigate();
  function link() {

    navigate(`${linkTo}`);
  };


  return (

    <Grid columns="1" className={`${style} min-w[350px] w-50px rounded overflow-hidden bg-white rounded-b-lg border-t-8  shadow-md hover:translate-y-[3px] group group/item transition-all pt-4 drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)] font-roboto`}>
      <Flex align="center" justify="center" className="p-4 gap-10">
        <Flex direction="column">
          <Badge variant="solid" radius="large" color={colorBadge} className={` justify-center h-[100px] w-[100px] `}>
            <>{iconBase}</>
          </Badge>
        </Flex>
        <Flex direction="column" align="start" className="ml-4">
          <Text as="label" size="8" className="text-gray-400 pb-4">{title}</Text>
          <Text as="p" size="8" color={colorBadge} className="font-bold text-lg ">{description}</Text>
        </Flex>
      </Flex>


      <Flex justify="end" className={`group/edit invisible group-hover/item:${seeButton} `}>
        <button
          className={`${styleButton} py-0.5 px-4 rounded-t  transition-all ease-in-out flex  items-center hover:text-white hover:translate-x-1`}
          onClick={() => link()}
        >
          <Text as="label" className="hover:cursor-pointer">Veja mais</Text>
          <Icon.CaretRight className={`group/edit invisible group-hover/item:${seeButton}`} />
        </button>
      </Flex>

    </Grid>
  );
}
