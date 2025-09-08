import { Flex, Text } from "@radix-ui/themes";
import { ReactNode } from "react";


const EmptyState = ({ icon, title, description }: { icon: ReactNode; title: string; description: string }) => (
  <Flex direction="column" align="center" gap="4" className="py-12">
    <div className="text-primary">{icon}</div>
    <Text size="4" weight="bold">{title}</Text>
    <Text size="2" className="text-gray-600 text-center w-[50%] max-sm:w-[90%]">{description}</Text>
  </Flex>
);

export default EmptyState;