import { selector } from "recoil";
import {
  zoomOffsetAtom,
  panningOffsetAtom,
  memoryOffsetAtom,
  annotationsAtom,
  zoomLevelAtom,
  annotationAtom,
  initialZoomLevelAtom,
} from "./annotationAtoms";

export const totalOffsetSelector = selector({
  key: "totalOffsetSelector", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const zoomOffset = get(zoomOffsetAtom);
    const panningOffset = get(panningOffsetAtom);
    const memoryOffset = get(memoryOffsetAtom);

    return {
      x: zoomOffset.x + panningOffset.x + memoryOffset.x,
      y: zoomOffset.y + panningOffset.y + memoryOffset.y,
    };
  },
});

export const displayedAnnotationsSelector = selector({
  key: "displayedAnnotationsSelector",
  get: ({ get }) => {
    const annotations = get(annotationsAtom);
    const totalOffset = get(totalOffsetSelector);
    const zoomLevel = get(zoomLevelAtom);
    return annotations.map((annot) => ({
      ...annot,
      x: annot.x * (zoomLevel / 100) + totalOffset.x,
      y: annot.y * (zoomLevel / 100) + totalOffset.y,
      width: (annot.width * zoomLevel) / 100,
      height: (annot.height * zoomLevel) / 100,
    }));
  },
});

export const drawnAnnotationSelector = selector({
  key: "drawnAnnotationSelector",
  get: ({ get }) => {
    const annotation = get(annotationAtom);
    const totalOffset = get(totalOffsetSelector);
    return annotation != null
      ? {
          ...annotation,
          x:
            annotation.width >= 0
              ? annotation.x + totalOffset.x
              : annotation.x + annotation.width + totalOffset.x,
          y:
            annotation.height >= 0
              ? annotation.y + totalOffset.y
              : annotation.y + annotation.height + totalOffset.y,
          width: Math.abs(annotation.width),
          height: Math.abs(annotation.height),
        }
      : null;
  },
});

export const displayedZoomLevelSelector = selector({
  key: "displayedZoomLevelSelector",
  get: ({ get }) => {
    const initialZoomLevel = get(initialZoomLevelAtom);
    const zoomLevel = get(zoomLevelAtom);
    const displayedZoomLevel = Math.floor((zoomLevel * 100) / initialZoomLevel);
    if (displayedZoomLevel.toString() == "NaN") return 100;
    return displayedZoomLevel;
  },
});
