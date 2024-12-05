import { useRecoilValue } from "recoil";
import {
  currentProjectAtom,
  projectClassesAtom,
  projectFilesAtom,
} from "../../projectAtom";
import { Dispatch, SetStateAction, useMemo } from "react";
import Button from "@/app/components/button";

export function ProjectDetails({
  selectedStep,
  setSelectedStep,
}: {
  selectedStep: number;
  setSelectedStep: Dispatch<SetStateAction<number>>;
}) {
  const { name: currentProject } = useRecoilValue(currentProjectAtom);
  const projectFiles = useRecoilValue(projectFilesAtom);
  const projectClasses = useRecoilValue(projectClassesAtom);
  const unassignedCount = useMemo(() => {
    return projectFiles.filter(
      ({ state }) => state.toLowerCase() == "unassigned"
    ).length;
  }, [projectFiles]);

  return (
    <div className="flex flex-col">
      <p className="text-md ml-[29px] text-secondary-dark">
        <span className="font-semibold">Project Name:</span> {currentProject}
      </p>
      <p className="text-md ml-[29px] text-secondary-dark">
        <span className="font-semibold">Images:</span> {projectFiles.length}
      </p>
      <p className="text-md ml-[29px] text-secondary-dark">
        <span className="font-semibold">Classes:</span> {projectClasses.length}
      </p>
      <p className="text-md ml-[29px] text-secondary-dark">
        <span className="font-semibold">Unassigned:</span> {unassignedCount}
      </p>
      <Button
        otherTwClass={`ml-[29px] mt-[10px] w-fit bg-secondary-light/50 !text-secondary-dark !font-bold ${
          selectedStep == 1 ? "block" : "hidden"
        }`}
        twHover="hover:bg-secondary-light/75"
        twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
        onClick={() => setSelectedStep(2)}
      >
        Continue
      </Button>
    </div>
  );
}
