"use client";
import Button from "@/app/components/button";
import { BrainIcon, SaveIcon } from "@/app/icons/myIcons";
import ImageAnnotator from "./imageAnnotator";
import { useSearchParams } from "next/navigation";
export default function Page() {
  const fileName = useSearchParams().get("fileName") || "";
  return (
    <>
      {/* Header of the main part */}
      <div className="bg-light/50 rounded-[10px] flex items-center p-[10px] gap-[10px] justify-between">
        <h1 className="text-md text-dark font-bold">{fileName}</h1>
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

      {/* <RecoilRoot> */}
      <ImageAnnotator />
      {/* </RecoilRoot> */}
    </>
  );
}
