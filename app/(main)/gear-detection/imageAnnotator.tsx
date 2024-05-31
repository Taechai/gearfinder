// write the Annotation Component
// Add callbacks to minimize events recreations
// Move controls to their proper section

import React, { useCallback, useRef } from "react";

import {
  zoomLevelAtom,
  zoomLimitAtom,
  zoomOffsetAtom,
} from "./annotation-components/atoms/annotationAtoms";
import { useSetRecoilState } from "recoil";

import Controls from "./annotation-components/controls";

import AnnotationLayer from "./annotation-components/annotationLayer";

export default function ImageAnnotator() {
  // Variables related to the loaded image
  const setZoomLevel = useSetRecoilState(zoomLevelAtom);
  const setZoomLimit = useSetRecoilState(zoomLimitAtom);
  const setZoomOffset = useSetRecoilState(zoomOffsetAtom);

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
