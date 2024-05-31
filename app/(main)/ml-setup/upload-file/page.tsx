import FileUploadState from "@/app/components/fileUploadState";
import InputDragFile from "@/app/components/inputDragFile";

export default function Page() {
  return (
    <div className="col-span-2 row-span-2 flex gap-[10px] max-sm:flex-col">
      <InputDragFile twHeight="h-full" twWidth="w-full" />
      <div className="flex flex-col gap-[10px] h-full w-full overflow-auto">
        <div className="text-[16px] text-dark font-bold px-[10px]">
          Uploaded files
        </div>
        <div className="flex flex-col gap-[10px] h-full overflow-y-scroll">
          <FileUploadState fileName="File_Name.xtf" status="uploading" />
          <FileUploadState fileName="File_Name.xtf" status="failed" />
          <FileUploadState fileName="File_Name.xtf" status="uploaded" />
        </div>
      </div>
    </div>
  );
}
