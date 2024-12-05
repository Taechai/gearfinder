"use client";

import { useState } from "react";
import { CreateInstructions } from "./createInstructions";
import { TrainTestSplitDetails } from "./trainTestSplitDetails";
import { ProjectDetails } from "./projectDetails";
import { StepIndicator } from "./stepIndicator";
import { AugmentationDetails } from "./augmentationDetails";

const VerticalLine = ({ height = "h-full" }) => (
  <div className={`w-[2px] ${height} bg-secondary-dark ml-[19px]`}></div>
);

export default function Page() {
  const [selectedStep, setSelectedStep] = useState(1);
  const [values, setValues] = useState([70, 90]);

  return (
    <div className="col-span-2 row-span-2 flex flex-col gap-[10px] pl-[10px] w-full h-full overflow-auto pt-[3px]">
      <StepIndicator
        stepNumber={1}
        label="Source"
        isActive={selectedStep == 1}
        isDone={selectedStep >= 1}
        setSelectedStep={setSelectedStep}
      />
      <div className="flex">
        <VerticalLine />
        <ProjectDetails
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
        />
      </div>
      <StepIndicator
        stepNumber={2}
        label="Train / Test Split"
        isActive={selectedStep == 2}
        isDone={selectedStep >= 2}
        setSelectedStep={setSelectedStep}
      />
      <div className="flex flex-start">
        <VerticalLine />
        <TrainTestSplitDetails
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
          values={values}
          setValues={setValues}
        />
      </div>
      <StepIndicator
        stepNumber={3}
        label="Augmentation"
        isActive={selectedStep == 3}
        isDone={selectedStep >= 3}
        setSelectedStep={setSelectedStep}
      />
      <div className="flex">
        <VerticalLine />
        <AugmentationDetails
          selectedStep={selectedStep}
          setSelectedStep={setSelectedStep}
        />
      </div>
      <StepIndicator
        stepNumber={4}
        label="Create"
        isActive={selectedStep == 4}
        isDone={selectedStep >= 4}
        setSelectedStep={setSelectedStep}
      />
      <div className="flex">
        <VerticalLine height="h-0" />
        <CreateInstructions selectedStep={selectedStep} />
      </div>
    </div>
  );
}
