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
import { useSearchParams } from "next/navigation";

const files = [
  {
    fileId: "5ea2a3f8-e159-4beb-8a69-83de45749c8e",
    filePath: "/reconstructed/5ea2a3f8-e159-4beb-8a69-83de45749c8e.png",
  },
  {
    fileId: "14efabce-1f81-4b8b-9246-3b771e0d3999",
    filePath: "/reconstructed/14efabce-1f81-4b8b-9246-3b771e0d3999.png",
  },
  {
    fileId: "20e20776-c959-4c9b-87be-1038a3327453",
    filePath: "/reconstructed/20e20776-c959-4c9b-87be-1038a3327453.png",
  },
  {
    fileId: "1461401f-46bb-4731-b7d7-0c8621937790",
    filePath: "/reconstructed/1461401f-46bb-4731-b7d7-0c8621937790.png",
  },
  {
    fileId: "ae759aaa-06fa-4b00-b0a3-c29fa9775163",
    filePath: "/reconstructed/ae759aaa-06fa-4b00-b0a3-c29fa9775163.png",
  },
  {
    fileId: "be4e7bf4-77ec-41df-8de5-ad39f2461540",
    filePath: "/reconstructed/be4e7bf4-77ec-41df-8de5-ad39f2461540.png",
  },
];

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

  const id = useSearchParams().get("id");

  // Set the image src whenever the user changes the file
  useEffect(() => {
    const selectedFile = files.find(({ fileId }) => fileId == id);
    if (selectedFile?.filePath) {
      setSrc(selectedFile.filePath);
    } else setSrc("");
  }, [id]);

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
