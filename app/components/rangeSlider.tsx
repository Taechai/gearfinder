"use client";
import { useState } from "react";

export default function RangeSlider() {
  const [value, setValue] = useState(50);

  // Calculate the percentage of the thumb's position to move the background linear-gradient
  const percentage = ((value - 0) * 100) / (100 - 0);

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
        min="0"
        max="100"
        value={value}
        onChange={(e: any) => setValue(e.target.value)}
        className="absolute form-range appearance-none w-full h-[8px] bg-transparent cursor-pointer opacity-0"
      />
    </div>
  );
}
