import * as React from "react";
import Login from "../Login";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="mx-auto flex h-screen w-full max-w-5xl flex-col gap-8  p-4">
      <header className="flex justify-between">
        <h1 className="font-mono text-2xl font-bold">Chatogether</h1>
        <Login />
      </header>
      <main className="min-h-0 flex-1">{children}</main>
    </div>
  );
}
