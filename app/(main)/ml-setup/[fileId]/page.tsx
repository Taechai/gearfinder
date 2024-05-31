"use client";

// import SidescanFileBrowser from "./sidescanFileBrowser";
// import StatusInfo from "./statusInfo";
import ImageFinetune from "../../gear-detection/imageFinetune";
import { useState } from "react";
import Button from "@/app/components/button";
import { BrainIcon, SaveIcon } from "@/app/icons/myIcons";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";

// import ImageAnnotation from "./imageAnnotation";
import ImageAnnotator from "../../gear-detection/imageAnnotator";
import FileContext from "../../gear-detection/contexts/fileContext";
import { RecoilRoot } from "recoil";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { fileId: string } }) {
  const [selectedFile, setSelectedFile] = useState<{
    fileId: string;
    fileName: string;
  }>({ fileId: "", fileName: "" });
  const router = useRouter();
  return (
    <>
      <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
        <div className=" row-span-3 pl-[10px] flex flex-col gap-[10px]">
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
            <p className="text-[16px] text-dark/50">{params.fileId}</p>
            <div className="text-md text-dark bg-light/50 p-[10px] rounded-[10px] flex flex-row justify-between items-center border-[1px] border-dark/30">
              Fishing Gear
              <div className="bg-dark text-sm text-white px-[5px] py-[3px] rounded-[5px] size-fit">
                1
              </div>
            </div>
            <div className="text-md text-dark bg-light/50 p-[10px] rounded-[10px] flex flex-row justify-between items-center border-[1px] border-dark/30">
              Rope
              <div className="bg-dark text-sm text-white px-[5px] py-[3px] rounded-[5px] size-fit">
                4
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[5px]">
            <ImageFinetune />
          </div>
        </div>
        {/* Header of the main part */}
        <div className="bg-light/50 rounded-[10px] flex items-center p-[10px] gap-[10px] justify-between">
          <h1 className="text-md text-dark font-bold">{params.fileId}</h1>
          <div className="flex gap-[10px]">
            <Button
              Icon={BrainIcon}
              otherTwClass={"bg-warning-light/50 !text-warning-dark !font-bold"}
              twHover="hover:bg-warning-light/60"
              twFocus="focus:ring-[3px] focus:ring-warning-dark/50"
            >
              Label Assist
            </Button>
            <Button
              Icon={SaveIcon}
              otherTwClass={"bg-success-light/50 !text-success-dark !font-bold"}
              twHover="hover:bg-success-light/60"
              twFocus="focus:ring-[3px] focus:ring-success-dark/50"
            />
          </div>
        </div>
        {/* <div className="bg-light/50 rounded-[10px] overflow-hidden"> */}
        <RecoilRoot>
          <ImageAnnotator />
        </RecoilRoot>
        {/* <ImageAnnotation /> */}
        {/* </div> */}
      </FileContext.Provider>
    </>
  );
}
