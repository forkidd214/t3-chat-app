import * as React from "react";
import { useSession } from "next-auth/react";
import Login from "../Login";

type AddMessageFormProps = {
  onSubmit?: () => void;
};

export default function AddMessageForm({ onSubmit }: AddMessageFormProps) {
  const { data: sessionData } = useSession();
  const [message, setMessage] = React.useState("");
  const postMessage = () => {
    console.log({ message });
    setMessage("");
    onSubmit && onSubmit();
  };

  const isLogin = sessionData?.user !== undefined;
  const rows =
    message.split(/\r|\n/).length < 10 ? message.split(/\r|\n/).length : 10;

  return (
    <section className="rounded-b-lg p-4 ring-offset-4">
      <div className="">
        <form
          action="submit"
          onSubmit={(e) => {
            e.preventDefault();
            postMessage();
          }}
        >
          <fieldset>
            <div className="flex items-end justify-between gap-16 ">
              <textarea
                disabled={!isLogin}
                className={`flex-1 resize-none border border-solid border-zinc-500 bg-transparent px-4 py-3 ${
                  rows === 1 ? "rounded-full" : "rounded-lg"
                }`}
                name="text"
                id="text"
                rows={rows}
                placeholder="Text Message"
                autoFocus
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              {isLogin ? (
                <button
                  className={`rounded-lg bg-green-700 px-2 py-1 ${
                    message ? "" : "opacity-50"
                  }`}
                  type="submit"
                  disabled={!message}
                >
                  Submit
                </button>
              ) : (
                <Login />
              )}
            </div>
          </fieldset>
        </form>
      </div>
    </section>
  );
}
