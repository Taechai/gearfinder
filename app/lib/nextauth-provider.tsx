"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";
// import { RecoilRoot } from "recoil";
// import RecoilProvider from "./recoilProvider";
export default function AuthSessionProvider({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <SessionProvider session={session}>
      {/* <RecoilProvider> */}
      {children}
      {/* </RecoilProvider> */}
    </SessionProvider>
  );
}
