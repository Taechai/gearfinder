"use client";
import { Fragment, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronDownIcon } from "@heroicons/react/20/solid";

const people = [
  { name: "Summer Trip 2020" },
  { name: "Summer Trip 2021" },
  { name: "Autumn Trip 2021" },
  { name: "Summer Trip 2022" },
  { name: "Autumn Trip 2023" },
  { name: "Random Trip On 10/06/2023" },
];

export default function ListBox({
  btnBgColor = "bg-light-dark/20",
  btnTextColor = "text-white",
  listOptionsBgColor = "bg-white/30",
  listOptionTextColor = "text-dark/50",
  selectedBgColor = "bg-light-dark/50",
  selectedTextColor = "text-dark",
}: {
  btnBgColor?: string;
  btnTextColor?: string;
  listOptionsBgColor?: string;
  listOptionTextColor?: string;
  selectedBgColor?: string;
  selectedTextColor?: string;
}) {
  const [selected, setSelected] = useState(people[0]);

  return (
    <div className="w-fit max-w-[200px]">
      <Listbox value={selected} onChange={setSelected}>
        <div className="group relative ">
          <Listbox.Button
            className={`relative w-full cursor-pointer rounded-[10px] ${btnBgColor} p-[10px] outline-none focus-visible:border-white/10 text-md ${btnTextColor} font-bold flex justify-between gap-[10px]`}
          >
            <span className="block truncate">{selected.name}</span>
            <ChevronDownIcon
              className="size-[20px] min-w-[20px] text-white group-hover:translate-y-[2px] transition-all"
              aria-hidden="true"
            />
          </Listbox.Button>
          <Transition
            as={Fragment}
            enter="transition ease-in-out duration-300"
            enterFrom="opacity-0 translate-y-[-5px]"
            enterTo="opacity-100 translate-y-[0px]"
            leave="transition ease-in-out duration-300"
            leaveFrom="opacity-100 translate-y-[0px]"
            leaveTo="opacity-0 translate-y-[-5px]"
          >
            <Listbox.Options
              className={`z-10 absolute mt-[7px] max-h-[145px] w-full overflow-auto rounded-[10px] ${listOptionsBgColor} backdrop-blur-sm p-[5px] text-base shadow-lg ring-1 ring-black/5 focus:outline-none text-md`}
            >
              {people.map((person, personIdx) => (
                <Listbox.Option
                  key={personIdx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none p-[5px] flex items-center gap-[10px] rounded-[10px] transition-all ${
                      active ? selectedBgColor : null
                    }`
                  }
                  value={person}
                >
                  {({ selected }) => (
                    <>
                      {selected ? (
                        <span className="size-[15px] min-w-[15px] flex justify-center items-center">
                          <CheckIcon
                            className="size-[15px] text-dark stroke-current stroke-[1px]"
                            aria-hidden="true"
                          />
                        </span>
                      ) : (
                        <span className="flex size-[15px] min-w-[15px] items-center"></span>
                      )}
                      <span
                        className={`block truncate ${
                          selected
                            ? `font-semibold ${selectedTextColor}`
                            : `font-normal ${listOptionTextColor}`
                        }`}
                      >
                        {person.name}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
