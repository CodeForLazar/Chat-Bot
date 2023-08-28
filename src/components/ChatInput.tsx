'use client';
import React, {HTMLAttributes, useState, useContext, useRef} from 'react';
import {cn} from '@/lib/utils';
import TextareaAutoSize from 'react-textarea-autosize';
import {useMutation} from '@tanstack/react-query';
import {nanoid} from 'nanoid';
import {Message} from '@/lib/validators/message';
import {MessagesContext} from '@/context/contextMessages';
import {CornerDownLeft, Loader2} from 'lucide-react';
import {toast} from 'react-hot-toast';

interface ChatInputProps extends HTMLAttributes<HTMLDivElement> {}

const ChatInput = ({className, ...props}: ChatInputProps) => {
   const [input, setInput] = useState<string>('');
   const {
      addMessage,
      isMessageUpdating,
      messages,
      removeMessage,
      setIsMessageUpdating,
      updateMessage,
   } = useContext(MessagesContext);

   const textAreaRef = useRef<null | HTMLTextAreaElement>(null);

   const {mutate, isLoading} = useMutation({
      mutationFn: async (message: Message) => {
         const response = await fetch('/api/message', {
            method: 'POST',
            body: JSON.stringify({messages: [message]}),
         });

         if (!response.ok) {
            throw new Error('Something went wrong');
         }
         return response.body;
      },
      onMutate: (message) => {
         addMessage(message);
      },
      onSuccess: async (stream) => {
         if (!stream) throw new Error('No stream found');
         const id = nanoid();
         const responseMessage: Message = {
            id,
            isUserMessage: false,
            text: '',
         };
         addMessage(responseMessage);
         setIsMessageUpdating(true);
         const reader = stream.getReader();
         const decoder = new TextDecoder();
         let done = false;
         while (!done) {
            const {value, done: doneReading} = await reader.read();
            done = doneReading;
            const chunkValue = decoder.decode(value);
            updateMessage(id, (prev) => prev + chunkValue);
         }

         setIsMessageUpdating(false);
         setInput('');

         setTimeout(() => {
            textAreaRef.current?.focus();
         }, 10);
      },
      onError: (_, message) => {
         toast.error('Something went wrong please try again');
         removeMessage(message.id);
         textAreaRef.current?.focus();
      },
   });

   return (
      <div {...props} className={cn('border-t border-zinc-300', className)}>
         <div className='relative mt-4 flex-1 overflow-hidden rounded-lg border-none outline-none'>
            <TextareaAutoSize
               disabled={isLoading}
               ref={textAreaRef}
               value={input}
               onChange={(e) => setInput(e.target.value)}
               rows={2}
               onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     const message = {
                        id: nanoid(),
                        isUserMessage: true,
                        text: input,
                     };
                     mutate(message);
                  }
               }}
               maxRows={4}
               autoFocus
               placeholder='Write a message...'
               className='bg-zinc text-ms peer block w-full resize-none border-0 py-1.5 pr-14 text-gray-900 focus:ring-0 disabled:opacity-50 sm:leading-6'
            />
            <div className='absolute inset-y-0 right-0 flex py-1.5 pr-1.5'>
               <kbd className='text-gray inline-flex items-center rounded border border-gray-200 bg-white px-1 font-sans text-xs'>
                  {isLoading ? (
                     <Loader2 className='h-3 w-3 animate-spin' />
                  ) : (
                     <CornerDownLeft className='h-3 w-3' />
                  )}
               </kbd>
            </div>
            <div
               className='absolute inset-x-0 bottom-0 border-t border-gray-300 peer-focus:border-t-2 peer-focus:border-indigo-600'
               aria-hidden='true'
            />
         </div>
      </div>
   );
};

export default ChatInput;
