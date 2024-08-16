// write the Annotation Component
// Add callbacks to minimize events recreations
// Move controls to their proper section

import React, { useCallback, useEffect, useRef } from "react";

import {
  annotationsAtom,
  zoomLevelAtom,
  zoomLimitAtom,
  zoomOffsetAtom,
} from "./annotation-components/atoms/annotationAtoms";
import { useRecoilValue, useSetRecoilState } from "recoil";

import Controls from "./annotation-components/controls";

import AnnotationLayer from "./annotation-components/annotationLayer";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { currentProjectAtom } from "../projectAtom";

export default function ImageAnnotator() {
  // Variables related to the loaded image
  const setZoomLevel = useSetRecoilState(zoomLevelAtom);
  const setZoomLimit = useSetRecoilState(zoomLimitAtom);
  const setZoomOffset = useSetRecoilState(zoomOffsetAtom);
  const setAnnotations = useSetRecoilState(annotationsAtom);
  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const resetZoomLevel = useCallback(() => {
    if (!containerRef.current || !imageRef.current)
      return { imgW: 0, imgH: 0, newZoomLevel: 100 };
    const imgW = imageRef.current?.naturalWidth;
    const imgH = imageRef.current?.naturalHeight;
    const { width: containerW, height: containerH } =
      containerRef.current?.getBoundingClientRect();

    const zoomLevelX = containerW / imgW;
    const zoomLevelY = containerH / imgH;
    let newZoomLevel;
    if (
      (zoomLevelX < 1 && zoomLevelY < 1) ||
      (zoomLevelX > 1 && zoomLevelY > 1)
    ) {
      // Choose the zoom level furthest from 1 (smallest if both < 1, or largest if both > 1)
      newZoomLevel =
        Math.abs(zoomLevelX - 1) > Math.abs(zoomLevelY - 1)
          ? zoomLevelX * 100
          : zoomLevelY * 100;

      setZoomLevel(newZoomLevel);
      setZoomLimit(
        Math.abs(zoomLevelX - 1) > Math.abs(zoomLevelY - 1)
          ? { min: zoomLevelX * 10, max: zoomLevelX * 1000 }
          : { min: zoomLevelY * 10, max: zoomLevelY * 1000 }
      );
    } else {
      // If one zoom level is above 1 and the other is below, choose the one below 1
      newZoomLevel = zoomLevelX < 1 ? zoomLevelX * 100 : zoomLevelY * 100;
      setZoomLevel(newZoomLevel);
      setZoomLimit(
        zoomLevelX < 1
          ? { min: zoomLevelX * 10, max: zoomLevelX * 1000 }
          : { min: zoomLevelY * 10, max: zoomLevelY * 1000 }
      );
    }
    setZoomOffset({ x: 0, y: 0 });

    return { imgW, imgH, newZoomLevel };
  }, []);

  const fileId = useSearchParams().get("id");
  useEffect(() => {
    // If a user changes the selected file, there should be loading of the new annotations for the selected file
    setAnnotations([]);
    if (fileId) {
      console.log("Fetching the corresponding annotations");
      fetch(`/api/get-annotations?id=${fileId}`, { method: "GET" })
        .then((res) => res.json())
        .then(({ annotations }) => {
          console.log("Annotations for file", fileId);
          console.log(annotations);
          setAnnotations(() =>
            annotations.map(
              ({
                id,
                boundingBox,
              }: {
                id: number | string;
                boundingBox: {};
              }) => ({ id, ...boundingBox })
            )
          );
        });
    }
  }, [fileId]);
  // useEffect(() => {
  //   // To avoid trying to fetch annotations for file that doesn't belong to the current project
  //   router.replace(pathname);
  // }, [currentProject]);
  return (
    <>
      <AnnotationLayer
        resetZoomLevel={resetZoomLevel}
        imageRef={imageRef}
        containerRef={containerRef}
      />
      <Controls resetZoomLevel={resetZoomLevel} />
    </>
  );
}
