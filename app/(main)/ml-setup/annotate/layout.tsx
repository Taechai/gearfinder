import ImageFinetune from "../../gear-detection/imageFinetune";
import StatusInfo from "../../gear-detection/statusInfo";
import AnnotationsGroup from "./annotationsGroup";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className=" row-span-3 pl-[10px] flex flex-col gap-[10px]">
        <div className=" row-span-3 flex flex-col gap-[10px] overflow-auto">
          <AnnotationsGroup />
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
