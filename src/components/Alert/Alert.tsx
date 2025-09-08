import { AlertDialog, Flex } from '@radix-ui/themes';
import { ReactNode } from 'react';

interface AlertProps {
  trigger: ReactNode;
  title: string;
  description: string;
  buttoncancel: ReactNode;
  buttonAction: ReactNode;
}

export function Alert({ trigger, title, description, buttonAction, buttoncancel }: AlertProps) {
  return (
    <>
      <AlertDialog.Root >
        <AlertDialog.Trigger>
          {trigger}
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px" className=''>
          <AlertDialog.Title className='!font-roboto'>{title}</AlertDialog.Title>
          <AlertDialog.Description size="1">
            {description}
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel className='!font-roboto bg-slate-400'>
              {buttoncancel}
            </AlertDialog.Cancel>
            <AlertDialog.Action className='!font-roboto'>
              {buttonAction}
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}
