import React from "react";
import AugmentationDescription from "./augmentationDescription";
import Button from "@/app/components/button";
import { SquaresPlusIcon } from "@heroicons/react/20/solid";

interface AugmentationListProps {
  appliedAugmentations: string[];
  augmentationParams: { [key: string]: any };
  selectedStep: number;
  handleEditClick: (key: string) => void;
  handleSwitchAugmentationModal: () => Promise<void>;
}

const AugmentationList: React.FC<AugmentationListProps> = ({
  appliedAugmentations,
  augmentationParams,
  selectedStep,
  handleEditClick,
  handleSwitchAugmentationModal,
}) => {
  return (
    <div
      className={`mb-[10px] bg-secondary-light/50 w-[200px] ${
        appliedAugmentations.length > 0 &&
        "p-[10px] rounded-[10px] border-[2px]"
      } items-center rounded-[10px] text-sm  border-secondary-dark grid grid-cols-[1fr_auto] gap-[3px]`}
    >
      {appliedAugmentations.map((key) => (
        <React.Fragment key={key}>
          <div className="text-secondary-dark text-[16px] font-bold ">
            {key.charAt(0).toUpperCase() + key.slice(1)}
          </div>
          <div
            className={`text-secondary-dark/80 text-sm hover:text-secondary-dark hover:underline hover:cursor-pointer ml-2`}
            onClick={() => {
              handleEditClick(key);
            }}
          >
            Edit
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
        }`}
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
