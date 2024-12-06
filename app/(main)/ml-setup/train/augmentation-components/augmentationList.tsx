import React from "react";
import AugmentationDescription from "./augmentationDescription";
import Button from "@/app/components/button";
import { SquaresPlusIcon } from "@heroicons/react/20/solid";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";
interface AugmentationListProps {
  appliedAugmentations: string[];
  augmentationParams: { [key: string]: any };
  selectedStep: number;
  handleEditClick: (key: string) => void;
  handleSwitchAugmentationModal: () => Promise<void>;
  handleRemoveClick: (key: string) => void;
}

const AugmentationList: React.FC<AugmentationListProps> = ({
  appliedAugmentations,
  augmentationParams,
  selectedStep,
  handleEditClick,
  handleSwitchAugmentationModal,
  handleRemoveClick,
}) => {
  if (selectedStep > 3 && appliedAugmentations.length == 0) {
    return (
      <div
        className={`flex justify-center items-center gap-[5px] bg-error-main/20 px-[5px] py-[3px] rounded-[5px]`}
      >
        <ExclamationCircleIcon className="size-[20px] text-error-dark" />
        <p className="font-semibold  text-md text-error-dark">
          No Augmentation Selected
        </p>
      </div>
    );
  }
  return (
    <div
      className={`mb-[10px] bg-secondary-light/50 w-[200px] ${
        appliedAugmentations.length > 0 &&
        "px-[10px] pt-[10px] pb-[3px] rounded-[10px] border-[2px]"
      } items-center rounded-[10px] text-sm  border-secondary-dark grid grid-cols-[1fr_auto] gap-[3px]`}
    >
      {appliedAugmentations.map((key) => (
        <React.Fragment key={key}>
          <div className="text-secondary-dark text-[16px] font-bold ">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
          <div className="flex flex-col items-end">
            <div
              className={`text-secondary-dark/80 text-sm hover:text-secondary-dark hover:underline hover:cursor-pointer`}
              onClick={() => {
                handleEditClick(key);
              }}
            >
              Edit
            </div>
            <div
              className={`text-error-dark/80 text-sm hover:text-error-dark hover:underline hover:cursor-pointer`}
              onClick={() => {
                handleRemoveClick(key);
              }}
            >
              Remove
            </div>
          </div>
          <AugmentationDescription
            augmentationParamsKey={key}
            augmentationParams={augmentationParams}
          />
        </React.Fragment>
      ))}

      <Button
        Icon={SquaresPlusIcon}
        onClick={handleSwitchAugmentationModal}
        otherTwClass={`w-full bg-secondary-dark !text-white !font-bold col-span-2 ${
          selectedStep == 3 ? "block" : "hidden"
        } ${appliedAugmentations.length > 0 && "mb-[7px]"}`}
        twHover={`${
          appliedAugmentations.length > 0
            ? "hover:bg-secondary-main/50 hover:!text-secondary-dark"
            : "hover:bg-secondary-dark/80"
        } `}
        twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
      >
        Add
      </Button>
    </div>
  );
};

export default AugmentationList;
