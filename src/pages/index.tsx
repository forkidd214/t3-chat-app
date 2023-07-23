import Head from "next/head";
import MessageList from "@/components/MessageList";
import AddMessageForm from "@/components/AddMessageForm";
import { useMessageList, useMessageCreate } from "@/utils/useMessage";

export default function Home() {
  const {
    data: messages,
    isLoading,
    isError,
    error,
    refetch,
  } = useMessageList();
  const { mutate: createMessage } = useMessageCreate({
    onSuccess: () => refetch(),
  });

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
        <MessageList messages={messages} />
        <AddMessageForm onSubmit={createMessage} />
      </div>
    </>
  );
}
