import { atom } from "recoil";
import { AugmentationParams, augmentationParamsInit } from "../augmentation-components/augmentationConfig";

interface DataSplit {
    percentage: number;
    num: number;
}

interface DatasetDistribution {
    train: DataSplit;
    test: DataSplit;
    validation: DataSplit;
}


export const datasetDistributionAtom = atom<DatasetDistribution>({
    key: "datasetDistributionAtom",
    default: {
        train: {
            percentage: 0.7, num: 0
        },
        test: {
            percentage: 0.2,
            num: 0
        },
        validation: {
            percentage: 0.7,
            num: 0
        }
    }
})

export const augmentationParamsAtom = atom<{ [key: string]: AugmentationParams }>(
    {
        key: "augmentationParamsAtom",
        default: JSON.parse(JSON.stringify(augmentationParamsInit))
    }
)