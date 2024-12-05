import React from "react";
import Image from "next/image";
import { AugmentationParams } from "./augmentationConfig";

interface AugmentationSelectorProps {
  augmentationParams: { [key: string]: AugmentationParams };
  selectedOption: string;
  onToggle: (key: string) => void;
  inLineEffects: { [key: string]: string };
  onSave: () => void;
}

const AugmentationSelectosdrr: React.FC<AugmentationSelectorProps> = ({
  augmentationParams,
  selectedOption,
  onToggle,
  inLineEffects,
  onSave,
}) => {
  return (
    <div className="w-full grid grid-cols-3 gap-[10px]">
      {Object.keys(augmentationParams).map((key) => (
        <div key={key} className="flex flex-col items-center">
          <input
            type="radio"
            className="hidden peer"
            onChange={() => onToggle(key)}
          />
          <div className="relative bg-dark/5 size-[100px]">
            <Image
              src={"/augmentationImage.jpg"}
              alt=""
              width={100}
              height={100}
              style={{ transform: inLineEffects[key] }}
            />
          </div>
          <p>{augmentationParams[key].name}</p>
        </div>
      ))}
      <button onClick={onSave} className="w-full bg-secondary-dark text-white">
        Save
      </button>
    </div>
  );
};

export default AugmentationSelectosdrr;
