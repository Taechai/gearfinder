import { DocumentTextIcon, CheckCircleIcon } from "@heroicons/react/20/solid";
import { ChangeEventHandler } from "react";
export default function FileSelectInput({
  fileId,
  label,
  name,
  selectedFileId,
  state,
  onChange,
}: {
  fileId: string;
  label: string;
  name: string;
  selectedFileId: string;
  state: string;
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
      <div
        className={`z-[-1] absolute size-full rounded-[10px] transition-all duration-300 ${
          state == "annotated"
            ? "bg-success-dark/5 border-[1px] border-success-dark/40 peer-checked/radio:bg-success-light/40 peer-checked/radio:border-success-dark"
            : "bg-error-dark/5 border-[1px] border-error-dark/40 peer-checked/radio:bg-error-light/40 peer-checked/radio:border-error-dark"
        }`}
      />
      <DocumentTextIcon
        className={`size-[15px] transition-all duration-300 ${
          state == "annotated"
            ? "text-success-dark/80 peer-checked/radio:text-success-dark"
            : "text-error-dark/80 peer-checked/radio:text-error-dark"
        }`}
      />
      <p
        className={`w-full pointer-events-auto peer bg-transparent text-sm transition-all duration-300 ${
          state == "annotated"
            ? "text-success-dark/80 peer-checked/radio:text-success-dark"
            : "text-error-dark/80 peer-checked/radio:text-error-dark"
        } font-normal`}
      >
        {label}
      </p>
      <CheckCircleIcon
        className={`size-[15px] opacity-0 scale-90 hover:scale-110 cursor-pointer ease-in-out transition-all duration-300 peer-checked/radio:opacity-100 peer-checked/radio:scale-100 ${
          state == "annotated" ? "text-success-dark" : "text-error-dark"
        }`}
      />
    </label>
  );
}
