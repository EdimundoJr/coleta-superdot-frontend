import { Flex } from '@radix-ui/themes';
import { ReactNode, ButtonHTMLAttributes, RefAttributes, forwardRef } from 'react';


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, RefAttributes<HTMLButtonElement> {
  title: string;
  size: "Large" | "Medium" | "Small" | "Extra Small" | "";
  children?: ReactNode;
  className?: string;
  classNameTitle?: string;
  color: "primary" | "red" | "green" | "gray" | "secondary" | "" | "white" | "yellow";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ title, children, color, className, classNameTitle, size, ...props }, ref) => {
  return (

    <button
      ref={ref}
      className={`px-4 max-sm:px-2  max-sm:text-[12px]
        ${size === "Large" ? "h-[40px] " :
          size === "Medium" ? "h-[32px] " :
            size === "Small" ? "h-[28px]" :
              size === "Extra Small" ? "h-[24px]" : ""}  
        ${color === 'primary' ? 'text-white bg-primary hover:bg-secondary active:bg-primary active:brightness-90' :
          color === 'green' ? "text-white bg-green-500 hover:bg-green-600 active:bg-green-700" :
            color === "red" ? "text-white bg-red-400 hover:bg-red-500 active:bg-red-600" :
              color === "gray" ? "text-white bg-gray-400 hover:bg-gray-500 active:bg-gray-600" :
                color === "secondary" ? "text-white border-2 border-green-700 bg-green-900" :
                  color === "white" ? "text-slate-500 bg-white border-2  " :
                    color === "yellow" ? "text-yellow-800 bg-yellow-100 hover:bg-yellow-200 active:bg-yellow-300" : ""} 
         font-semibold rounded 
         leading-none 
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
