"use client";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import ImageFinetune from "../../gear-detection/imageFinetune";
import StatusInfo from "../../gear-detection/statusInfo";
import { useRouter, useSearchParams } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const fileName = useSearchParams().get("fileName") || "";

  return (
    <>
      <div className=" row-span-3 pl-[10px] flex flex-col gap-[10px]">
        {/* <div className="relative flex flex-col gap-[5px] min-h-[250px] max-h-full overflow-auto">
          <SidescanFileBrowser />
        </div> */}
        <div className=" row-span-3 flex flex-col gap-[10px]">
          <div className="relative flex flex-row items-center gap-[5px] max-h-full overflow-auto text-dark">
            <ArrowLongLeftIcon
              className="text-dark size-[30px] p-[5px] cursor-pointer hover:bg-dark/10 rounded-[5px] transition-all"
              onClick={() => router.back()}
            />
            <p>Go Back</p>
          </div>
          <div className="relative flex flex-col gap-[5px] overflow-auto text-dark">
            <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
              Annotations
            </h1>
            <p className="text-[16px] text-dark/50">{fileName}</p>
            <div className="text-md text-dark bg-light/50 p-[10px] rounded-[10px] flex flex-row justify-between items-center border-[1px] border-dark/30">
              Fishing Gear
              <div className="bg-dark text-sm text-white px-[5px] py-[3px] rounded-[5px] size-fit">
                7
              </div>
            </div>
            <div className="text-md text-dark bg-light/50 p-[10px] rounded-[10px] flex flex-row justify-between items-center border-[1px] border-dark/30">
              Rope
              <div className="bg-dark text-sm text-white px-[5px] py-[3px] rounded-[5px] size-fit">
                5
              </div>
            </div>
          </div>

          {/* <div className="flex flex-col gap-[5px]">
            <ImageFinetune />
          </div> */}
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
