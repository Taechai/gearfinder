// import { DocumentIcon } from "@heroicons/react/20/solid";
import { DocumentIcon } from "@/app/icons/myIcons";
import Link from "next/link";

const files = [
  {
    fileId: "5ea2a3f8-e159-4beb-8a69-83de45749c8e",
    fileName: "File 1",
  },
  {
    fileId: "14efabce-1f81-4b8b-9246-3b771e0d3999",
    fileName: "File 2",
  },
  {
    fileId: "20e20776-c959-4c9b-87be-1038a3327453",
    fileName: "File 3",
  },
  {
    fileId: "1461401f-46bb-4731-b7d7-0c8621937790",
    fileName: "File 4",
  },
  {
    fileId: "ae759aaa-06fa-4b00-b0a3-c29fa9775163",
    fileName: "File 5",
  },
  {
    fileId: "be4e7bf4-77ec-41df-8de5-ad39f2461540",
    fileName: "File 6",
  },
  {
    fileId: "5ea2a3f8-e159-4beb-8a69-83de45749c8e1",
    fileName: "File 7",
  },
  {
    fileId: "14efabce-1f81-4b8b-9246-3b771e0d39992",
    fileName: "File 8",
  },
  {
    fileId: "20e20776-c959-4c9b-87be-1038a33274533",
    fileName: "File 9",
  },
  {
    fileId: "1461401f-46bb-4731-b7d7-0c86219377904",
    fileName: "File 10",
  },
  {
    fileId: "ae759aaa-06fa-4b00-b0a3-c29fa97751635",
    fileName: "File 11",
  },
  {
    fileId: "be4e7bf4-77ec-41df-8de5-ad39f24615406",
    fileName: "File 12",
  },
  {
    fileId: "5ea2a3f8-e159-4beb-8a69-83de45749c8e7",
    fileName: "File 13",
  },
  {
    fileId: "14efabce-1f81-4b8b-9246-3b771e0d39998",
    fileName: "File 14",
  },
  {
    fileId: "20e20776-c959-4c9b-87be-1038a33274539",
    fileName: "File 15",
  },
  {
    fileId: "1461401f-46bb-4731-b7d7-0c862193779011",
    fileName: "File 16",
  },
  {
    fileId: "ae759aaa-06fa-4b00-b0a3-c29fa977516322",
    fileName: "File 17",
  },
  {
    fileId: "be4e7bf4-77ec-41df-8de5-ad39f246154033",
    fileName: "File 18",
  },
];

export default function Page() {
  return (
    <div className="col-span-2 row-span-2 flex flex-wrap gap-[10px] h-fit">
      {files.map(({ fileId, fileName }) => (
        <Link
          href={`/ml-setup/${fileId}?fileName=${fileName}`}
          key={fileId}
          className=" hover:bg-error-light/10 rounded-[10px] cursor-pointer p-[10px] transition-all"
        >
          <DocumentIcon className="text-error-dark/80 size-[60px]" />
          <p className="text-center text-md text-error-dark font-semibold">
            {fileName}
          </p>
        </Link>
      ))}
    </div>
  );
}
