"use client";
import FileSelectInput from "../components/fileSelectInput";
import SearchBar from "../components/searchBar";
import { ArrowUpTrayIcon } from "@heroicons/react/20/solid";
import Filter from "../components/filter";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import FileContext from "./contexts/fileContext";

const files = [
  { fileId: "1", fileName: "File 1", state: "annotated" },
  { fileId: "2", fileName: "File 2", state: "annotated" },
  { fileId: "3", fileName: "File 3", state: "unassined" },
  { fileId: "4", fileName: "File 4", state: "annotated" },
  { fileId: "5", fileName: "File 5", state: "annotated" },
  { fileId: "6", fileName: "File 6", state: "annotated" },
  { fileId: "7", fileName: "File 7", state: "annotated" },
  { fileId: "8", fileName: "File 8", state: "unassined" },
  { fileId: "9", fileName: "File 9", state: "unassined" },
  { fileId: "10", fileName: "File 10", state: "unassined" },
];

export default function SidescanFileBrowser() {
  const [filteredFiles, setFilteredFiles] = useState<
    { fileId: string; fileName: string; state: string }[]
  >([]);
  const [filterBy, setFilterBy] = useState(["unassined"]);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedFile, setSelectedFile } = useContext(FileContext);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let filterBy = [e.currentTarget.id.toLowerCase()];
    if (filterBy.includes("all")) {
      filterBy = ["unassined", "annotated"];
    }
    setFilterBy(filterBy);
    setFilteredFiles(
      files.filter(
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
      files.filter(
        ({ fileName, state }) =>
          fileName.toLowerCase().includes(searchQuery) &&
          filterBy.includes(state)
      )
    );
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectedFile({
      fileId: e.currentTarget.id,
      fileName: e.currentTarget.value,
    });
  };

  useEffect(() => {
    setFilteredFiles(files.filter(({ state }) => filterBy.includes(state)));
  }, []);

  return (
    <>
      <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
        Sonar Sidescan Files
      </h1>
      <div className="rounded-[10px] flex gap-[10px] p-[1px] items-center ">
        <SearchBar onChange={handleSearchChange} />
        <button className="group p-[10.75px] aspect-square bg-dark/5 rounded-[10px] flex justify-center items-center hover:bg-dark  focus:bg-dark/90 cursor-pointer transition-all">
          <ArrowUpTrayIcon className="size-[15px] text-dark stroke-current stroke-[1px] group-hover:text-white group-focus:text-white transition-all" />
        </button>
      </div>

      <Filter name="filters" onChange={handleFilterChange} />
      {filteredFiles.length != 0 ? (
        <div className="flex flex-col gap-[5px] overflow-auto">
          {filteredFiles.map(({ fileId, fileName }) => (
            <FileSelectInput
              key={fileId}
              fileId={fileId}
              label={fileName}
              name="file-selection"
              selectedFileId={selectedFile.fileId}
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
