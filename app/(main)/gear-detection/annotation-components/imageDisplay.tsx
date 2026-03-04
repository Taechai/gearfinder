import { useCallback, RefObject, useEffect, useRef } from "react";
import {
  applyTransitionAtom,
  imageFinetuneAtom,
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
  const finetune = useRecoilValue(imageFinetuneAtom);

  const setInitialZoomLevel = useSetRecoilState(initialZoomLevelAtom);
  const setInitialOffset = useSetRecoilState(initialOffsetAtom);
  const setMemoryOffset = useSetRecoilState(memoryOffsetAtom);

  const [projectFiles, setProjectFiles] = useRecoilState(projectFilesAtom);

  const id = useSearchParams().get("id");
  const selectedFile = projectFiles.find(({ fileId }) => fileId == id);

  const handleImageLoad = useCallback(() => {
    setIsImgLoaded(true);
  }, []);

  const buttonRef = useRef<HTMLSpanElement>(null);
  const handleReconstructImage = async () => {
    if (!selectedFile) return;
    console.log("RELOADING");

    const button = buttonRef.current;
    if (!button) return;

    const disableButton = () => {
      button.classList.add("pointer-events-none", "animate-pulse");
      button.classList.remove("text-error-dark");
    };

    const enableButtonWithError = () => {
      button.classList.remove("pointer-events-none", "animate-pulse");
      button.classList.add("text-error-dark");
    };

    disableButton();

    try {
      const response = await fetch("/api/jobs/image-reconstruction", {
        method: "POST",
        body: JSON.stringify({ fileId: selectedFile.fileId }),
      });
      const { file } = await response.json();

      if (file) {
        const newProjectFiles = projectFiles.map((oldFile) =>
          oldFile.fileId === file.fileId ? file : oldFile
        );
        setProjectFiles(newProjectFiles);
        if (
          file.imageReconstructionJobStatus == "failed" ||
          file.imageReconstructionJobStatus == "in progress"
        ) {
          enableButtonWithError();
        }
        // If successful, keep the button disabled and animating
      } else {
        enableButtonWithError();
      }
    } catch (error) {
      console.error(error);
      enableButtonWithError();
    }
  };

  // Set the image src whenever the user changes the file
  useEffect(() => {
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
    <>
      {selectedFile?.imageReconstructionJobStatus === "completed" ? (
        <img
          ref={imageRef}
          src={src}
          alt="Annotated Image"
          onLoad={handleImageLoad}
          style={{
            width: `${imageSize.width}`,
            height: `${imageSize.height}`,
            transform: `translate(${offset.x}px, ${offset.y}px) scale(${
              zoomLevel / 100
            })`,
            filter: `brightness(${finetune.brightness / 100}) contrast(${finetune.contrast / 100}) saturate(${finetune.saturation / 100}) brightness(${finetune.exposure / 100})`,
          }}
          draggable={false}
          className={`absolute origin-top-left select-none max-w-fit ${
            isDrawingEnabled ? "cursor-crosshair" : ""
          } ${applyTransition ? "transition-all" : ""}`}
        />
      ) : (
        <div className="text-dark text-[15px] size-full flex flex-col justify-center items-center gap-2">
          {selectedFile?.imageReconstructionJobStatus === "in progress" && (
            <>
              <p className="animate-pulse">
                Image reconstruction is in progress...
              </p>
              <span
                ref={buttonRef}
                className="font-bold hover:underline cursor-pointer"
                onClick={handleReconstructImage}
              >
                Reload
              </span>
            </>
          )}
          {selectedFile?.imageReconstructionJobStatus === "pending" && (
            <>
              <p>
                Image reconstruction has not started. There may be a server
                issue.
              </p>
              <span className="font-bold hover:underline cursor-pointer">
                Refresh.
              </span>
            </>
          )}
          {selectedFile?.imageReconstructionJobStatus === "failed" && (
            <>
              <p>
                Image reconstruction failed.{" "}
                <span
                  ref={buttonRef}
                  className="font-bold hover:underline cursor-pointer"
                  onClick={handleReconstructImage}
                >
                  Try again.
                </span>
              </p>
            </>
          )}
        </div>
      )}
    </>
  );
});
