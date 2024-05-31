"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

interface NavState {
  [key: string]: { isChecked: boolean; label: string; color: string }; // Index signature
  "upload-file": { isChecked: boolean; label: string; color: string };
  unassigned: { isChecked: boolean; label: string; color: string };
  annotated: { isChecked: boolean; label: string; color: string };
  train: { isChecked: boolean; label: string; color: string };
}
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
  secondary: {
    text: "text-secondary-dark/50",
    textChecked: "peer-checked/radio:text-secondary-dark",
    bgChecked: "peer-checked/radio:bg-secondary-light/50",
  },
};

export default function MlSetupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  const [navState, setNavState] = useState<NavState>({
    "upload-file": { isChecked: false, label: "Upload", color: "primary" },
    unassigned: { isChecked: false, label: "Unassigned", color: "error" },
    annotated: { isChecked: false, label: "Annotated", color: "success" },
    train: { isChecked: false, label: "Train", color: "secondary" },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPath = `/ml-setup/${e.target.id}`;
    router.push(newPath);
    setNavState({
      "upload-file": {
        ...navState["upload-file"],
        isChecked: newPath === "/ml-setup/upload-file",
      },
      unassigned: {
        ...navState["unassigned"],
        isChecked: newPath === "/ml-setup/unassigned",
      },
      annotated: {
        ...navState["annotated"],
        isChecked: newPath === "/ml-setup/annotated",
      },
      train: {
        ...navState["train"],
        isChecked: newPath === "/ml-setup/train",
      },
    });
  };
  useEffect(() => {
    setNavState({
      "upload-file": {
        ...navState["upload-file"],
        isChecked: pathname.includes("upload-file"),
      },
      unassigned: {
        ...navState["unassigned"],
        isChecked: pathname.includes("unassigned"),
      },
      annotated: {
        ...navState["annotated"],
        isChecked: pathname.includes("annotated"),
      },
      train: {
        ...navState["train"],
        isChecked: pathname.includes("train"),
      },
    });
  }, [pathname]);

  return (
    <>
      {["unassigned", "annotated", "train", "upload-file"].includes(
        pathname.split("/")[2]
      ) && (
        <div className="col-span-2 px-[10px] flex flex-start gap-[20px]">
          {Object.keys(navState).map((key) => (
            <label
              key={navState[key].label}
              htmlFor={key}
              className="relative cursor-pointer"
            >
              <input
                id={key}
                type="radio"
                name={"name"}
                className="absolute z-[-1] size-full appearance-none outline-none peer/radio"
                checked={navState[key].isChecked}
                onChange={handleChange}
              />
              <p
                className={`w-fit pointer-events-auto peer bg-transparent text-md transition-all duration-300 p-[5px] rounded-[5px] ${
                  colorClasses[navState[key].color].text
                } ${
                  colorClasses[navState[key].color].textChecked
                } font-normal peer-checked/radio:font-bold ${
                  colorClasses[navState[key].color].bgChecked
                }`}
              >
                {navState[key].label}
              </p>
            </label>
          ))}
        </div>
      )}
      {children}
    </>
  );
}
