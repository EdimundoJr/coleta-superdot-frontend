import { AlertDialog, Flex } from '@radix-ui/themes';
import { ReactNode } from 'react';

interface AlertProps {
  trigger: ReactNode;
  title: string;
  description: string;
  buttoncancel: ReactNode;
  buttonAction: ReactNode;
}

export function Alert({ trigger,title,description,buttonAction,buttoncancel }: AlertProps) {
  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          {trigger}
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>{title}</AlertDialog.Title>
          <AlertDialog.Description size="2">
            {description}
          </AlertDialog.Description>
          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              {buttoncancel}
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              {buttonAction}
            </AlertDialog.Action>
          </Flex>         
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
}
