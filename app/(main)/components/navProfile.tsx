"use client";
import { BellIcon } from "@heroicons/react/20/solid";
import MerinovLogoWhite from "@/public/merinov-logo-white.png";
import Image from "next/image";
import ListBox from "@/app/components/listBox";
import { signOut } from "next-auth/react";

export default function NavProfile() {
  return (
    <nav className="bg-dark col-span-2 rounded-[10px] flex gap-[10px] p-[10px] items-center">
      <div className="w-[55px] min-w-[30px] aspect-square relative">
        <Image
          className="absolute size-full"
          src={MerinovLogoWhite}
          alt="Merinov Logo"
          width={55}
        />
      </div>
      <div className="w-full">
        <ListBox />
      </div>
      <BellIcon className={"size-[20px] min-w-[20px] text-white"} />
      <div
        onClick={() => {
          signOut();
        }}
        className="h-full cursor-pointer aspect-square bg-light-dark/50 rounded-full flex justify-center items-center font-bold text-white"
      >
        OA
      </div>
    </nav>
  );
}
