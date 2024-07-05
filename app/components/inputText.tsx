import { ChangeEventHandler } from "react";

export default function InputText({
  Icon,
  id,
  name,
  type,
  placeholder,
  otherTwClass = null,
  value = undefined,
  required = false,
  onChange = undefined,
  twText = "text-md",
  removeIconBg = false,
  iconSize = "size-[20px]",
  disabled = false,
}: {
  Icon: React.ComponentType<{
    className?: string;
  }>;
  id: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
  value?: string | number | readonly string[] | undefined;
  onChange?: ChangeEventHandler<HTMLInputElement> | undefined;
  otherTwClass?: string | null;
  twText?: string;
  removeIconBg?: boolean;
  iconSize?: string;
  disabled?: boolean;
}) {
  return (
    <div
      className={`${otherTwClass} flex pointer-events-none flex-row-reverse gap-[10px] ring-0 ring-dark justify-center items-center focus-within:bg-light/80 focus-within:ring-[1px] bg-light/50 transition-all rounded-[10px] px-[10px] py-[15px]`}
    >
      <input
        type={type}
        name={name}
        id={id}
        className={`w-full pointer-events-auto peer bg-transparent ${twText} text-dark font-light placeholder:text-dark/35 outline-none disabled:text-dark/70`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
      {removeIconBg ? (
        <Icon
          className={`${iconSize} text-dark/80 peer-focus:text-dark rounded-full transition-all`}
        />
      ) : (
        <Icon
          className={`${iconSize} text-white bg-dark/80 peer-hover:bg-dark peer-focus:bg-dark rounded-full p-[3px] transition-all`}
        />
      )}
    </div>
  );
}
