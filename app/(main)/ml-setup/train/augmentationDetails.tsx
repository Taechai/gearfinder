import Button from "@/app/components/button";
import Modal from "@/app/components/modal";
import { Dispatch, SetStateAction, useState } from "react";
import { PhotoIcon } from "@heroicons/react/20/solid";
import React from "react";
import AugmentationList from "./augmentation-components/augmentationList";
import {
  AugmentationParams,
  augmentationParamsInit,
} from "./augmentation-components/augmentationConfig";
import AugmentationSelector from "./augmentation-components/augmentationSelector";

export function AugmentationDetails({
  selectedStep,
  setSelectedStep,
}: {
  selectedStep: number;
  setSelectedStep: Dispatch<SetStateAction<number>>;
}) {
  const [appliedAugmentations, setAppliedAugmentations] = useState<string[]>(
    []
  );

  const [augmentationParams, setAugmentationParams] = useState<{
    [key: string]: AugmentationParams;
  }>(JSON.parse(JSON.stringify(augmentationParamsInit)));
  const [selectedOption, setSelectedOption] = useState("");
  const [isAugmentationOpen, setIsAugmentationOpen] = useState<boolean>(false);

  const handleSwitchAugmentationModal = async () => {
    setIsAugmentationOpen(!isAugmentationOpen);

    await new Promise((resolve) => setTimeout(resolve, 200));
    if (selectedOption) {
      setAugmentationParams((prevParams) => ({
        ...prevParams,
        [selectedOption]: {
          ...prevParams[selectedOption],
          isSelected: false,
        },
      }));
    }
    setSelectedOption("");
  };

  const handleAugmentationToggle = (key: string) => {
    setAugmentationParams((prevParams) => {
      const updatedParams = { ...prevParams };
      Object.keys(updatedParams).forEach((k) => {
        updatedParams[k].isSelected = k === key;
      });
      return updatedParams;
    });
    setSelectedOption(key);
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const paramName = e.currentTarget.name;
    const paramValue = e.currentTarget.checked;

    setAugmentationParams((prevParams) => {
      const newAugmentationParams = { ...prevParams };
      newAugmentationParams[selectedOption] = {
        ...newAugmentationParams[selectedOption],
        params: newAugmentationParams[selectedOption].params.map((param) => {
          if (param.name === paramName) {
            return { ...param, value: paramValue };
          }
          return param;
        }),
      };
      return newAugmentationParams;
    });
  };

  const handleSliderChange = (values: number[]) => {
    setAugmentationParams((prevParams) => {
      let newParams = { ...prevParams };
      newParams[selectedOption].params[0].value = values[0];
      return newParams;
    });
  };

  const handleSaveOptions = async () => {
    const appliedAugmentations = getChangedKeys();

    setAppliedAugmentations(appliedAugmentations);

    setIsAugmentationOpen(false);

    await new Promise((resolve) => setTimeout(resolve, 200));
    setAugmentationParams((prevParams) => ({
      ...prevParams,
      [selectedOption]: {
        ...prevParams[selectedOption],
        isSelected: false,
      },
    }));
    setSelectedOption("");
  };

  const getChangedKeys = () => {
    const changedKeys = [];

    for (const key in augmentationParams) {
      const initialParam = augmentationParamsInit[key];
      const currentParam = augmentationParams[key];

      // Check each param in `params` array
      const paramsChanged = currentParam.params.some((param, index) => {
        return param.value != initialParam.params[index].value;
      });

      if (paramsChanged) {
        changedKeys.push(key);
      }
    }

    return changedKeys;
  };

  const handleEditClick = (key: string) => {
    setSelectedOption(key);

    setAugmentationParams((prevParams) => ({
      ...prevParams,
      [key]: {
        ...prevParams[key],
        isSelected: true,
      },
    }));

    setIsAugmentationOpen(true);
  };

  return (
    <div className={`ml-[29px] ${selectedStep < 3 && "hidden"}`}>
      <AugmentationList
        appliedAugmentations={appliedAugmentations}
        augmentationParams={augmentationParams}
        selectedStep={selectedStep}
        handleEditClick={handleEditClick}
        handleSwitchAugmentationModal={handleSwitchAugmentationModal}
      />
      <Button
        otherTwClass={`w-full bg-secondary-light/50 !text-secondary-dark !font-bold ${
          selectedStep == 3 ? "block" : "hidden"
        }`}
        twHover="hover:bg-secondary-light/75"
        twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
        onClick={() => setSelectedStep(4)}
      >
        Continue
      </Button>
      <Modal
        isOpen={isAugmentationOpen}
        onClose={handleSwitchAugmentationModal}
        title="Augmentation Options"
        Icon={PhotoIcon}
      >
        <AugmentationSelector
          appliedAugmentations={appliedAugmentations}
          augmentationParams={augmentationParams}
          selectedOption={selectedOption}
          handleAugmentationToggle={handleAugmentationToggle}
          handleCheckboxChange={handleCheckboxChange}
          handleSaveOptions={handleSaveOptions}
          handleSliderChange={handleSliderChange}
        />
      </Modal>
    </div>
  );
}
