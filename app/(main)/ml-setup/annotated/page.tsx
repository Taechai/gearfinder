"use client";

import { DocumentIcon } from "@/app/icons/myIcons";
import Link from "next/link";
import { useMemo } from "react";
import { useRecoilValue } from "recoil";
import { projectFilesAtom } from "../../projectAtom";

export default function Page() {
  const projectFiles = useRecoilValue(projectFilesAtom);
  const projectFilesAnnotated = useMemo(
    () => projectFiles.filter(({ state }) => state == "annotated"),
    [projectFiles]
  );

  return (
    <>
      {projectFilesAnnotated.length > 0 ? (
        <div className="col-span-2 row-span-2 flex flex-wrap gap-[10px] h-fit ">
          {projectFilesAnnotated.map(({ fileId, fileName }) => (
            <Link
              href={`/ml-setup/annotate?id=${fileId}&fileName=${fileName}`}
              key={fileId}
              className=" hover:bg-success-light/10 rounded-[10px] cursor-pointer p-[10px] transition-all"
            >
              <DocumentIcon className="text-success-dark/80 size-[60px] mx-auto" />
              <p className="text-center text-md text-success-dark font-semibold">
                {fileName}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="col-span-2 flex justify-center items-center text-success-dark/50 font-bold text-lg">
          Zero annotated files found
        </div>
      )}
    </>
  );
}
