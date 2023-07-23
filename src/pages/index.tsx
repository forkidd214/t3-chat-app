import Head from "next/head";
import MessageList from "@/components/MessageList";
import AddMessageForm from "@/components/AddMessageForm";
// import { api } from "@/utils/api";

export default function Home() {
  //const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <>
      <Head>
        <title>Chatogether</title>
        <meta name="description" content="Chat Room" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="flex h-full flex-col rounded-2xl bg-black">
        <MessageList />
        <AddMessageForm />
        {/* <div className="mt-auto">
          <p>{hello.data ? hello.data.greeting : "Loading tRPC query..."}</p>
        </div> */}
      </div>
    </>
  );
}
