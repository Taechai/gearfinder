import { atom } from "recoil";

export const currentProjectAtom = atom<{ name: string }>({
    key: "currentProjectAtom",
    default: { name: "" },
});

export const projectFilesAtom = atom<{
    imagePath: string,
    fileName: string,
    fileId: string,
    state: string
}[]>({
    key: "projectFilesAtom",
    default: [],
});