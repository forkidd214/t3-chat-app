import * as React from "react";
import Link from "next/link";
import Login from "../Login";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex h-[100svh] w-full max-w-3xl flex-col gap-2 px-2 md:p-4">
      <header className="mt-2 flex items-center justify-between">
        <Link href="/">
          <h1 className="font-mono text-2xl font-bold">Chatogether</h1>
        </Link>
        <Login />
      </header>
      <main className="-mx-2 min-h-0 flex-1 md:mx-0">{children}</main>
    </div>
  );
}
