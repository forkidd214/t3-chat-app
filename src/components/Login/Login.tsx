import * as React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";

export default function Login() {
  const { data: sessionData } = useSession();
  const isLogin = sessionData?.user !== undefined;

  return (
    <div className="flex items-center gap-2">
      <div>
        <span className="font-mono text-lg italic">
          {isLogin ? (
            <div className="relative flex h-10 w-10 place-content-center overflow-hidden rounded-full bg-zinc-900 ">
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
          ) : (
            ""
          )}
        </span>
      </div>
      <button
        className={`rounded-lg px-2 py-1  ${
          isLogin ? "bg-zinc-800 opacity-50" : "bg-green-700"
        }`}
        onClick={isLogin ? () => void signOut() : () => void signIn()}
      >
        {isLogin ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
}
