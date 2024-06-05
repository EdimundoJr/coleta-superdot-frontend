import { Box, Flex } from '@radix-ui/themes';
import { ReactNode, ButtonHTMLAttributes, RefAttributes, forwardRef } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, RefAttributes<HTMLButtonElement> {
  title: string;
  children?: ReactNode;
  className?: string;
  classNameTitle?: string;
  color: "primary" | "red" | "green" | "gray" | undefined
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ title, children, color, className, classNameTitle, ...props }, ref) => {
  return (

    <button
      ref={ref}
      className={`flex gap-3 justify-center py-1.5 truncate px-[80px] ${color === 'primary' ? 'bg-primary hover:bg-secondary active:bg-primary active:brightness-90' : color === 'green' ? " bg-green-500 hover:bg-green-600 active:bg-green-700" : color === "red" ? "bg-red-400 hover:bg-red-500 active:bg-red-600" : color === "gray" ? "bg-gray-400 hover:bg-gray-500 active:bg-gray-600" : ""}  text-white font-roboto font-semibold rounded mt-4 ${className}`}
      {...props}
    >
      <Flex align="center" direction="row">{children}</Flex>
      <Flex align="center" direction="row" className={classNameTitle} >{title}</Flex>
    </button>
  );
});
