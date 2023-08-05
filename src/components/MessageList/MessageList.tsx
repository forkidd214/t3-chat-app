import * as React from "react";
import { useSession } from "next-auth/react";
import type { MessageList } from "@/utils/useMessage";
import UserAvatar from "@/components/UserAvatar";

type MessageListProps = {
  messages: MessageList;
  currentlyTyping: string[];
};

export default function MessageList({
  messages = [],
  currentlyTyping = [],
}: MessageListProps) {
  const { data: sessionData } = useSession();
  const currentUser = sessionData?.user;

  /**
   * scroll to the bottom of list onMount or once messages are updated
   *
   */
  const scrollTargetRef = React.useRef<HTMLDivElement>(null);
  const scrollToBottomOfList = React.useCallback(() => {
    if (!scrollTargetRef.current) {
      return;
    }

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, []);

  React.useEffect(() => {
    scrollToBottomOfList();
  }, [scrollToBottomOfList, messages.length, currentlyTyping.length]);

  return (
    <section className="relative isolate flex h-full flex-col overflow-hidden rounded-t-2xl">
      <div className="absolute left-0 right-0 top-0 z-10 flex place-content-center  bg-zinc-900/70 py-2 backdrop-blur-md">
        <h2 className="font-mono text-xl">Public Hall</h2>
      </div>
      <div className="h-full overflow-auto scroll-smooth px-2 pt-12">
        <ol className="flex flex-col gap-1">
          {messages.map((msg, index, msgs) => (
            <li key={msg.id}>
              <article className="">
                {isTimeSpanLessThan5Minutes(
                  msgs[index]?.createdAt,
                  msgs[index - 1]?.createdAt
                ) ? null : (
                  <div className="mt-2 text-center font-mono text-sm font-thin">
                    {formatTime(msg.createdAt)}
                  </div>
                )}
                <div
                  className={`flex items-start justify-start gap-2 ${
                    currentUser?.id === msg.user.id
                      ? "flex-row-reverse"
                      : "flex-row"
                  }`}
                >
                  <UserAvatar
                    className="h-8 bg-zinc-900"
                    src={msg.user?.image ?? ""}
                    alt={msg.user?.name ?? "username"}
                  />
                  <div
                    className={`w-fit max-w-lg rounded-2xl  px-2 py-1 ${
                      currentUser?.id === msg.user.id
                        ? "bg-green-900 "
                        : "bg-zinc-900"
                    } `}
                  >
                    <p className="text-md">{msg.text}</p>
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ol>
        <div>
          {currentlyTyping.length ? (
            <p className="mt-1 px-2 py-1 font-mono text-sm text-zinc-500 ">
              {currentlyTyping.join(", ")} typing...
            </p>
          ) : null}
        </div>
        <div ref={scrollTargetRef} />
      </div>
    </section>
  );
}

function isTimeSpanLessThan5Minutes(date1?: Date, date2?: Date) {
  if (date1 === undefined || date2 === undefined) return false;

  const timeDifference = Math.abs(date1.getTime() - date2.getTime());
  const fiveMinutesInMillis = 5 * 60 * 1000; // 5 minutes in milliseconds

  return timeDifference < fiveMinutesInMillis;
}

function formatTime(date: Date) {
  const dayOfWeek = date.toLocaleString("en-US", { weekday: "short" });
  const day = date.toLocaleString("en-US", { day: "numeric" });
  const month = date.toLocaleString("en-US", { month: "short" });
  const time = date.toLocaleString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
  const year = date.toLocaleString("en-US", { year: "numeric" });

  return `${dayOfWeek}, ${day} ${month} ${year} at ${time}`;
}
