'use client';
import {QueryClientProvider, QueryClient} from '@tanstack/react-query';
import {ReactNode} from 'react';
import {MessagesProvider} from '@/context/contextMessages';

interface ProvidersProps {
   children: ReactNode;
}

const Providers = ({children}: ProvidersProps) => {
   const queryClient = new QueryClient();
   return (
      <QueryClientProvider client={queryClient}>
         <MessagesProvider>{children}</MessagesProvider>
      </QueryClientProvider>
   );
};

export default Providers;
