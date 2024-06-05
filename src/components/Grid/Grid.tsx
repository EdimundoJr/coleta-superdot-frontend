import { Grid } from '@radix-ui/themes';
import { ReactNode } from 'react';


interface GridProps {
  children: ReactNode;
  className?: string;
  columns: number,
}

export function GridComponent({ children, className, columns }: GridProps) {
  return (

    <Grid columns={`${columns}`} className={`${className} font-roboto mb-5`}>
      {children}
    </Grid>
  );
}
