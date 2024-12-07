import Image from "next/image";
import React from "react";
import { useMemo } from "react";
import AugmentationOption from "./augmentationOption";
import Button from "@/app/components/button";
import { useRecoilValue } from "recoil";
import { augmentationParamsAtom } from "../atoms/trainingParamsAtom";

interface AugmentationSelectorProps {
  appliedAugmentations: string[];
  selectedOption: string;
  handleAugmentationToggle: (key: string) => void;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (values: number[]) => void;
  handleSaveOptions: () => Promise<void>;
}

export default function AugmentationSelector({
  appliedAugmentations,
  selectedOption,
  handleAugmentationToggle,
  handleCheckboxChange,
  handleSliderChange,
  handleSaveOptions,
}: AugmentationSelectorProps) {
  const augmentationParams = useRecoilValue(augmentationParamsAtom);
  const inLineEffects: { [key: string]: string } = useMemo(() => {
    return {
      flip: `scaleX(${
        augmentationParams.flip.params[0].value ? -1 : 1
      }) scaleY(${augmentationParams.flip.params[1].value ? -1 : 1})`,
      rotation: `rotate(${augmentationParams.rotation.params[0].value}deg)`,
      brightness: `brightness(${
        Number(augmentationParams.brightness.params[0].value) / 100 + 1
      })`,
      contrast: `contrast(${
        Number(augmentationParams.contrast.params[0].value) / 100 + 1
      })`,
      blur: `blur(${augmentationParams.blur.params[0].value}px)`,
      hue: `hue-rotate(${augmentationParams.hue.params[0].value}deg)`,
    };
  }, [augmentationParams]);

  return (
    <>
      <div className="w-full grid grid-cols-3 gap-[10px]">
        {Object.keys(augmentationParams).map((key, index) => (
          <React.Fragment key={key}>
            <label
              key={key}
              className="flex flex-col w-fit items-center gap-[5px]"
            >
              <input
                type="radio"
                className="hidden peer"
                disabled={appliedAugmentations.includes(key)}
                checked={augmentationParams[key].isSelected}
                onChange={() => handleAugmentationToggle(key)}
              />
              <div
                className={`relative bg-dark/5 size-[100px] group rounded-[10px] ring-[2px] ring-transparent overflow-hidden border-[2px] transition-all duration-300 hover:cursor-pointer peer-disabled:pointer-events-none peer-disabled:opacity-60 peer-disabled:border-transparent ${
                  augmentationParams[key].isSelected
                    ? "border-transparent ring-dark/80"
                    : "border-dark/30"
                }`}
              >
                <Image
                  src={"/augmentationImage.jpg"}
                  alt=""
                  width={300}
                  height={300}
                  className={`size-full object-fill transition-all duration-300 ${augmentationParams[key].effect}`}
                  draggable={false}
                  style={{
                    transform:
                      selectedOption == key ? inLineEffects[key] : undefined,
                    filter:
                      selectedOption == key ? inLineEffects[key] : undefined,
                    transitionDuration:
                      selectedOption === key && selectedOption !== "flip"
                        ? "0ms"
                        : undefined,
                  }}
                />
                <div
                  className={`absolute size-full object-containe inset-0 bg-noise opacity-0 transition-all duration-300 group-hover:opacity-80 pointer-events-none 
                      ${key === "noise" ? "" : "hidden"}`}
                  style={{
                    opacity:
                      selectedOption === "noise"
                        ? (Number(augmentationParams.noise.params[0].value) *
                            10) /
                          100
                        : undefined,
                    transitionDuration:
                      selectedOption === "noise" ? "0ms" : undefined,
                  }}
                />
              </div>
              <p className="text-dark text-md font-semibold peer-disabled:opacity-60">
                {augmentationParams[key].name}
              </p>
            </label>
            {index == 2 &&
              ["flip", "rotation", "noise"].includes(selectedOption) && (
                <AugmentationOption
                  handleCheckboxChange={handleCheckboxChange}
                  handleSliderChange={handleSliderChange}
                  selectedOption={selectedOption}
                />
              )}
            {index == 5 &&
              ["brightness", "contrast", "blur"].includes(selectedOption) && (
                <AugmentationOption
                  handleCheckboxChange={handleCheckboxChange}
                  handleSliderChange={handleSliderChange}
                  selectedOption={selectedOption}
                />
              )}
            {index == 6 && ["hue"].includes(selectedOption) && (
              <AugmentationOption
                handleCheckboxChange={handleCheckboxChange}
                handleSliderChange={handleSliderChange}
                selectedOption={selectedOption}
              />
            )}
          </React.Fragment>
        ))}
      </div>
      <Button onClick={handleSaveOptions}>Done</Button>
    </>
  );
}
