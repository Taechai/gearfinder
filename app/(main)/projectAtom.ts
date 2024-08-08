import { atom } from "recoil";

export const currentProjectAtom = atom<{ name: string }>({
    key: "currentProjectAtom",
    default: { name: "" },
});