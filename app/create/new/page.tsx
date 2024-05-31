"use client";
import MerinovLogoDark from "@/public/merinov-logo-dark.png";
import Image from "next/image";
import Input from "@/app/components/inputText";
import { FolderPlusIcon, FolderIcon } from "@heroicons/react/20/solid";
import InputDragFile from "@/app/components/inputDragFile";
import Button from "@/app/components/button";
import FileUploadState from "@/app/components/fileUploadState";
import { useRouter } from "next/navigation";

export default function NewProject() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-[30px] size-full p-[10px] ">
      <div className="flex flex-col justify-center gap-[30px] w-full p-[10px] sm:max-w-md h-full">
        <h1 className="flex justify-start items-center gap-[20px] text-xl font-semibold leading-tight text-dark">
          <Image
            className="size-[35px] opacity-70"
            src={MerinovLogoDark}
            alt="Merinov Logo"
            width={35}
            height={35}
          />
          Getting Started
        </h1>
        <form className="flex flex-col items-stretch gap-[30px] " action="#">
          <div className="flex flex-col">
            <label
              htmlFor="new-project"
              className="text-[16px] text-dark font-bold p-[10px]"
            >
              Name of your project
            </label>
            <Input
              Icon={FolderIcon}
              id="new-project"
              name="new-project"
              type="text"
              placeholder="Porject Name"
              required
            />
          </div>
          <InputDragFile />
        </form>
        <div className="flex flex-col gap-[10px] h-full overflow-auto">
          <div className="text-[16px] text-dark font-bold px-[10px]">
            Uploaded files
          </div>
          <div className="flex flex-col gap-[10px] h-full overflow-y-scroll">
            <FileUploadState fileName="File_Name.xtf" status="uploading" />
            <FileUploadState fileName="File_Name.xtf" status="failed" />
            <FileUploadState fileName="File_Name.xtf" status="uploaded" />
          </div>
        </div>
        <Button
          Icon={FolderPlusIcon}
          onClick={() => {
            router.push("/gear-detection");
          }}
        >
          Create
        </Button>
      </div>
    </div>
  );
}
