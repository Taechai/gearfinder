"use client";

import { usePathname, useRouter } from "next/navigation";
import { ChangeEventHandler, useEffect, useState } from "react";
import Button from "@/app/components/button";
import { ShareIcon, FolderPlusIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
interface navState {
  [key: string]: { isChecked: boolean; label: string }; // Index signature

  "gear-detection": { isChecked: boolean; label: string };
  "ml-setup/unassigned": { isChecked: boolean; label: string };
  "gear-map": { isChecked: boolean; label: string };
}

export default function NavMain() {
  const router = useRouter();
  const pathname = usePathname();
  const [navState, setNavState] = useState<navState>({
    "gear-detection": { isChecked: false, label: "Gear Detection" },
    "ml-setup/unassigned": { isChecked: false, label: "Label & Train" },
    "gear-map": { isChecked: false, label: "Gear Map" },
  });

  useEffect(() => {
    setNavState({
      "gear-detection": {
        ...navState["gear-detection"],
        isChecked: pathname.includes("/gear-detection"),
      },
      "ml-setup/unassigned": {
        ...navState["ml-setup/unassigned"],
        isChecked: pathname.includes("/ml-setup"),
      },
      "gear-map": {
        ...navState["gear-map"],
        isChecked: pathname === "/gear-map",
      },
    });
  }, [pathname]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    router.push(`/${e.target.id}`);
    setNavState({
      "gear-detection": {
        ...navState["gear-detection"],
        isChecked: e.target.id === "gear-detection",
      },
      "ml-setup/unassigned": {
        ...navState["ml-setup/unassigned"],
        isChecked: e.target.id === "ml-setup/unassigned",
      },
      "gear-map": {
        ...navState["gear-map"],
        isChecked: e.target.id === "gear-map",
      },
    });
  };

  return (
    <div className="col-span-2 px-[10px] flex justify-between items-center">
      <div className="gap-[20px] flex items-center">
        {Object.keys(navState).map((key) => (
          <RadioInput
            key={key}
            id={key}
            label={navState[key].label}
            checked={navState[key].isChecked}
            name="nav-main"
            onChange={handleChange}
          />
        ))}
      </div>
      <div className="flex gap-[10px]">
        {/* <Link href="/create">ADD</Link> */}
        <Button
          Icon={FolderPlusIcon}
          otherTwClass={"bg-primary-light !text-primary-dark !font-bold"}
          twHover="hover:bg-primary-main/30"
          twFocus="focus:ring-[3px] focus:ring-primary-dark/50"
          onClick={() => {
            router.push("/create-project");
          }}
        >
          Add New Project
        </Button>
        <Button
          Icon={ShareIcon}
          otherTwClass={"bg-secondary-light/50 !text-secondary-dark !font-bold"}
          twHover="hover:bg-secondary-light/75"
          twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
        >
          Share
        </Button>
      </div>
    </div>
  );
}

const RadioInput = ({
  id,
  checked,
  label,
  name,
  onChange,
}: {
  id: string;
  checked: boolean;
  label: string;
  name: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
}) => {
  return (
    <label htmlFor={id} className="relative hover:cursor-pointer flex flex-col">
      <input
        id={id}
        type="radio"
        name={name}
        className="absolute peer/radio appearance-none outline-none"
        onChange={onChange}
        checked={checked}
      />
      <h1 className="text-lg text-dark/70 font-normal transition-all peer-checked/radio:font-bold peer-checked/radio:text-dark">
        {label}
      </h1>
      <div className="h-[3.5px] bg-dark rounded-full transition-all ease-in-out duration-500 translate-y-[3px] peer-checked/radio:translate-y-0 opacity-0 peer-checked/radio:opacity-100" />
    </label>
  );
};
