import Button from "@/app/components/button";
import { DualRangeSliderComponent } from "@/app/components/dualRangeSliderComponent";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useRecoilValue } from "recoil";
import { projectFilesAtom } from "../../projectAtom";

export function TrainTestSplitDetails({
  selectedStep,
  setSelectedStep,
  values,
  setValues,
}: {
  selectedStep: number;
  setSelectedStep: Dispatch<SetStateAction<number>>;
  values: number[];
  setValues: Dispatch<SetStateAction<number[]>>;
}) {
  const projectFiles = useRecoilValue(projectFilesAtom);
  const annotatedCount = useMemo(() => {
    return projectFiles.filter(
      ({ state }) => state.toLowerCase() == "annotated"
    ).length;
  }, [projectFiles]);
  const split = useMemo(() => {
    const train = Math.round((annotatedCount * values[0]) / 100);
    const val = Math.round((annotatedCount * (100 - values[1])) / 100);
    const test = annotatedCount - train - val;
    return { train, test, val };
  }, [values, annotatedCount]);
  return (
    <div
      className={`flex flex-col ml-[29px] gap-[10px] ${
        !(selectedStep >= 2) && "hidden"
      }`}
    >
      <div className="flex items-center gap-[10px]">
        <div className="bg-primary-light w-[200px] p-[10px] rounded-[10px] text-sm border-[2px] border-primary-dark">
          <div className="w-full flex items-center gap-[10px] mb-[10px]">
            <p className="text-md text-primary-main font-bold w-full ">
              Train Set
            </p>
            <div className="text-[8px] text-primary-light bg-primary-dark py-[1px] px-[3px] rounded-[5px] h-fit">
              {values[0]}%
            </div>
          </div>
          <p className="text-lg text-primary-dark font-bold">
            {split.train} images
          </p>
        </div>
        <div className="bg-warning-light/50 w-[200px] p-[10px] rounded-[10px] text-sm border-[2px] border-warning-dark">
          <div className="w-full flex items-center gap-[10px] mb-[10px]">
            <p className="text-md text-warning-main font-bold w-full ">
              Test Set
            </p>
            <div className="text-[8px] text-white/60 bg-warning-dark py-[1px] px-[3px] rounded-[5px] h-fit">
              {values[1] - values[0]}%
            </div>
          </div>
          <p className="text-lg text-warning-dark font-bold">
            {split.test} images
          </p>
        </div>
        <div className="bg-success-light/50 w-[200px] p-[10px] rounded-[10px] text-sm border-[2px] border-success-dark">
          <div className="w-full flex items-center gap-[10px] mb-[10px]">
            <p className="text-md text-success-main font-bold w-full ">
              Validation Set
            </p>
            <div className="text-[8px] text-white/60 bg-success-dark py-[1px] px-[3px] rounded-[5px] h-fit">
              {100 - values[1]}%
            </div>
          </div>
          <p className="text-lg text-success-dark font-bold">
            {split.val} images
          </p>
        </div>
      </div>
      {selectedStep == 2 && (
        <DualRangeSliderComponent values={values} setValues={setValues} />
      )}
      <Button
        otherTwClass={`mt-[10px] w-fit bg-secondary-light/50 !text-secondary-dark !font-bold ${
          selectedStep == 2 ? "block" : "hidden"
        }`}
        twHover="hover:bg-secondary-light/75"
        twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
        onClick={() => setSelectedStep(3)}
      >
        Continue
      </Button>
    </div>
  );
}
