"use client";
import { useState } from "react";

interface RangeSliderProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  value?: number;
  onChange?: (value: number) => void;
}

export default function RangeSlider({
  min = 0,
  max = 100,
  defaultValue = 50,
  value: externalValue,
  onChange,
}: RangeSliderProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  const value = externalValue !== undefined ? externalValue : internalValue;

  const percentage = ((value - min) * 100) / (max - min);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  return (
    <div className="relative w-full h-[8px]">
      {/* This is the track background */}
      <div className="absolute w-full h-[8px] bg-dark/20 rounded-full" />
      {/* This is the filled part of the track */}
      <div
        className="absolute h-[8px] bg-dark rounded-full transition-all duration-[50ms]"
        style={{ width: `${percentage}%` }}
      />
      {/* This is the thumb */}
      <div
        className="absolute size-[12px] bg-dark rounded-full -top-[2px] -translate-x-1/2 transition-all duration-[50ms]"
        style={{ left: `${percentage}%` }}
      />
      {/* Invisible input range for controlling the slider */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={handleChange}
        className="absolute form-range appearance-none w-full h-[8px] bg-transparent cursor-pointer opacity-0"
      />
    </div>
  );
}
