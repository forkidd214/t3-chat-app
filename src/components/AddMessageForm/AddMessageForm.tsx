import * as React from "react";
import { useSession } from "next-auth/react";
import Login from "../Login";
import type { MessageCreateInput } from "@/utils/useMessage";

type AddMessageFormProps = {
  onSubmit?: (arg0: MessageCreateInput) => void;
  onTypingChange?: ({ isTyping }: { isTyping: boolean }) => void;
};

export default function AddMessageForm({
  onSubmit,
  onTypingChange,
}: AddMessageFormProps) {
  const { data: sessionData } = useSession();
  const [message, setMessage] = React.useState("");
  const [isTyping, setIsTyping] = React.useState<boolean>(false);
  const typingTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
  const postMessage = () => {
    onSubmit && onSubmit({ text: message });
    setMessage("");
    setIsTyping(false);
  };

  const isLogin = React.useMemo(
    () => sessionData?.user !== undefined,
    [sessionData]
  );
  const rows =
    message.split(/\r|\n/).length < 10 ? message.split(/\r|\n/).length : 10;

  /**
   * Only emit typing event when isTyping state change
   */
  React.useEffect(() => {
    isLogin && onTypingChange && onTypingChange({ isTyping });
  }, [isLogin, isTyping, onTypingChange]);

  return (
    <section className="rounded-b-lg p-2 ring-offset-4">
      <form
        action="submit"
        onSubmit={(e) => {
          e.preventDefault();
          postMessage();
        }}
      >
        <fieldset className="relative block">
          <textarea
            disabled={!isLogin}
            className={`block w-full resize-none border-2 border-solid border-zinc-800 bg-transparent py-2 pl-4 pr-12 ${
              rows === 1 ? "rounded-full" : "rounded-2xl"
            }
                `}
            name="text"
            id="text"
            rows={rows}
            placeholder={isLogin ? "Text Message" : "Please log in first  👉"}
            autoFocus
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);

              if (e.target.value === "") {
                setIsTyping(false);
              }
            }}
            onKeyDown={() => {
              setIsTyping(true);

              /**
               * if no key has been pressed since the last 30s,
               * then set isTyping to false
               */
              typingTimeoutRef.current &&
                clearTimeout(typingTimeoutRef.current);
              typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(false);
              }, 30 * 1000);
            }}
            onBlur={() => setIsTyping(false)}
          />
          <div className="absolute bottom-1 right-1.5">
            {isLogin ? (
              <button
                aria-label="send"
                className={`aspect-square h-8 rounded-full p-1 ${
                  message ? "bg-green-700" : "bg-transparent  opacity-30"
                }`}
                type="submit"
                disabled={!message}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-full w-full"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            ) : (
              <div className="mb-0.5">
                <Login />
              </div>
            )}
          </div>
        </fieldset>
      </form>
    </section>
  );
}
