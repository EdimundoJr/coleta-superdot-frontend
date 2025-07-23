import * as Icon from '@phosphor-icons/react';
import * as Accordion from '@radix-ui/react-accordion';
import classNames from 'classnames';
import React from 'react';

interface AccordionItemProps {
  children: React.ReactNode;
  value: string;
  className?: string;
}
interface AccordionTriggerProps {
  children: React.ReactNode;
  className?: string;
}
interface AccordionContentProps {
  children: React.ReactNode;
  className?: string;

}
interface AccordionProps {
  title: string;
  content: React.ReactNode;
  className?: string;
  defaultValue: string;
}

const Accordeon = ({ title, content, className, defaultValue }: AccordionProps) => (
  <Accordion.Root
    className={`bg-mauve6 w-full border-2 rounded-md shadow-[0_2px_10px] shadow-black/5 ${className}`}
    type="single"
    defaultValue={defaultValue}
    collapsible
  >
    <AccordionItem value="item-1">
      <AccordionTrigger>{title}</AccordionTrigger>
      <AccordionContent>{content}</AccordionContent>
    </AccordionItem>


  </Accordion.Root>
);

const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, className, ...props }, forwardedRef) => (
    <Accordion.Item
      className={classNames(
        'focus-within:shadow-mauve12 mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b focus-within:relative focus-within:shadow-[0_0_0_2px]',
        className
      )}
      value={value}
      {...props}
      ref={forwardedRef}
    >
      {children}
    </Accordion.Item>
  )
);


const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Header>
      <Accordion.Trigger
        className={classNames(
          'text-primary  shadow-mauve6 hover:bg-mauve2 group flex h-[60px] w-full flex-1 cursor-default items-center justify-between bg-white px-5 max-xl:px-2 leading-none shadow-[0_1px_0] outline-none',
          className
        )}
        {...props}
        ref={forwardedRef}
      >
        {children}
        <Icon.CaretDoubleDown
          size={20}
          className="text-violet10 ease-[cubic-bezier(0.87,_0,_0.13,_1)] transition-transform duration-300 group-data-[state=open]:rotate-180"

        />
      </Accordion.Trigger>
    </Accordion.Header>
  )
);


const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, forwardedRef) => (
    <Accordion.Content
      className={classNames(
        'text-mauve11 bg-mauve2 data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp overflow-hidden text-[15px]',
        className
      )}
      {...props}
      ref={forwardedRef}
    >
      <div className="py-[15px] px-5 max-xl:px-0">{children}</div>
    </Accordion.Content>
  )
);
export default Accordeon;