"use client";

import { DocumentIcon } from "@/app/icons/myIcons";
import Link from "next/link";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { projectFilesAtom } from "../../projectAtom";

export default function Page() {
  const projectFiles = useRecoilValue(projectFilesAtom);
  const projectFilesUnassigned = useMemo(
    () => projectFiles.filter(({ state }) => state == "unassigned"),
    [projectFiles]
  );

  return (
    <>
      {projectFilesUnassigned.length > 0 ? (
        <div className="col-span-2 row-span-2 flex flex-wrap gap-[10px] h-fit">
          {projectFilesUnassigned.map(({ fileId, fileName }) => (
            <Link
              href={`/ml-setup/annotate?id=${fileId}&fileName=${fileName}`}
              key={fileId}
              className=" hover:bg-error-light/10 rounded-[10px] cursor-pointer p-[10px] transition-all"
            >
              <DocumentIcon className="text-error-dark/80 size-[60px] mx-auto" />
              <p className="text-center text-md text-error-dark font-semibold text-nowrap text-ellipsis overflow-hidden max-w-[100px]">
                {fileName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="col-span-2 flex justify-center items-center text-error-dark/50 font-bold text-lg">
          Zero unassigned files found
        </div>
      )}
    </>
  );
}
