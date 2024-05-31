import ZoomableIconButton from "@/app/components/zoomableIconButton";
import {
  AnnotateIcon,
  EmptyIcon,
  HandIcon,
  RedoIcon,
  UndoIcon,
  ZoomFitBestIcon,
  ZoomInIcon,
  ZoomOutIcon,
} from "@/app/icons/myIcons";
import { useCallback } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  annotationsAtom,
  applyTransitionAtom,
  initialOffsetAtom,
  isDrawingEnabledAtom,
  isPanningEnabledAtom,
  memoryOffsetAtom,
  zoomLevelAtom,
  zoomLimitAtom,
} from "./atoms/annotationAtoms";
import { displayedZoomLevelSelector } from "./atoms/annotationSelectors";
import React from "react";

export default React.memo(function Controls({
  resetZoomLevel,
}: {
  resetZoomLevel: () => {
    imgW: number;
    imgH: number;
    newZoomLevel: number;
  };
}) {
  const setIsDrawingEnabled = useSetRecoilState(isDrawingEnabledAtom);
  const setIsPanningEnabled = useSetRecoilState(isPanningEnabledAtom);

  const setApplyTransition = useSetRecoilState(applyTransitionAtom);
  const setZoomLevel = useSetRecoilState(zoomLevelAtom);
  const setMemoryOffset = useSetRecoilState(memoryOffsetAtom);
  const setAnnotations = useSetRecoilState(annotationsAtom);
  const initialOffset = useRecoilValue(initialOffsetAtom);
  const zoomLimit = useRecoilValue(zoomLimitAtom);
  const displayedZoomLevel = useRecoilValue(displayedZoomLevelSelector);

  //   const toggleDrawingMode = useCallback(() => {
  //     setIsDrawingEnabled(true);
  //     setIsPanningEnabled(false);
  //   }, []);

  //   const togglePanningMode = useCallback(() => {
  //     setIsPanningEnabled(true);
  //     setIsDrawingEnabled(false);
  //   }, []);

  const resetView = useCallback(() => {
    resetZoomLevel();

    setApplyTransition(true);

    setTimeout(() => {
      setApplyTransition(false);
    }, 100);

    setMemoryOffset({
      x: initialOffset.x,
      y: initialOffset.y,
    });
  }, [initialOffset]);

  const handleEmptyAnnotations = () => {
    setAnnotations([]);
  };

  const handleZoomControl = useCallback(
    (zoomAmount: number) => {
      setApplyTransition(true);
      setZoomLevel((prevZoomLevel) => {
        if (prevZoomLevel + zoomAmount > zoomLimit.max) return zoomLimit.max;
        if (prevZoomLevel + zoomAmount < zoomLimit.min) return zoomLimit.min;
        return prevZoomLevel + zoomAmount;
      });
      setTimeout(() => {
        setApplyTransition(false);
      }, 100);
    },
    [zoomLimit]
  );

  const handleModeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const mode = e.currentTarget.id;
    const checked = e.currentTarget.checked;
    if (mode == "panningMode") {
      setIsPanningEnabled(checked);
      setIsDrawingEnabled(false);
    } else if (mode == "drawingMode") {
      setIsPanningEnabled(false);
      setIsDrawingEnabled(checked);
    }
  };

  return (
    <div className="h-fit w-fit mx-auto flex gap-[10px]">
      <div className="bg-light/50 rounded-[10px] h-fit w-fit flex justify-start items-center p-[10px] gap-[10px]">
        <ZoomableIconButton
          Icon={ZoomOutIcon}
          onClick={() => {
            handleZoomControl(-2);
          }}
          className={`cursor-pointer size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px]`}
        />
        <span className="text-dark text-md min-w-[50px] text-center select-none">
          {displayedZoomLevel}%
        </span>
        <ZoomableIconButton
          Icon={ZoomInIcon}
          onClick={() => {
            handleZoomControl(2);
          }}
          className={`cursor-pointer size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px]`}
        />
      </div>

      <div className="bg-light/50 rounded-[10px] h-fit w-fit flex justify-start items-center p-[10px] gap-[10px]">
        <label
          htmlFor="panningMode"
          className="transition-all relative cursor-pointer"
        >
          <input
            type="radio"
            name="controls"
            id="panningMode"
            className="absolute top-0 left-0 hidden peer/input"
            onChange={handleModeChange}
            // checked={isPanningEnabled}
            // readOnly
          />
          <HandIcon
            // onClick={togglePanningMode}
            className="size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px] peer-checked/input:text-white peer-checked/input:bg-dark peer-checked/input:hover:bg-dark"
          />
        </label>
        <label
          htmlFor="drawingMode"
          className="transition-all relative cursor-pointer"
        >
          <input
            type="radio"
            name="controls"
            id="drawingMode"
            className="absolute top-0 left-0 hidden peer/input"
            onChange={handleModeChange}
            // checked={isDrawingEnabled}
            // readOnly
          />
          <AnnotateIcon
            // onClick={toggleDrawingMode}
            className="size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px] peer-checked/input:text-white peer-checked/input:bg-dark peer-checked/input:hover:bg-dark"
          />
        </label>
        <div className="h-[20px] w-[2px] rounded-full bg-dark" />

        <ZoomableIconButton
          Icon={UndoIcon}
          className={`cursor-pointer size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px]`}
        />

        <ZoomableIconButton
          Icon={RedoIcon}
          className={`cursor-pointer size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px]`}
        />

        <div className="h-[20px] w-[2px] rounded-full bg-dark" />

        <ZoomableIconButton
          onClick={resetView}
          Icon={ZoomFitBestIcon}
          className={`cursor-pointer size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px]`}
        />

        <div className="h-[20px] w-[2px] rounded-full bg-dark" />

        <ZoomableIconButton
          Icon={EmptyIcon}
          onClick={handleEmptyAnnotations}
          className={`cursor-pointer size-[30px] text-dark rounded-[10px] transition-all hover:bg-dark/10 p-[5px]`}
        />
      </div>
    </div>
  );
});
