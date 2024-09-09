import React, { RefObject, useCallback, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  annotationAtom,
  annotationsAtom,
  isAnnotPanningEnabledAtom,
  isAnnotResizingEnabledAtom,
  selectedAnnotationAtom,
  startPointAtom,
  Annotation,
} from "./atoms/annotationAtoms";
import { totalOffsetSelector } from "./atoms/annotationSelectors";
import AnnotationEditor from "./annotationEditor";

export default React.memo(function Annotation({
  couldMove,
  applyTransition,
  showLabel,
  annotation,
  tempAnnotation = false,
  imageRef,
  containerRef,
}: {
  couldMove: boolean;
  applyTransition: boolean;
  showLabel?: boolean;
  annotation: Annotation;
  tempAnnotation?: boolean;
  imageRef: RefObject<HTMLImageElement>;
  containerRef: RefObject<HTMLDivElement>;
}) {
  const [annotations, setAnnotations] = useRecoilState(annotationsAtom);

  const totalOffset = useRecoilValue(totalOffsetSelector);

  const setStartPoint = useSetRecoilState(startPointAtom);
  const setSelectedAnnotation = useSetRecoilState(selectedAnnotationAtom);
  const setAnnotation = useSetRecoilState(annotationAtom);
  const setIsAnnotPanningEnabled = useSetRecoilState(isAnnotPanningEnabledAtom);
  const setIsAnnotResizingEnabled = useSetRecoilState(
    isAnnotResizingEnabledAtom
  );

  const handleMouseDown = useCallback(
    (
      e: React.MouseEvent<HTMLDivElement, MouseEvent>,
      annotation: Annotation
    ) => {
      if (e.button !== 0) return;
      console.log("Moving");
      e.stopPropagation();
      const imageAbsCoord = imageRef.current?.getBoundingClientRect();
      const x = e.clientX - (imageAbsCoord?.left ?? 0);
      const y = e.clientY - (imageAbsCoord?.top ?? 0);

      setStartPoint({ x, y });
      // newAnnotation is the annotation's coordinates regarding to the image's coordinates
      const newAnnotation = {
        ...annotation,
        x: annotation.x - totalOffset.x,
        y: annotation.y - totalOffset.y,
        width: Math.abs(annotation.width),
        height: Math.abs(annotation.height),
      };
      setSelectedAnnotation(newAnnotation);
      setAnnotation(newAnnotation);
      setIsAnnotPanningEnabled(true);
      if (annotations)
        setAnnotations((prevAnnotations) =>
          prevAnnotations.filter((a) => a.id != annotation.id)
        );
    },
    // totalOffset depends on zoomOffset, panningOffset and memoryOffset
    [annotations, totalOffset]
  );

  const handleMouseDownResize = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.button !== 0) return;
    console.log("Resizing");
    e.stopPropagation();
    const imageAbsCoord = imageRef.current?.getBoundingClientRect();
    const x = e.clientX - (imageAbsCoord?.left ?? 0);
    const y = e.clientY - (imageAbsCoord?.top ?? 0);

    setStartPoint({ x, y });
    // newAnnotation is the annotation's coordinates regarding to the image's coordinates
    const newAnnotation = {
      ...annotation,
      x: annotation.x - totalOffset.x,
      y: annotation.y - totalOffset.y,
      width: Math.abs(annotation.width),
      height: Math.abs(annotation.height),
    };
    setSelectedAnnotation(newAnnotation);
    setAnnotation(newAnnotation);
    setIsAnnotResizingEnabled(true);
    if (annotations)
      setAnnotations((prevAnnotations) =>
        prevAnnotations.filter((a) => a.id != annotation.id)
      );
  };

  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (!tempAnnotation && annotation.className.trim() == "") {
      setIsOpen(true);
    }
  }, []);
  return (
    <>
      {/* <div className="size-fit"> */}
      <div
        className={`absolute border-[2px] ${
          isOpen ? "border-error-main" : "border-red-700"
        }  origin-top-left group ${
          couldMove ? "hover:bg-white/20 cursor-move" : "pointer-events-none"
        }  ${applyTransition ? "transition-all" : "transition-colors"}`}
        onMouseDown={(e) => handleMouseDown(e, annotation)}
        style={{
          left: `${annotation.x}px`,
          top: `${annotation.y}px`,
          width: `${annotation.width}px`,
          height: `${annotation.height}px`,
        }}
      >
        <div
          className={`absolute size-[10px] rounded-full bg-red-100 border-red-700 border-[2px] origin-top-left opacity-0 group-hover:opacity-100 hover:opacity-100 ${
            couldMove ? "cursor-nwse-resize" : "pointer-events-none"
          } ${applyTransition ? "transition-all" : "transition-opacity"}`}
          onMouseDown={handleMouseDownResize}
          style={{
            left: `${annotation.width - 8}px`,
            top: `${annotation.height - 8}px`,
          }}
        />
      </div>
      {showLabel && (
        <span
          draggable={false}
          className={`absolute ${
            isOpen ? "bg-error-main" : "bg-red-700"
          } text-white text-sm px-[3px] select-none max-w-[100px] text-nowrap text-ellipsis overflow-hidden ${
            (applyTransition || isOpen) && "transition-all"
          } ${couldMove ? "cursor-pointer" : "pointer-events-none"}`}
          style={{
            left: `${annotation.x}px`,
            top: `${annotation.y - 15}px`,
          }}
          onClick={() => {
            setIsOpen(true);
          }}
        >
          {annotation.className}
        </span>
      )}

      <AnnotationEditor
        isOpen={isOpen}
        containerRef={containerRef}
        initialValue={annotation.className}
        onClose={() => {
          setIsOpen(false);
        }}
        annotation={annotation}
      />
      {/* </div> */}
    </>
  );
});
