import NavProfile from "./components/navProfile";
import NavMain from "./components/navMain";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="size-full grid grid-rows-[repeat(3,_min-content)_1fr_min-content] grid-cols-[300px_1fr] p-[10px] gap-[10px]">
        <NavProfile />
        <NavMain />
        {children}
      </div>
    </>
  );
}
