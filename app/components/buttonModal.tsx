"use client";

import { useState } from "react";
import Modal from "./modal";
import React from "react";

export default function ButtonModal({
  children,
  btnName,
  modalInfo,
  btnType = undefined,
  twTextColor = "text-white",
  twBg = "bg-dark",
  twFontWeight = "font-normal",
  twHover = "hover:bg-dark/90",
  twFocus = "focus:ring-[3px] focus:ring-dark/30",
  otherTwClass = null,
  disabled = false,
  reverse = false,
  Icon,
}: {
  children: React.ReactNode;
  btnName: string;
  modalInfo: { name: string; value: string }[];
  btnType?: "button" | "submit" | "reset" | undefined;
  twTextColor?: string;
  twFontWeight?: string;
  twBg?: string;
  twHover?: string;
  twFocus?: string;
  otherTwClass?: string | null;
  disabled?: boolean;
  reverse?: boolean;
  Icon?: React.ComponentType<{
    className?: string;
  }>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type={btnType}
        className={
          reverse
            ? `${otherTwClass} flex flex-row-reverse justify-center gap-[10px] text-md outline-none rounded-[10px] p-[10px] ring-0 ring-transparent transition-all duration-150 ${twTextColor} ${twBg} ${twFontWeight} ${twHover} ${twFocus} disabled:bg-dark/50 disabled:text-white/50`
            : `${otherTwClass} flex flex-row justify-center gap-[10px] text-md outline-none rounded-[10px] p-[10px] ring-0 ring-transparent transition-all duration-150 ${twTextColor} ${twBg} ${twFontWeight} ${twHover} ${twFocus} disabled:bg-dark/50 disabled:text-white/50`
        }
        disabled={disabled}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        {Icon && <Icon className="size-[20px]" />}
        {children}
      </button>
      <Modal
        Icon={Icon}
        isOpen={isOpen}
        title={children?.toString()}
        onClose={() => {
          setIsOpen(false);
        }}
      >
        <div className="grid grid-cols-2 gap-[10px] text-md text-dark/70">
          {modalInfo.map(({ name, value }) => (
            <React.Fragment key={name}>
              <p className="font-semibold text-dark">{name}</p>
              <p>{value}</p>
            </React.Fragment>
          ))}
        </div>
      </Modal>
    </>
  );
}
