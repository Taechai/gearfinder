"use client";
import FileSelectInput from "../components/fileSelectInput";
import SearchBar from "../components/searchBar";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import Filter from "../components/filter";
import { ChangeEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import { projectFilesAtom } from "../projectAtom";
import Link from "next/link";

export default function SidescanFileBrowser() {
  const projectFiles = useRecoilValue(projectFilesAtom);
  const [filteredFiles, setFilteredFiles] = useState<
    { fileId: string; fileName: string; state: string }[]
  >([]);
  const selectedFileId = useSearchParams().get("id") || "";
  // const [filterBy, setFilterBy] = useState<string[]>(() => {
  //   const selectedFile = projectFiles.find(
  //     ({ fileId }) => fileId === selectedFileId
  //   );
  //   return [selectedFile ? selectedFile.state : "unassigned"];
  // });

  const [filterBy, setFilterBy] = useState<string[]>([
    "all",
    "unassigned",
    "annotated",
  ]);

  const [searchQuery, setSearchQuery] = useState("");

  const router = useRouter();

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filterBy = [e.currentTarget.id.toLowerCase()];
    if (filterBy.includes("all")) {
      filterBy = ["unassigned", "annotated"];
    }
    setFilterBy(filterBy);
    setFilteredFiles(
      projectFiles.filter(
        ({ fileName, state }) =>
          filterBy.includes(state) &&
          fileName.toLowerCase().includes(searchQuery)
      )
    );
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchQuery = e.currentTarget.value.toLowerCase();
    setSearchQuery(searchQuery);

    setFilteredFiles(
      projectFiles.filter(
        ({ fileName, state }) =>
          fileName.toLowerCase().includes(searchQuery) &&
          filterBy.includes(state)
      )
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    router.push(
      `/gear-detection?id=${e.currentTarget.id}&fileName=${e.currentTarget.value}`
    );
  };

  useEffect(() => {
    setFilteredFiles(
      projectFiles.filter(({ state }) => filterBy.includes(state))
    );
  }, [projectFiles]);

  return (
    <>
      <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
        Sonar Sidescan Files
      </h1>
      <div className="rounded-[10px] flex gap-[10px] p-[1px] items-center ">
        <SearchBar onChange={handleSearchChange} />
        <Link
          href={"/ml-setup/upload-file"}
          className="group p-[10.75px] aspect-square bg-dark/5 rounded-[10px] flex justify-center items-center hover:bg-dark  focus:bg-dark/90 cursor-pointer transition-all"
        >
          <ArrowUpTrayIcon className="size-[15px] text-dark stroke-current stroke-[1px] group-hover:text-white group-focus:text-white transition-all" />
        </Link>
      </div>

      <Filter
        name="filters"
        onChange={handleFilterChange}
        defaultCheckedValue={filterBy[0]}
      />
      {filteredFiles.length != 0 ? (
        <div className="flex flex-col gap-[5px] overflow-auto">
          {filteredFiles.map(({ fileId, fileName, state }) => (
            <FileSelectInput
              key={fileId}
              fileId={fileId}
              label={fileName}
              state={state}
              name="file-selection"
              selectedFileId={selectedFileId}
              onChange={handleFileChange}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center text-md text-black/30 font-semibold gap-[5px] h-full overflow-auto bg-black/5 rounded-[10px]">
          Zero files found.
        </div>
      )}
    </>
  );
}
