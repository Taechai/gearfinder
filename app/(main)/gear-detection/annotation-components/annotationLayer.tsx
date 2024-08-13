// Done: When I drage a box and the cursor is out of the container it should unfocus
// When drawing a box, we should be able to resize and pan it

import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  annotationAtom,
  annotationsAtom,
  applyTransitionAtom,
  isAnnotPanningEnabledAtom,
  isAnnotResizingEnabledAtom,
  isDrawingAtom,
  isDrawingEnabledAtom,
  isPanningAtom,
  isPanningEnabledAtom,
  memoryOffsetAtom,
  panningOffsetAtom,
  selectedAnnotationAtom,
  startPointAtom,
  zoomLevelAtom,
  zoomLimitAtom,
  zoomOffsetAtom,
} from "./atoms/annotationAtoms";
import {
  totalOffsetSelector,
  displayedAnnotationsSelector,
  drawnAnnotationSelector,
} from "./atoms/annotationSelectors";
import Annotation from "./annotation";
import ImageDisplay from "./imageDisplay";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { throttle } from "lodash";
import React from "react";
import { useSearchParams } from "next/navigation";

interface Annotation {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default React.memo(function AnnotationLayer({
  imageRef,
  containerRef,
  resetZoomLevel,
}: {
  imageRef: RefObject<HTMLImageElement>;
  containerRef: RefObject<HTMLDivElement>;
  resetZoomLevel: () => {
    imgW: number;
    imgH: number;
    newZoomLevel: number;
  };
}) {
  const applyTransition = useRecoilValue(applyTransitionAtom);

  // Variables relateid to annotations
  const isDrawingEnabled = useRecoilValue(isDrawingEnabledAtom);
  const [isDrawing, setIsDrawing] = useRecoilState(isDrawingAtom);

  const isPanningEnabled = useRecoilValue(isPanningEnabledAtom);
  const [isPanning, setIsPanning] = useRecoilState(isPanningAtom);

  const [panningOffset, setPanningOffset] = useRecoilState(panningOffsetAtom);
  const [memoryOffset, setMemoryOffset] = useRecoilState(memoryOffsetAtom);
  // const setInitialOffset = useSetRecoilState(initialOffsetAtom);

  const [zoomLevel, setZoomLevel] = useRecoilState(zoomLevelAtom); // Zoom level in percent
  const [zoomOffset, setZoomOffset] = useRecoilState(zoomOffsetAtom);
  const zoomLimit = useRecoilValue(zoomLimitAtom);

  // const [isImgLoaded, setIsImgLoaded] = useRecoilState(isImgLoadedAtom);

  const [annotations, setAnnotations] = useRecoilState(annotationsAtom);
  const [annotation, setAnnotation] = useRecoilState(annotationAtom);
  const [startPoint, setStartPoint] = useRecoilState(startPointAtom);

  // Variables related to annotations control
  const [isAnnotPanningEnabled, setIsAnnotPanningEnabled] = useRecoilState(
    isAnnotPanningEnabledAtom
  );
  const [selectedAnnotation, setSelectedAnnotation] = useRecoilState(
    selectedAnnotationAtom
  );

  const displayedAnnotations = useRecoilValue(displayedAnnotationsSelector);
  const drawnAnnotation = useRecoilValue(drawnAnnotationSelector);

  const [pressedKey, setPressedKey] = useState("");

  // References
  // const imageRef = useRef<HTMLImageElement>(null);
  // const containerRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);

  const calculateRelativePosition = useCallback(
    (e: React.MouseEvent, refObj: RefObject<HTMLElement>) => {
      const refObjCoord = refObj.current?.getBoundingClientRect();
      const x = e.clientX - (refObjCoord?.left ?? 0);
      const y = e.clientY - (refObjCoord?.top ?? 0);
      const w = refObjCoord?.width;
      const h = refObjCoord?.height;
      const isClickInsideElm = x >= 0 && y >= 0 && w && x <= w && h && y <= h;
      return { x, y, w, h, isClickInsideElm };
    },
    []
  );

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (e.button !== 0) return;
      if (isDrawingEnabled) {
        const {
          x,
          y,
          isClickInsideElm: isAllowed,
        } = calculateRelativePosition(e, imageRef);
        if (!isAllowed) return;

        setStartPoint({ x, y });
        setIsDrawing(true);
        setAnnotation({
          id: nextId.current++,
          x: x,
          y: y,
          width: 0,
          height: 0,
        });
      } else if (isPanningEnabled) {
        containerRef.current?.classList.add("cursor-grabbing");
        const { x, y } = calculateRelativePosition(e, containerRef);
        setStartPoint({ x, y });
        setIsPanning(true);
      }
    },
    [isDrawingEnabled, isPanningEnabled]
  );
  const [isAnnotResizingEnabled, setIsAnnotResizingEnabled] = useRecoilState(
    isAnnotResizingEnabledAtom
  );
  const handleMouseMove = useCallback(
    throttle(
      (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        const { x, y, w, h } = calculateRelativePosition(e, imageRef);

        if (isDrawingEnabled && isDrawing && startPoint) {
          if (pressedKey === "Escape") {
            setAnnotation(null);
            setStartPoint(null);
            setIsDrawing(false);
            return;
          }

          const width = x - startPoint.x;
          const height = y - startPoint.y;

          if (annotation && annotation.id === nextId.current - 1) {
            setAnnotation({
              ...annotation,
              width:
                startPoint.x + width > w!
                  ? w! - startPoint.x
                  : startPoint.x + width < 0
                  ? -startPoint.x
                  : width,
              height:
                startPoint.y + height > h!
                  ? h! - startPoint.y
                  : startPoint.y + height < 0
                  ? -startPoint.y
                  : height,
            });
          }
        } else if (isPanning && startPoint) {
          const containerCoord = containerRef.current?.getBoundingClientRect();
          const x = e.clientX - (containerCoord?.left ?? 0);
          const y = e.clientY - (containerCoord?.top ?? 0);

          const offsetX = x - startPoint.x;
          const offsetY = y - startPoint.y;
          setPanningOffset({
            x: offsetX,
            y: offsetY,
          });
        } else if (isAnnotPanningEnabled && startPoint && selectedAnnotation) {
          const annotOffsetX = x - startPoint.x;
          const annotOffsetY = y - startPoint.y;
          const newAnnotation = {
            ...selectedAnnotation,
            x: selectedAnnotation.x + annotOffsetX,
            y: selectedAnnotation.y + annotOffsetY,
            width: selectedAnnotation.width,
            height: selectedAnnotation.height,
          };

          if (w && h)
            setAnnotation(() => {
              const clampedX = Math.min(
                Math.max(newAnnotation.x, 0),
                w - newAnnotation.width
              );

              const clampedY = Math.min(
                Math.max(newAnnotation.y, 0),
                h - newAnnotation.height
              );

              return {
                ...newAnnotation,
                x: clampedX,
                y: clampedY,
              };
            });
        } else if (isAnnotResizingEnabled && startPoint && selectedAnnotation) {
          const deltaX = x - startPoint.x;
          const deltaY = y - startPoint.y;
          const newAnnotation = {
            ...selectedAnnotation,
            x: selectedAnnotation.x,
            y: selectedAnnotation.y,
            width: selectedAnnotation.width + deltaX,
            height: selectedAnnotation.height + deltaY,
          };

          if (w && h)
            setAnnotation(() => {
              const updatedWidth =
                newAnnotation.width < 10
                  ? 10
                  : newAnnotation.x + newAnnotation.width > w
                  ? w - newAnnotation.x
                  : newAnnotation.width;

              const updatedHeight =
                newAnnotation.height < 10
                  ? 10
                  : newAnnotation.y + newAnnotation.height > h
                  ? h - newAnnotation.y
                  : newAnnotation.height;

              return {
                ...newAnnotation,
                width: updatedWidth,
                height: updatedHeight,
              };
            });
        }
      },
      isPanning || isAnnotPanningEnabled || isAnnotResizingEnabled ? 10 : 2000
    ),
    [
      isDrawingEnabled,
      isDrawing,
      startPoint,
      isPanning,
      annotation,
      isAnnotPanningEnabled,
      startPoint,
      selectedAnnotation,
      isAnnotResizingEnabled,
      pressedKey,
    ]
  );

  const handleMouseUp = useCallback(() => {
    setStartPoint(null);
    if (isDrawingEnabled && annotation) {
      setIsDrawing(false);
      // The array have normalized annotations => no negative width or height even if the user draws in the reverse sense
      setAnnotations((prevAnnotations) => [
        ...prevAnnotations,
        {
          ...annotation,
          x:
            annotation.width >= 0
              ? (annotation.x * 100) / zoomLevel
              : ((annotation.x + annotation.width) * 100) / zoomLevel,
          y:
            annotation.height >= 0
              ? (annotation.y * 100) / zoomLevel
              : ((annotation.y + annotation.height) * 100) / zoomLevel,
          width: Math.abs((annotation.width * 100) / zoomLevel),
          height: Math.abs((annotation.height * 100) / zoomLevel),
        },
      ]);
      setAnnotation(null);
    } else if (
      isPanningEnabled &&
      !isAnnotPanningEnabled &&
      !isAnnotResizingEnabled
    ) {
      setIsPanning(false);
      setStartPoint(null);
      setMemoryOffset({
        x: panningOffset.x + memoryOffset.x,
        y: panningOffset.y + memoryOffset.y,
      });
      setPanningOffset({ x: 0, y: 0 });
      containerRef.current?.classList.remove("cursor-grabbing");
    } else if (
      (isAnnotPanningEnabled || isAnnotResizingEnabled) &&
      annotation
    ) {
      setAnnotations((prevAnnotations) => [
        ...prevAnnotations,
        {
          ...annotation,
          x: (annotation.x * 100) / zoomLevel,
          y: (annotation.y * 100) / zoomLevel,
          width: (annotation.width * 100) / zoomLevel,
          height: (annotation.height * 100) / zoomLevel,
        },
      ]);
      setIsAnnotPanningEnabled(false);
      setIsAnnotResizingEnabled(false);
      setStartPoint(null);
      setAnnotation(null);
      setSelectedAnnotation(null);
    }
    // else if (isAnnotResizingEnabled && annotation) {
    //   setAnnotations((prevAnnotations) => [
    //     ...prevAnnotations,
    //     {
    //       ...annotation,
    //       x: (annotation.x * 100) / zoomLevel,
    //       y: (annotation.y * 100) / zoomLevel,
    //       width: (annotation.width * 100) / zoomLevel,
    //       height: (annotation.height * 100) / zoomLevel,
    //     },
    //   ]);
    //   setIsAnnotResizingEnabled(false);
    //   setStartPoint(null);
    //   setAnnotation(null);
    //   setSelectedAnnotation(null);
    // }
  }, [
    isDrawingEnabled,
    annotation,
    isPanningEnabled,
    panningOffset,
    memoryOffset,
    isAnnotPanningEnabled,
    isAnnotResizingEnabled,
  ]);

  const handleWheelZoom = useCallback(
    (e: React.WheelEvent<HTMLDivElement>) => {
      if (isDrawing || e.deltaY == 0 || !(e.ctrlKey || e.metaKey)) return;

      const scaleAmount = e.deltaY < 0 ? 1.05 : 0.95;

      const newZoomLevel =
        scaleAmount == 0.95
          ? Math.max(zoomLimit.min, zoomLevel * scaleAmount)
          : Math.min(zoomLimit.max, zoomLevel * scaleAmount);
      setZoomLevel(newZoomLevel);

      if (newZoomLevel <= zoomLimit.min || newZoomLevel >= zoomLimit.max)
        return;

      const { x, y } = calculateRelativePosition(e, containerRef);

      // Factor in the current zoom offset and panning offset
      const adjustedX = x - (zoomOffset.x + memoryOffset.x);
      const adjustedY = y - (zoomOffset.y + memoryOffset.y);

      // Calculate the offsets needed to keep the cursor-centered zooming
      const newOffsetX = adjustedX * scaleAmount - adjustedX;
      const newOffsetY = adjustedY * scaleAmount - adjustedY;

      // Update state with the new zoom level and adjusted offsets
      setZoomOffset((prevZoomOffset) => ({
        x: prevZoomOffset.x - newOffsetX,
        y: prevZoomOffset.y - newOffsetY,
      }));
    },
    [isDrawing, zoomLevel, zoomOffset, memoryOffset]
  );

  // Prevent Default on wheel event
  useEffect(() => {
    const handleWheelZoom = (e: WheelEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      setPressedKey(e.key);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setPressedKey("");
    };

    if (containerRef.current) {
      containerRef.current.addEventListener("wheel", handleWheelZoom, {
        passive: false,
      });
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener("wheel", handleWheelZoom);
      }
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Load Annotations
  useEffect(() => {
    let savedAnnotations = localStorage.getItem("annotations");
    if (savedAnnotations) {
      setAnnotations(JSON.parse(savedAnnotations));
      nextId.current = JSON.parse(savedAnnotations).length;
    }
  }, []);

  // If a user changes the selected file, there should be loading of the new annotations for the selected file
  const id = useSearchParams().get("id");
  useEffect(() => {
    setAnnotations([]);
  }, [id]);

  return (
    <div className="relative size-full bg-light/50 rounded-[10px] p-[10px] ">
      {/* The container that will have the image to annotate */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheelZoom}
        className={`relative overflow-hidden touch-none size-full ${
          isPanningEnabled && "cursor-grab"
        }`}
      >
        <ImageDisplay
          imageRef={imageRef}
          containerRef={containerRef}
          resetZoomLevel={resetZoomLevel}
        />
        {displayedAnnotations.map((annotation) => (
          <Annotation
            imageRef={imageRef}
            key={annotation.id}
            annotation={annotation}
            couldMove={!isDrawingEnabled}
            applyTransition={applyTransition}
            showLabel
          />
        ))}
        {drawnAnnotation && (
          <Annotation
            imageRef={imageRef}
            annotation={drawnAnnotation}
            couldMove={!isDrawingEnabled}
            applyTransition={applyTransition}
            showLabel={!isDrawing}
          />
        )}
      </div>
    </div>
  );
});
