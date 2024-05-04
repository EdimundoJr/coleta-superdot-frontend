import { Grid } from '@radix-ui/themes';
import { ReactNode } from 'react';


interface GridProps {
  children: ReactNode;
  clasName?: string;
  columns: number,
}

export function GridComponent({ children, clasName, columns }: GridProps) {
  return (

    <Grid columns={`${columns}`} className={`${clasName} items-center px-5 w-full font-roboto mb-5`}>
      {children}
    </Grid>
  );
}
