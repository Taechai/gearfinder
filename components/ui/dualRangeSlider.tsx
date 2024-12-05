"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

interface DualRangeSliderProps
  extends React.ComponentProps<typeof SliderPrimitive.Root> {
  labelPosition?: "top" | "bottom";
  label?: (value: number | undefined) => React.ReactNode;
}

const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = "bottom", ...props }, ref) => {
  const initialValue = Array.isArray(props.value) ? props.value : [0, 100];
  return (
    <SliderPrimitive.Root
      ref={ref}
      className={cn(
        "relative flex w-full touch-none select-none items-center",
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-success-dark">
        <SliderPrimitive.Range className="absolute h-full bg-warning-dark" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Track
        className={`absolute h-2 grow overflow-hidden rounded-full bg-primary-dark`}
        style={{ width: `${initialValue[0]}%` }}
      />

      <SliderPrimitive.Thumb className="relative outline-none block h-4 w-4 rounded-full bg-primary-dark cursor-pointer transition-all hover:bg-primary-main disabled:pointer-events-none disabled:opacity-50">
        {label && (
          <span
            className={cn(
              "text-sm text-primary-dark font-semibold absolute flex justify-center",
              labelPosition === "top" && "-top-7",
              labelPosition === "bottom" && "top-4"
            )}
          >
            {label(initialValue[0])}%
          </span>
        )}
      </SliderPrimitive.Thumb>
      <SliderPrimitive.Thumb className="relative outline-none block h-4 w-4 rounded-full bg-warning-dark cursor-pointer transition-all hover:bg-warning-main disabled:pointer-events-none disabled:opacity-50">
        {label && (
          <span
            className={cn(
              "text-sm text-warning-dark font-semibold absolute flex justify-center",
              labelPosition === "top" && "-top-7",
              labelPosition === "bottom" && "top-4"
            )}
          >
            {label(initialValue[1] - initialValue[0])}%
          </span>
        )}
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
});
DualRangeSlider.displayName = "DualRangeSlider";

export { DualRangeSlider };
