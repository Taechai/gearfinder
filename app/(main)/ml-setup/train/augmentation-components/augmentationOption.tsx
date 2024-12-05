import CheckBox from "@/app/components/checkBox";
import { SliderComponent } from "@/app/components/sliderComponent";
import React from "react";
import { AugmentationParams } from "./augmentationConfig";

interface AugmentationOptionProps {
  augmentationParams: { [key: string]: AugmentationParams };
  selectedOption: string;
  handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (values: number[]) => void;
}

export default function AugmentationOption({
  augmentationParams,
  selectedOption,
  handleCheckboxChange,
  handleSliderChange,
}: AugmentationOptionProps) {
  return (
    <div
      className={`col-span-3 w-full transition-all overflow-hidden h-fit p-[10px]`}
    >
      <div className="flex flex-col gap-[10px] w-full">
        {augmentationParams[selectedOption].params.map((param, index) => {
          return (
            <React.Fragment key={param.name}>
              {param.type == "boolean" && (
                <CheckBox
                  key={param.name}
                  id={param.name}
                  labelText={param.name}
                  defaultChecked={Boolean(
                    augmentationParams[selectedOption].params[index].value
                  )}
                  onChange={handleCheckboxChange}
                />
              )}
              {param.type == "range" && (
                <div className="flex flex-col gap-[10px] w-full">
                  <div className="flex w-full justify-between items-center">
                    <label className="text-dark text-md font-semibold">
                      {param.name}
                    </label>
                    <span className="text-md text-dark ">
                      {param.value}
                      {param.unit}
                    </span>
                  </div>
                  <SliderComponent
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={[Number(param.value)]}
                    onValueChange={handleSliderChange}
                    className="mt-[10px]"
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
