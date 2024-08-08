import { DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { ChangeEventHandler } from "react";
export default function FileSelectInput({
  fileId,
  label,
  name,
  selectedFileId,
  onChange,
}: {
  fileId: string;
  label: string;
  name: string;
  selectedFileId: string;
  onChange: ChangeEventHandler;
}) {
  return (
    <label
      key={fileId}
      htmlFor={fileId}
      className={`relative flex flex-row gap-[10px] justify-center items-center transition-all duration-300 p-[10px] cursor-pointer`}
    >
      <input
        id={fileId}
        type="radio"
        name={name}
        className="absolute z-[-1] size-full appearance-none outline-none peer/radio "
        onChange={onChange}
        value={label}
        checked={fileId == selectedFileId}
      />
      <div className="z-[-1] absolute size-full rounded-[10px] bg-black/5 border-[1px] border-black/40 peer-checked/radio:bg-primary-light peer-checked/radio:border-primary-dark" />
      <DocumentTextIcon
        className={`size-[15px] transition-all duration-300 text-black/50 peer-checked/radio:text-primary-dark`}
      />
      <p
        className={`w-full pointer-events-auto peer bg-transparent text-sm text-black/50 peer-checked/radio:text-primary-dark font-normal`}
      >
        {label}
      </p>
      <CheckCircleIcon className="size-[15px] opacity-0 scale-90 text-primary-dark hover:scale-110 cursor-pointer transition-all duration-300 ease-in-out peer-checked/radio:opacity-100 peer-checked/radio:scale-100" />
    </label>
  );
}
