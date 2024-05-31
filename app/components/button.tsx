import { MouseEventHandler } from "react";

export default function Button({
  children,
  btnType = undefined,
  twTextColor = "text-white",
  twBg = "bg-dark",
  twFontWeight = "font-normal",
  twHover = "hover:bg-dark/90",
  twFocus = "focus:ring-[3px] focus:ring-dark/30",
  otherTwClass = null,
  disabled = false,
  reverse = false,
  onClick,
  Icon,
}: {
  children?: React.ReactNode;
  btnType?: "button" | "submit" | "reset" | undefined;
  twTextColor?: string;
  twFontWeight?: string;
  twBg?: string;
  twHover?: string;
  twFocus?: string;
  otherTwClass?: string | null;
  disabled?: boolean;
  reverse?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement> | undefined;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
}) {
  return (
    <button
      type={btnType}
      className={
        reverse
          ? `${otherTwClass} flex flex-row-reverse justify-center gap-[10px] text-md outline-none rounded-[10px] p-[10px] ring-0 ring-transparent transition-all duration-150 ${twTextColor} ${twBg} ${twFontWeight} ${twHover} ${twFocus} disabled:bg-dark/50 disabled:text-white/50`
          : `${otherTwClass} flex flex-row justify-center gap-[10px] text-md outline-none rounded-[10px] p-[10px] ring-0 ring-transparent transition-all duration-150 ${twTextColor} ${twBg} ${twFontWeight} ${twHover} ${twFocus} disabled:bg-dark/50 disabled:text-white/50`
      }
      disabled={disabled}
      onClick={onClick}
    >
      {Icon && <Icon className="size-[20px]" />}
      {children}
    </button>
  );
}
