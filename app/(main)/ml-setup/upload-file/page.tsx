"use client";
import { TrashIcon } from "@heroicons/react/20/solid";
import InputDragFile from "@/app/components/inputDragFile";
import Button from "@/app/components/button";
import FileUploadState from "@/app/components/fileUploadState";
import { UploadSquareIcon } from "@/app/icons/myIcons";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import { currentProjectAtom } from "../../projectAtom";

export default function Page() {
  const [files, setFiles] = useState<
    { file: File; state: string; imageReconstructionState: string }[]
  >([]);
  const { name: projectName } = useRecoilValue(currentProjectAtom);

  const handleUpload = async () => {
    const projectNameTrimmed = projectName.trim();

    const uploadPromises = files.map(async (fileObj, index) => {
      try {
        setFiles((prevFiles) =>
          prevFiles.map((file, idx) =>
            idx === index
              ? {
                  ...file,
                  state: file.state !== "uploaded" ? "uploading" : file.state,
                  imageReconstructionState: "",
                }
              : file
          )
        );
        if (fileObj.state == "uploaded") {
          return;
        }
        const formData = new FormData();
        formData.append("file", fileObj.file);
        formData.append("projectName", projectNameTrimmed);

        await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })
          .then((res) => res.json())
          .then(({ jobStatus }) => {
            setFiles((prevFiles) =>
              prevFiles.map((file, idx) =>
                idx === index
                  ? {
                      ...file,
                      state: "uploaded",
                      imageReconstructionState: jobStatus,
                    }
                  : file
              )
            );
          })
          .catch(() => {
            setFiles((prevFiles) =>
              prevFiles.map((file, idx) =>
                idx === index ? { ...file, state: "failed" } : file
              )
            );
          });
      } catch (error) {
        setFiles((prevFiles) =>
          prevFiles.map((file, idx) =>
            idx === index ? { ...file, state: "failed" } : file
          )
        );
      }
    });

    await Promise.all(uploadPromises);
  };
  return (
    <div className="col-span-2 row-span-2 flex gap-[10px] max-sm:flex-col">
      <InputDragFile setFiles={setFiles} twHeight="h-full" twWidth="w-full" />
      <div className="flex flex-col gap-[10px] h-full w-full overflow-auto">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-[16px] text-dark font-bold px-[10px]">
            Selected Files <sup>({files.length})</sup>
          </h2>
          {files.length > 0 && (
            <TrashIcon
              className="cursor-pointer size-[30px] text-error-dark bg-error-dark/10 p-[5px] rounded-[10px] hover:bg-error-dark hover:text-white transition-all"
              onClick={() => {
                setFiles([]);
              }}
            />
          )}
        </div>
        {/* Upload State */}
        <div className="flex flex-col gap-[10px] h-full w-full overflow-auto">
          {files.length > 0 && (
            <>
              {files.map(({ file, state, imageReconstructionState }, index) => {
                return (
                  <FileUploadState
                    key={index}
                    fileName={file.name}
                    status={state}
                    imageReconstructionState={imageReconstructionState}
                    onDelete={() => {
                      files.splice(index, 1);
                      setFiles([...files]);
                    }}
                  />
                );
              })}
            </>
          )}
        </div>
        <Button
          onClick={handleUpload}
          disabled={
            files.filter((file) => ["local", "failed"].includes(file.state))
              .length == 0
          }
          otherTwClass={"w-full"}
          Icon={UploadSquareIcon}
          btnType="submit"
        >
          Upload
        </Button>
      </div>
    </div>
  );
}
