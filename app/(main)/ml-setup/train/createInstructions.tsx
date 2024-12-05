import Button from "@/app/components/button";
import { AiSolidIcon } from "@/app/icons/myIcons";

export function CreateInstructions({ selectedStep }: { selectedStep: number }) {
  return (
    <div className={`flex flex-col ${selectedStep != 4 && "hidden"}`}>
      <p className="text-md ml-[29px] text-secondary-main">
        Before creating your model, please ensure the following steps are
        completed:
      </p>
      <p className="text-md ml-[29px] text-secondary-main">
        → All images have been accurately labeled. Accurate labels are crucial
        for training an effective model.
      </p>
      <p className="text-md ml-[29px] text-secondary-main">
        → Check the distribution of your labels to ensure a balanced dataset.
        Imbalanced datasets can lead to biased models.
      </p>
      <Button
        Icon={AiSolidIcon}
        otherTwClass={
          "ml-[29px] mt-[20px] w-fit bg-secondary-light/50 !text-secondary-dark !font-bold"
        }
        twHover="hover:bg-secondary-light/75"
        twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
      >
        Create Model
      </Button>
    </div>
  );
}
