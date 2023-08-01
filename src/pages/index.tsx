import Head from "next/head";
import MessageList from "@/components/MessageList";
import AddMessageForm from "@/components/AddMessageForm";
import type { MessageList as MessageListType } from "@/utils/useMessage";
import {
  useMessageList,
  useMessageCreate,
  useMessageTyping,
} from "@/utils/useMessage";
import {
  pusherClient,
  MESSAGE_CHANNEL,
  NEW_MESSAGE_EVENT,
  MESSAGE_TYPING_EVENT,
} from "@/utils/pusher";
import React from "react";

export default function Home() {
  /**
   * manage messages state
   */
  const {
    data: initialMessages,
    isLoading,
    isError,
    error,
    isSuccess,
  } = useMessageList({
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    retry: false,
    staleTime: Infinity,
  });
  const { mutate: createMessage } = useMessageCreate();
  const [messages, setMessages] = React.useState<MessageListType>([]);
  const hasSetInitialMessages = React.useRef(false);

  /**
   * manage typing state
   */
  const { mutate: handleMessageTyping } = useMessageTyping();
  const [currentlyTyping, setCurrentlyTyping] = React.useState<string[]>([]);

  /**
   * use react query to set deprecated messages
   * then update message by only pusher
   */
  React.useEffect(() => {
    if (isSuccess && !hasSetInitialMessages.current) {
      setMessages(initialMessages);
      hasSetInitialMessages.current = true;
    }
  }, [initialMessages, isSuccess]);

  // subscribe to pusher channel
  React.useEffect(() => {
    const newMessageHandler = (newMessage: MessageListType[number]) => {
      /**
       * trans from Date string to Date object
       * refer to https://pusher.com/docs/channels/library_auth_reference/pusher-websockets-protocol/#double-encoding
       *
       */
      const nextMessage: MessageListType[number] = {
        ...newMessage,
        createdAt: new Date(newMessage.createdAt),
        updatedAt: new Date(newMessage.updatedAt),
      };
      setMessages((prevMessages) => [...prevMessages, nextMessage]);
    };

    const messageTypingHandler = (typingEvent: {
      username: string;
      isTyping: boolean;
    }) => {
      const { username, isTyping } = typingEvent;
      setCurrentlyTyping((prevCurrentlyTyping) =>
        isTyping
          ? [...prevCurrentlyTyping, username]
          : prevCurrentlyTyping.filter((name) => name !== username)
      );
    };

    const channel = pusherClient.subscribe(MESSAGE_CHANNEL);
    channel.bind(NEW_MESSAGE_EVENT, newMessageHandler);
    channel.bind(MESSAGE_TYPING_EVENT, messageTypingHandler);

    return () => {
      channel.unbind(NEW_MESSAGE_EVENT);
      channel.unbind(MESSAGE_TYPING_EVENT);
      pusherClient.unsubscribe(MESSAGE_CHANNEL);
    };
  }, []);

  if (isLoading) return <span>Loading...</span>;
  if (isError) throw new Error(error.message);

  return (
    <>
      <Head>
        <title>Chatogether</title>
        <meta name="description" content="Chat Room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full flex-col rounded-2xl bg-black">
        <MessageList messages={messages} currentlyTyping={currentlyTyping} />
        <AddMessageForm
          onSubmit={createMessage}
          onTypingChange={handleMessageTyping}
        />
      </div>
    </>
  );
}
