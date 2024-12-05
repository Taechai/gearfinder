"use client";
import React, { Dispatch, SetStateAction, useState } from "react";
import { DualRangeSlider } from "@/components/ui/dualRangeSlider";

export const DualRangeSliderComponent = ({
  values,
  setValues,
}: {
  values: number[];
  setValues: Dispatch<SetStateAction<number[]>>;
}) => {
  return (
    <div className="w-full">
      <DualRangeSlider
        label={(value) => value}
        value={values}
        onValueChange={setValues}
        min={0}
        max={100}
        step={1}
        className="cursor-pointer"
      />
    </div>
  );
};
