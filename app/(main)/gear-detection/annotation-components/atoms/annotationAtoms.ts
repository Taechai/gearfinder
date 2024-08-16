import { atom } from "recoil";

interface Annotation {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// State related to the loaded Image
export const imageSizeAtom = atom({
  key: "imageSizeAtom",
  default: { width: "", height: "" },
});

export const selectedSrcAtom = atom({
  key: "selectedSrcAtom",
  default: "",
});

export const applyTransitionAtom = atom({
  key: "applyTransitionAtom",
  default: false,
});

// State related to annotations
export const isDrawingEnabledAtom = atom({
  key: "isDrawingEnabledAtom",
  default: false,
});

export const isDrawingAtom = atom({
  key: "isDrawingAtom",
  default: false,
});

export const isPanningEnabledAtom = atom({
  key: "isPanningEnabledAtom",
  default: false,
});

export const isPanningAtom = atom({
  key: "isPanningAtom",
  default: false,
});

export const panningOffsetAtom = atom({
  key: "panningOffsetAtom",
  default: { x: 0, y: 0 },
});

export const memoryOffsetAtom = atom({
  key: "memoryOffsetAtom",
  default: { x: 0, y: 0 },
});

export const initialOffsetAtom = atom({
  key: "initialOffsetAtom",
  default: { x: 0, y: 0 },
});

export const initialZoomLevelAtom = atom({
  key: "initialZoomLevelAtom",
  default: 100,
});

export const zoomLevelAtom = atom({
  key: "zoomLevelAtom",
  default: 100,
});

export const zoomOffsetAtom = atom({
  key: "zoomOffsetAtom",
  default: { x: 0, y: 0 },
});

export const zoomLimitAtom = atom({
  key: "zoomLimitAtom",
  default: { min: 10, max: 100 },
});

export const isImgLoadedAtom = atom({
  key: "isImgLoadedAtom",
  default: false,
});

export const annotationsAtom = atom<Annotation[]>({
  key: "annotationsAtom",
  default: [],
});

export const annotationAtom = atom<Annotation | null>({
  key: "annotationAtom",
  default: null,
});

export const startPointAtom = atom<{ x: number; y: number } | null>({
  key: "startPointAtom",
  default: null,
});

export const isAnnotPanningEnabledAtom = atom({
  key: "isAnnotPanningEnabledAtom",
  default: false,
});

export const selectedAnnotationAtom = atom<Annotation | null>({
  key: "selectedAnnotationAtom",
  default: null,
});

export const isAnnotResizingEnabledAtom = atom({
  key: "isAnnotResizingEnabledAtom",
  default: false,
});
