"use client";

import SidescanFileBrowser from "./sidescanFileBrowser";
import StatusInfo from "./statusInfo";
import ImageFinetune from "./imageFinetune";
import { useState } from "react";
import Button from "@/app/components/button";
import { BrainIcon, SaveIcon } from "@/app/icons/myIcons";
// import ImageAnnotation from "./imageAnnotation";
import ImageAnnotator from "./imageAnnotator";
import FileContext from "./contexts/fileContext";
import { RecoilRoot } from "recoil";

export default function Page() {
  const [selectedFile, setSelectedFile] = useState<{
    fileId: string;
    fileName: string;
  }>({ fileId: "", fileName: "" });
  return (
    <>
      <FileContext.Provider value={{ selectedFile, setSelectedFile }}>
        <div className=" row-span-3 pl-[10px] flex flex-col gap-[10px]">
          <div className="relative flex flex-col gap-[5px] min-h-[250px] max-h-full overflow-auto">
            <SidescanFileBrowser />
          </div>

          <div className="flex flex-col gap-[5px]">
            <ImageFinetune />
          </div>

          <div className="flex flex-col gap-[5px]">
            <StatusInfo />
          </div>
        </div>
        {/* Header of the main part */}
        <div className="bg-light/50 rounded-[10px] flex items-center p-[10px] gap-[10px] justify-between">
          <h1 className="text-md text-dark font-bold">
            {selectedFile.fileName}
          </h1>
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

        <RecoilRoot>
          <ImageAnnotator />
        </RecoilRoot>
      </FileContext.Provider>
    </>
  );
}
