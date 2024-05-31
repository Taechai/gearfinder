import { useCallback, RefObject, useEffect } from "react";
import SonarImage from "@/public/SonarImage.png";

import {
  applyTransitionAtom,
  imageSizeAtom,
  initialOffsetAtom,
  initialZoomLevelAtom,
  isDrawingEnabledAtom,
  isImgLoadedAtom,
  memoryOffsetAtom,
  selectedSrcAtom,
  zoomLevelAtom,
} from "./atoms/annotationAtoms";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { totalOffsetSelector } from "./atoms/annotationSelectors";
import React from "react";

const img1 =
  "https://images.unsplash.com/photo-1503891450247-ee5f8ec46dc3?q=80&w=2000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const img2 =
  "https://images.unsplash.com/photo-1533282960533-51328aa49826?q=80&w=3042&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default React.memo(function ImageDisplay({
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
  const [imageSize, setImageSize] = useRecoilState(imageSizeAtom);
  const [isImgLoaded, setIsImgLoaded] = useRecoilState(isImgLoadedAtom);
  const [src, setSrc] = useRecoilState(selectedSrcAtom);

  const offset = useRecoilValue(totalOffsetSelector);
  const zoomLevel = useRecoilValue(zoomLevelAtom);
  const applyTransition = useRecoilValue(applyTransitionAtom);
  const isDrawingEnabled = useRecoilValue(isDrawingEnabledAtom);

  const setInitialZoomLevel = useSetRecoilState(initialZoomLevelAtom);
  const setInitialOffset = useSetRecoilState(initialOffsetAtom);
  const setMemoryOffset = useSetRecoilState(memoryOffsetAtom);

  const handleImageLoad = useCallback(() => {
    setIsImgLoaded(true);
  }, []);

  // Set the initialZoomLevel and Image Size when the image is loaded
  useEffect(() => {
    const { imgW, imgH, newZoomLevel } = resetZoomLevel();
    setInitialZoomLevel(newZoomLevel);
    setImageSize({ width: `${imgW}px`, height: `${imgH}px` });
  }, [src]);

  // Set the image src when the component is mounted
  useEffect(() => {
    setSrc(img1);
  }, []);

  // Center the loaded image in the view
  useEffect(() => {
    if (containerRef.current && imageRef.current && isImgLoaded) {
      const { width: imgWidth, height: imgHeight } =
        imageRef.current.getBoundingClientRect();
      setInitialOffset({
        x:
          containerRef.current.getBoundingClientRect().width / 2 - imgWidth / 2,

        y:
          containerRef.current.getBoundingClientRect().height / 2 -
          imgHeight / 2,
      });
      setMemoryOffset({
        x:
          containerRef.current.getBoundingClientRect().width / 2 - imgWidth / 2,

        y:
          containerRef.current.getBoundingClientRect().height / 2 -
          imgHeight / 2,
      });
      setIsImgLoaded(false);
    }
  }, [isImgLoaded]);

  return (
    <img
      ref={imageRef}
      src={SonarImage.src}
      alt="Image to annotate"
      onLoad={handleImageLoad}
      style={{
        width: `${imageSize.width}`,
        height: `${imageSize.height}`,
        transform: `translate(${offset.x}px, ${offset.y}px) scale(${
          zoomLevel / 100
        })`,
      }}
      draggable={false}
      className={`absolute origin-top-left select-none max-w-fit  ${
        isDrawingEnabled && "cursor-crosshair"
      } ${applyTransition && "transition-all"}`}
    />
  );
});
