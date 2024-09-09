"use client";
import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";
import { useRouter, useSearchParams } from "next/navigation";
import { useRecoilValue } from "recoil";
import {
  annotationAtom,
  annotationsAtom,
} from "../../gear-detection/annotation-components/atoms/annotationAtoms";
import { useMemo } from "react";

export default function AnnotationsGroup() {
  const router = useRouter();
  const fileName = useSearchParams().get("fileName") || "";
  const annotations = useRecoilValue(annotationsAtom);
  const annotation = useRecoilValue(annotationAtom);

  const classCount = useMemo(() => {
    const combinedAnnotations = annotation?.className
      ? [...annotations, annotation]
      : annotations;

    return combinedAnnotations.reduce((acc, ann) => {
      acc[ann.className] = (acc[ann.className] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [annotations, annotation]);

  const sortedClassCount = useMemo(() => {
    return Object.entries(classCount)
      .filter(([className]) => className.trim() !== "")
      .sort(([classNameA, countA], [classNameB, countB]) => {
        if (countA === countB) {
          return classNameA.localeCompare(classNameB); // Alphabetical order
        }
        return countB - countA; // Descending order by count
        // Positive B -> A
        // Negative A -> B
      });
  }, [classCount]);

  return (
    <>
      <div className="relative flex flex-row items-center gap-[5px] overflow-auto text-dark">
        <ArrowLongLeftIcon
          className="text-dark size-[30px] p-[5px] cursor-pointer hover:bg-dark/10 rounded-[5px] transition-all"
          onClick={() => router.back()}
        />
        <p>Go Back</p>
      </div>
      <div className="relative flex flex-col gap-[5px] overflow-auto text-dark ">
        <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
          Annotations
        </h1>
        <p className="text-[16px] text-dark/50">{fileName}</p>
        <div className="flex flex-col gap-[10px] overflow-auto">
          {sortedClassCount.map(([className, count]) => (
            <div
              key={className}
              className="text-md text-dark bg-light/50 p-[10px] rounded-[10px] flex flex-row justify-between items-center border-[1px] border-dark/30"
            >
              {className}
              <div className="bg-dark text-sm text-white px-[5px] py-[3px] rounded-[5px] size-fit">
                {count}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
