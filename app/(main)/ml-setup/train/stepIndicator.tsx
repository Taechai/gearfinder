import { Dispatch, SetStateAction } from "react";

export function StepIndicator({
  stepNumber,
  label,
  setSelectedStep,
  isActive = false,
  isDone = false,
}: {
  stepNumber: number;
  label: string;
  isActive?: boolean;
  isDone?: boolean;
  setSelectedStep: Dispatch<SetStateAction<number>>;
}) {
  return (
    <div
      className={`relative cursor-pointer size-[40px] h-[40px] aspect-square rounded-full ring-0 flex items-center justify-center font-bold  ${
        isActive
          ? "bg-secondary-light text-secondary-dark ring-[3px] ring-secondary-main"
          : isDone
          ? "bg-secondary-dark text-white"
          : "bg-secondary-light text-secondary-dark opacity-50"
      }`}
      onClick={() => setSelectedStep(stepNumber)}
    >
      <p>{stepNumber}</p>
      <p className="absolute left-[50px] text-nowrap text-[18px] text-secondary-dark font-bold">
        {label}
      </p>
    </div>
  );
}
