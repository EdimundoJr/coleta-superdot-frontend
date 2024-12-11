import { ReactNode } from 'react';

interface PunctuationProps {
  children: ReactNode;
}

export function Punctuation({ children }: PunctuationProps) {
  return (
    <>
      <h1>Punctuation</h1>
      {children}
    </>
  );
}
