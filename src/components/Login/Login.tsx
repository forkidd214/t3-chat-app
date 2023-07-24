import * as React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

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
            <div className="relative -ml-1 flex h-6 w-6 place-content-center overflow-hidden rounded-full bg-transparent">
              <Image
                className="brightness-125"
                src={sessionData.user.image ?? ""}
                alt={sessionData.user.name ?? "username"}
                fill
                sizes="100%"
                style={{
                  objectFit: "cover",
                }}
              />
            </div>
          ) : null}
        </span>
        <span>{isLogin ? "Sign out" : "Sign in"}</span>
      </button>
    </div>
  );
}
