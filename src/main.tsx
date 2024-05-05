import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import '@radix-ui/themes/styles.css';
import { ScrollArea, Theme } from '@radix-ui/themes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Theme appearance="light" accentColor="violet" radius="small" className='h-full bg-primary font-roboto' >
      <ScrollArea type="scroll" scrollbars="both" size="3" radius='none'>
        <App />
      </ScrollArea>
    </Theme>
  </React.StrictMode>,
)
