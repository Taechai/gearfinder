import { ChangeEventHandler } from "react";

const filters = [
  { label: "All", color: "primary" },
  { label: "Unassined", color: "error" },
  { label: "Annotated", color: "success" },
];

interface colorClasses {
  [key: string]: { text: string; textChecked: string; bgChecked: string };

  primary: { text: string; textChecked: string; bgChecked: string };
  error: { text: string; textChecked: string; bgChecked: string };
  success: { text: string; textChecked: string; bgChecked: string };
}

const colorClasses: colorClasses = {
  primary: {
    text: "text-primary-dark/50",
    textChecked: "peer-checked/radio:text-primary-dark",
    bgChecked: "peer-checked/radio:bg-primary-light/50",
  },
  error: {
    text: "text-error-dark/50",
    textChecked: "peer-checked/radio:text-error-dark",
    bgChecked: "peer-checked/radio:bg-error-light/50",
  },
  success: {
    text: "text-success-dark/50",
    textChecked: "peer-checked/radio:text-success-dark",
    bgChecked: "peer-checked/radio:bg-success-light/50",
  },
};

export default function Filter({
  name,
  onChange,
}: {
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div className="flex items-center gap-[10px]">
      {filters.map(({ label, color }) => (
        <label key={label} htmlFor={label} className="relative cursor-pointer ">
          <input
            id={label}
            type="radio"
            name={name}
            className="absolute z-[-1] size-full appearance-none outline-none peer/radio"
            onChange={onChange}
            defaultChecked={label == "Unassined"}
          />
          <p
            className={`w-fit pointer-events-auto peer bg-transparent text-sm transition-all duration-300 p-[5px] rounded-[5px] ${colorClasses[color].text} ${colorClasses[color].textChecked} font-normal peer-checked/radio:font-bold ${colorClasses[color].bgChecked}`}
          >
            {label}
          </p>
        </label>
      ))}
    </div>
  );
}
