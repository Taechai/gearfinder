import { CheckIcon } from "@heroicons/react/20/solid";

export default function CheckBox({
  labelText,
  id,
  defaultChecked,
}: {
  labelText?: string;
  id: string;
  defaultChecked?: boolean | undefined;
}) {
  return (
    <label
      htmlFor={id}
      className="relative hover:cursor-pointer flex items-center gap-[10px] text-md font-medium text-dark"
    >
      <input
        id={id}
        type="checkbox"
        className="appearance-none peer size-[20px] border border-solid border-dark rounded-[5px] checked:bg-dark transition-all ring-0 ring-dark/30 focus:ring-[1px] outline-none"
        defaultChecked={defaultChecked}
      />
      <CheckIcon className="ease-in-out size-[15px] left-[2.5px] stroke-2 text-transparent absolute transition-all duration-100 peer-checked:opacity-100 peer-checked:text-white peer-checked:scale-100 scale-0 peer-checked:rotate-0 rotate-45 peer-checked:duration-500" />
      {labelText && <p className="text-md font-normal">{labelText}</p>}
    </label>
  );
}
