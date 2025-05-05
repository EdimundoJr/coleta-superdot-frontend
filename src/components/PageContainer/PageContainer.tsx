// components/PageContainer/PageContainer.tsx
import { Flex } from "@radix-ui/themes";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <Flex
      direction="column"
      className={`pt-20 px-4 md:px-8 lg:px-12 min-h-screen ${className} max-xl:pt-28 m-auto w-full bg-off-white`}
      gap="5"
    >
      {children}
    </Flex>
  );
};