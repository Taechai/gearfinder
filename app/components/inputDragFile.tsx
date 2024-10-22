"use client";
import { CloudArrowUpIcon } from "@heroicons/react/20/solid";
import _ from "lodash";
import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from "react";

export default function InputDragFile({
  setFiles,
  accept = ".xtf",
  twWidth,
  twHeight,
}: {
  setFiles: Dispatch<
    SetStateAction<
      { file: File; state: string; imageReconstructionState: string }[]
    >
  >;
  twWidth?: string;
  twHeight?: string;
  accept?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files;
    let files: {
      file: File;
      state: string;
      imageReconstructionState: string;
    }[] = [];
    if (fileList) {
      for (let i of _.range(0, fileList.length)) {
        files.push({
          file: fileList[i],
          state: "local",
          imageReconstructionState: "",
        });
      }

      setFiles((prev) => [...prev, ...files]);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <label
      htmlFor="dropzone-file"
      className={`${twWidth} ${twHeight} h-[200px] relative flex flex-col items-center justify-center border-[1px] border-dark border-dashed rounded-[10px] bg-light/50 hover:bg-light/80 transition-all`}
    >
      <div className="flex flex-col items-center justify-center p-[10px] gap-[10px]">
        <CloudArrowUpIcon className="size-[50px] text-dark mb-[10px]" />
        <p className="text-md text-dark font-light">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-md text-dark font-light">
          <code className="font-bold">.XTF</code> files
        </p>
      </div>
      <input
        id="dropzone-file"
        ref={inputRef}
        type="file"
        className="opacity-0 size-full absolute cursor-pointer"
        accept={accept}
        multiple
        onChange={handleFileChange}
        required
      />
    </label>
  );
}
