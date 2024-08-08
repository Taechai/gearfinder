import NavProfile from "./components/navProfile";
import NavMain from "./components/navMain";
import AuthSessionProvider from "@/app/lib/nextauth-provider";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import RecoilProvider from "../lib/recoilProvider";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <>
      <div className="size-full grid grid-rows-[repeat(3,_min-content)_1fr_min-content] grid-cols-[300px_1fr] p-[10px] gap-[10px]">
        <RecoilProvider>
          <NavProfile />
          <NavMain />
          <AuthSessionProvider session={session}>
            {children}
          </AuthSessionProvider>
        </RecoilProvider>
      </div>
    </>
  );
}
