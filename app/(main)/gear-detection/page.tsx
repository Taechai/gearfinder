"use client";

import Button from "@/app/components/button";
import { BrainIcon, SaveIcon } from "@/app/icons/myIcons";
import ImageAnnotator from "./imageAnnotator";
import { useSearchParams } from "next/navigation";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { annotationsAtom } from "./annotation-components/atoms/annotationAtoms";
import { projectFilesAtom } from "../projectAtom";
export default function Page() {
  const fileName = useSearchParams().get("fileName") || "";
  const annotations = useRecoilValue(annotationsAtom);
  const setProjectFiles = useSetRecoilState(projectFilesAtom);

  const fileId = useSearchParams().get("id");
  const handleSaveAnnotations = () => {
    fetch("/api/save-annotations", {
      method: "POST",
      body: JSON.stringify({
        fileId,
        annotations,
      }),
    }).then(() => {
      setProjectFiles((prev) =>
        prev.map((prev) => {
          if (prev.fileId == fileId) {
            return {
              ...prev,
              state: annotations.length > 0 ? "annotated" : "unassigned",
            };
          } else return prev;
        })
      );
    });
  };
  return (
    <>
      {/* Header of the main part */}
      <div className="bg-light/50 rounded-[10px] flex items-center p-[10px] gap-[10px] justify-between">
        <h1 className="text-md text-dark">
          <span className="font-bold">Trip on</span> 11-09-2023 - 18h42 → 19h10
        </h1>
        {/* <h1 className="text-md text-dark font-bold">{fileName}</h1> */}
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
            onClick={handleSaveAnnotations}
          />
        </div>
      </div>

      <ImageAnnotator />
    </>
  );
}
