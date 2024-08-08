"use client";
import MerinovLogoDark from "@/public/merinov-logo-dark.png";
import Image from "next/image";
import Input from "@/app/components/inputText";
import { FolderIcon, TrashIcon } from "@heroicons/react/20/solid";
import InputDragFile from "@/app/components/inputDragFile";
import Button from "@/app/components/button";
import FileUploadState from "@/app/components/fileUploadState";
import { useRouter } from "next/navigation";
import { SkipNextIcon, UploadSquareIcon } from "@/app/icons/myIcons";
import { useState } from "react";

const errorsInit = {
  projectName: "",
};

export default function NewProject() {
  const router = useRouter();
  const [files, setFiles] = useState<{ file: File; state: string }[]>([]);
  const [projectName, setProjectName] = useState("");
  const [projectInputDisabled, setProjectInputDisabled] = useState(false);
  const [errors, setErrors] = useState({ ...errorsInit });

  const handleUpload = async () => {
    const projectNameTrimmed = projectName.trim();

    if (!projectNameTrimmed) {
      setErrors({
        projectName: "Please enter a project name before uploading files.",
      });
      return;
    }

    setProjectInputDisabled(true);

    const uploadPromises = files.map(async (fileObj, index) => {
      try {
        setFiles((prevFiles) =>
          prevFiles.map((file, idx) =>
            idx === index
              ? {
                  ...file,
                  state: file.state !== "uploaded" ? "uploading" : file.state,
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

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          setFiles((prevFiles) =>
            prevFiles.map((file, idx) =>
              idx === index ? { ...file, state: "uploaded" } : file
            )
          );
        } else {
          setFiles((prevFiles) =>
            prevFiles.map((file, idx) =>
              idx === index ? { ...file, state: "failed" } : file
            )
          );
        }
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
    <div className="flex flex-col items-center justify-center gap-[30px] p-[10px] h-full row-span-3 col-span-2">
      <div className="flex flex-col justify-center gap-[30px] w-full p-[10px] sm:max-w-md h-full">
        <h1 className="flex justify-start items-center gap-[20px] text-xl font-semibold leading-tight text-dark">
          <Image
            className="size-[35px] opacity-70"
            src={MerinovLogoDark}
            alt="Merinov Logo"
            width={35}
            height={35}
          />
          Project Creation
        </h1>
        <div className="flex flex-col items-stretch gap-[30px]">
          <div className="flex flex-col">
            <label
              htmlFor="new-project"
              className="text-[16px] text-dark font-bold p-[10px]"
            >
              Name of your project
            </label>
            <div>
              <Input
                Icon={FolderIcon}
                id="new-project"
                name="new-project"
                type="text"
                placeholder="Project Name"
                onChange={(e) => {
                  setProjectName(e.target.value);
                  if (e.target.value.trim()) setErrors({ projectName: "" });
                }}
                value={projectName}
                disabled={projectInputDisabled}
                otherTwClass={
                  errors.projectName && "ring-error-main/80 ring-[1px]"
                }
              />
              {errors.projectName && (
                <p className="text-md text-error-main mt-[5px] ml-[10px]">
                  {errors.projectName}
                </p>
              )}
            </div>
          </div>
          <InputDragFile setFiles={setFiles} />
        </div>
        <div className="flex flex-row gap-[10px]">
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
          <Button
            disabled={
              files.filter((file) => ["uploaded"].includes(file.state))
                .length == 0
            }
            otherTwClass={"w-full"}
            Icon={SkipNextIcon}
            onClick={() => {
              router.push("/gear-detection");
            }}
          >
            Start
          </Button>
        </div>
        {/* Upload State */}
        <div className="flex flex-col gap-[10px] h-full overflow-auto">
          {files.length > 0 && (
            <>
              <div className="flex w-full justify-between items-center">
                <h2 className="text-[16px] text-dark font-bold px-[10px]">
                  Selected Files <sup>({files.length})</sup>
                </h2>
                <TrashIcon
                  className="cursor-pointer size-[30px] text-error-dark bg-error-dark/10 p-[5px] rounded-[10px] hover:bg-error-dark hover:text-white transition-all"
                  onClick={() => {
                    setFiles([]);
                  }}
                />
                {/* <Button></Button> */}
              </div>
              <div className="flex flex-col gap-[10px] h-full overflow-auto">
                {files.map(({ file, state }, index) => {
                  return (
                    <FileUploadState
                      key={index}
                      fileName={file.name}
                      status={state}
                      onDelete={() => {
                        files.splice(index, 1);
                        setFiles([...files]);
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
