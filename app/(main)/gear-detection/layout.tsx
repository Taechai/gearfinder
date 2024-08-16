import ImageFinetune from "./imageFinetune";
import SidescanFileBrowser from "./sidescanFileBrowser";
import StatusInfo from "./statusInfo";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className=" row-span-3 pl-[10px] flex flex-col gap-[10px]">
        <div className="relative flex flex-col gap-[5px] min-h-[150px] max-h-full overflow-auto">
          <SidescanFileBrowser />
        </div>

        <div className="flex flex-col gap-[5px]">
          <ImageFinetune />
        </div>

        <div className="flex flex-col gap-[5px]">
          <StatusInfo />
        </div>
      </div>
      {children}
    </>
  );
}
