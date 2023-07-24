import * as React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import type { MessageList } from "@/utils/useMessage";

// type Message = {
//   id: string;
//   text: string;
//   createdAt: string;
//   user?: {
//     id: string;
//     name: string;
//     image: string;
//   };
// };

type MessageListProps = {
  messages: MessageList;
};

export default function MessageList({ messages = [] }: MessageListProps) {
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
    messages.length > 0 && scrollToBottomOfList();
  }, [scrollToBottomOfList, messages.length]);

  return (
    <section className="relative isolate flex h-full flex-col overflow-hidden rounded-t-2xl">
      <div className="absolute left-0 right-0 top-0 z-10 flex place-content-center  bg-zinc-900/70 py-2 backdrop-blur-md">
        <h2 className="font-mono text-xl">Roar Square</h2>
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
                  <div className="relative flex h-8 w-8 place-content-center overflow-hidden rounded-full bg-zinc-900 p-2">
                    <Image
                      src={msg.user?.image ?? ""}
                      alt={msg.user?.name ?? "username"}
                      fill
                      sizes="100%"
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
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
          <div ref={scrollTargetRef} />
        </ol>
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

/*
const MESSAGES: Message[] = [
  {
    id: "063cdf60-2253-4480-9f20-a6fc226c02b3",
    text: "morbi vel lectus in quam fringilla rhoncus mauris enim leo rhoncus sed vestibulum sit amet cursus id turpis",
    createdAt: "2023-06-05 13:16:24",
    user: {
      id: "5abc106b-d63a-48b5-83b5-607862732a9b",
      name: "cattwool0",
      image: "http://dummyimage.com/74x64.png/5fa2dd/ffffff",
    },
  },
  {
    id: "fe100ca9-6961-4c11-9ebb-071d86872714",
    text: "sollicitudin mi sit amet lobortis sapien sapien non mi integer ac neque duis bibendum morbi non",
    createdAt: "2023-05-05 21:05:18",
    user: {
      id: "d1466717-2aa2-468f-b765-028bb70e9248",
      name: "cleicester1",
      image: "http://dummyimage.com/80x81.png/cc0000/ffffff",
    },
  },
  {
    id: "fdd44e5f-8a14-4ce8-9d2d-dc68c3aeea9f",
    text: "nec condimentum neque sapien placerat ante nulla justo aliquam quis turpis eget",
    createdAt: "2023-05-05 21:03:18",
    user: {
      id: "5354dd4a-0ece-4842-8046-629a3a548513",
      name: "atreamayne2",
      image: "http://dummyimage.com/45x70.png/cc0000/ffffff",
    },
  },
  {
    id: "bb14329e-7384-4ca4-84d8-1907ae9623b9",
    text: "in hac habitasse platea dictumst morbi vestibulum velit id pretium iaculis diam erat fermentum justo nec",
    createdAt: "2023-05-05 21:03:20",
    user: {
      id: "feecb49a-6b5e-403c-84aa-5789111c2589",
      name: "aaire3",
      image: "http://dummyimage.com/66x49.png/ff4444/ffffff",
    },
  },
  {
    id: "24ff7adc-a516-44d5-bf1f-bcdf447306ee",
    text: "magna vestibulum aliquet ultrices erat tortor sollicitudin mi sit amet lobortis sapien",
    createdAt: "2023-05-05 21:03:21",
    user: {
      id: "3ce25000-3416-4ede-be61-5999d6eb3104",
      name: "mrowbottom4",
      image: "http://dummyimage.com/100x93.png/ff4444/ffffff",
    },
  },
  {
    id: "1cfa1697-02f4-462b-8a0d-6ebd5d49bbbe",
    text: "mus vivamus vestibulum sagittis sapien cum sociis natoque penatibus et magnis dis parturient",
    createdAt: "2022-09-04 06:43:30",
    user: {
      id: "7dd88a1f-041e-458a-97fc-2d53c775acd9",
      name: "mweyland5",
      image: "http://dummyimage.com/43x79.png/ff4444/ffffff",
    },
  },
  {
    id: "d1c49747-4dbc-4623-8ac0-32805f4f56ce",
    text: "sit amet diam in magna bibendum imperdiet nullam orci pede",
    createdAt: "2022-10-20 21:18:53",
    user: {
      id: "8d130c5c-bb5e-472b-a89a-528fa1a00bdd",
      name: "amaffia6",
      image: "http://dummyimage.com/40x46.png/ff4444/ffffff",
    },
  },
  {
    id: "9c6a1950-ab59-4907-965e-871238e75e3f",
    text: "quis turpis sed ante vivamus tortor duis mattis egestas metus aenean fermentum donec ut mauris eget massa tempor",
    createdAt: "2023-01-27 17:29:59",
    user: {
      id: "f398462b-56cf-4b02-88b6-97f7c6453fa6",
      name: "dmumberson7",
      image: "http://dummyimage.com/74x93.png/dddddd/000000",
    },
  },
  {
    id: "7998f111-dc26-4eb7-9ae2-278924dcda07",
    text: "tempus semper est quam pharetra magna ac consequat metus sapien ut nunc vestibulum ante ipsum primis in faucibus orci",
    createdAt: "2023-01-27 17:30:59",
    user: {
      id: "a07fb4a7-62e6-4a90-a832-5f92003b9d08",
      name: "sledgerton8",
      image: "http://dummyimage.com/72x42.png/cc0000/ffffff",
    },
  },
  {
    id: "f84c0166-085c-4301-985f-a0d367d6fd38",
    text: "consequat nulla nisl nunc nisl duis bibendum felis sed interdum venenatis turpis enim blandit mi in",
    createdAt: "2023-01-27 17:31:30",
    user: {
      id: "1423a00c-14a9-47b3-956d-db1263c4daab",
      name: "bwooddisse9",
      image: "http://dummyimage.com/93x87.png/cc0000/ffffff",
    },
  },
];
*/
