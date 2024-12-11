import { Flex } from '@radix-ui/themes';
import { ReactNode, ButtonHTMLAttributes, RefAttributes, forwardRef } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, RefAttributes<HTMLButtonElement> {
  title: string;
  size: "Large" | "Medium" | "Small" | "Extra Small" | "";
  children?: ReactNode;
  className?: string;
  classNameTitle?: string;
  color: "primary" | "red" | "green" | "gray" | "secondary" | ""
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ title, children, color, className, classNameTitle, size, ...props }, ref) => {
  return (

    <button
      ref={ref}
      className={`px-4 
        ${size === "Large" ? "h-[40px]" :
          size === "Medium" ? "h-[32px]" :
            size === "Small" ? "h-[28px]" :
              size === "Extra Small" ? "h-[24px]" : ""}  
        ${color === 'primary' ? 'bg-primary hover:bg-secondary active:bg-primary active:brightness-90' :
          color === 'green' ? " bg-green-500 hover:bg-green-600 active:bg-green-700" :
            color === "red" ? "bg-red-400 hover:bg-red-500 active:bg-red-600" :
              color === "gray" ? "bg-gray-400 hover:bg-gray-500 active:bg-gray-600" :
                color === "secondary" ? " border-2 border-green-700 bg-green-900" : ""} 
        text-white font-semibold rounded mt-4 
        hover:drop-shadow-[0_4px_16px_rgba(22,22,22,0.1)]
        ${className}`}
      {...props}
    >

      <Flex align={'center'} justify={'center'} gap="2">
        {children}
        {title}
      </Flex>



    </button>
  );
});
