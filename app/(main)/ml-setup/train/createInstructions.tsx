import Button from "@/app/components/button";
import { AiSolidIcon } from "@/app/icons/myIcons";
import { useRecoilValue } from "recoil";
import {
  augmentationParamsAtom,
  datasetDistributionAtom,
} from "./atoms/trainingParamsAtom";
import { AugmentationParams } from "./augmentation-components/augmentationConfig";

export function CreateInstructions({ selectedStep }: { selectedStep: number }) {
  const datasetDistribution = useRecoilValue(datasetDistributionAtom);
  const augmentationParams = useRecoilValue(augmentationParamsAtom);

  function prepareAugmentationParamsForPost(augmentationParams: {
    [key: string]: AugmentationParams;
  }) {
    // Create a new object to hold the prepared params
    const preparedParams: { [key: string]: any } = {};

    // Iterate over each augmentation
    for (const key in augmentationParams) {
      const { isSelected, effect, ...rest } = augmentationParams[key];
      preparedParams[key] = rest;
    }

    return preparedParams;
  }

  const handleClick = () => {
    const preparedAugmentationParams =
      prepareAugmentationParamsForPost(augmentationParams);

    fetch("/api/jobs/ml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        datasetDistribution,
        augmentationParams: preparedAugmentationParams,
      }),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((error) => {
            // Use the server-provided error message
            throw new Error(
              error.message || `Unexpected Error: ${res.statusText}`
            );
          });
        }
        return res.json();
      })
      .then(({ job }) => {
        console.log("JOB");
        console.log(job);
      })
      .catch((error) => {
        console.error("Error occurred:", error.message);
      });
  };
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
        onClick={handleClick}
      >
        Create Model
      </Button>
    </div>
  );
}
