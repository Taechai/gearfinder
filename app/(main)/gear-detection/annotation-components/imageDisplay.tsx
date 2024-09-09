import { useCallback, RefObject, useEffect } from "react";
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
import { useSearchParams } from "next/navigation";
import { projectFilesAtom } from "../../projectAtom";

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

  const projectFiles = useRecoilValue(projectFilesAtom);

  const handleImageLoad = useCallback(() => {
    setIsImgLoaded(true);
    console.log("LOADED");
  }, []);

  const id = useSearchParams().get("id");

  // Set the image src whenever the user changes the file
  useEffect(() => {
    const selectedFile = projectFiles.find(({ fileId }) => fileId == id);
    if (selectedFile?.imagePath) {
      setSrc(selectedFile.imagePath);
    } else setSrc("");
  }, [id, projectFiles]);

  // Set the initialZoomLevel and Image Size when the image is loaded
  useEffect(() => {
    const { imgW, imgH, newZoomLevel } = resetZoomLevel();
    setInitialZoomLevel(newZoomLevel);
    setImageSize({ width: `${imgW}px`, height: `${imgH}px` });
  }, [isImgLoaded]);

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
  }, [imageSize]);

  return (
    <img
      ref={imageRef}
      src={src}
      // src={SonarImage.src}
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
