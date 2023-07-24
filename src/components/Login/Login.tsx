import * as React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import UserAvatar from "../UserAvatar";

export default function Login() {
  const { data: sessionData } = useSession();
  const isLogin = sessionData?.user !== undefined;

  return (
    <div className="">
      <button
        className={`flex items-center justify-between gap-1 rounded-full px-2 py-1  ${
          isLogin ? "bg-zinc-900 text-zinc-400" : "bg-green-700 text-zinc-50"
        }`}
        onClick={isLogin ? () => void signOut() : () => void signIn()}
      >
        <span className="font-mono text-lg italic">
          {isLogin ? (
            <UserAvatar
              className="-ml-1"
              src={sessionData.user.image ?? ""}
              alt={sessionData.user.name ?? "username"}
            />
          ) : null}
        </span>
        <span>{isLogin ? "Sign out" : "Sign in"}</span>
      </button>
    </div>
  );
}
