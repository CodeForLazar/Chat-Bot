import {Message} from '@/lib/validators/message';
import {nanoid} from 'nanoid';
import {ReactNode, createContext, useState} from 'react';

export const MessagesContext = createContext<{
   messages: Message[];
   isMessageUpdating: boolean;
   addMessage: (message: Message) => void;
   removeMessage: (id: string) => void;
   updateMessage: (id: string, updateFn: (prevText: string) => string) => void;
   setIsMessageUpdating: (isUpdating: boolean) => void;
}>({
   messages: [],
   isMessageUpdating: false,
   addMessage: () => {},
   removeMessage: () => {},
   updateMessage: () => {},
   setIsMessageUpdating: () => {},
});

export const MessagesProvider = ({children}: {children: ReactNode}) => {
   const [messages, setMessages] = useState<Message[]>([
      {
         id: nanoid(),
         text: 'Hello, how can i help you?',
         isUserMessage: false,
      },
   ]);
   const [isMessageUpdating, setIsMessageUpdating] = useState<boolean>(false);

   const addMessage = (message: Message) => {
      setMessages((prevState) => [...prevState, message]);
   };

   const removeMessage = (id: string) => {
      setMessages((prevState) =>
         prevState.filter((message) => message.id !== id),
      );
   };

   const updateMessage = (
      id: string,
      updateFn: (prevText: string) => string,
   ) => {
      setMessages((prevState) =>
         prevState.map((message) => {
            if (message.id === id) {
               return {...message, text: updateFn(message.text)};
            }
            return message;
         }),
      );
   };
   return (
      <MessagesContext.Provider
         value={{
            messages,
            isMessageUpdating,
            addMessage,
            removeMessage,
            updateMessage,
            setIsMessageUpdating,
         }}
      >
         {children}
      </MessagesContext.Provider>
   );
};
