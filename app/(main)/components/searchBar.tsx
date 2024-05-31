import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import { ChangeEventHandler } from "react";

export default function SearchBar({
  onChange,
}: {
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div
      className={`w-full bg-dark/5 focus-within:bg-dark/10 p-[10px] flex pointer-events-none flex-row-reverse gap-[10px] ring-0 ring-dark justify-center items-center  focus-within:ring-[1px]  transition-all rounded-[10px] `}
    >
      <input
        type="text"
        name="search-bar"
        id="search-bar"
        className={`w-full pointer-events-auto peer bg-transparent text-sm text-dark font-light placeholder:text-dark/35 outline-none`}
        placeholder="Search files"
        onChange={onChange}
      />

      <MagnifyingGlassIcon
        className={`size-[11px] text-dark/80 peer-focus:text-dark rounded-full transition-all`}
      />
    </div>
  );
}
