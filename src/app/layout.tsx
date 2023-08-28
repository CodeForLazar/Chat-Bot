import './globals.css';
import type {Metadata} from 'next';
import {Inter} from 'next/font/google';
import Providers from '@/components/Providers';
import Chat from '@/components/Chat';

const inter = Inter({subsets: ['latin']});

export const metadata: Metadata = {
   title: 'Chatbot',
   description: 'Just your friendly neighborhood chatbot',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
   return (
      <html lang='en'>
         <body className={inter.className}>
            <Providers>
               <Chat />
               {children}
            </Providers>
         </body>
      </html>
   );
}
