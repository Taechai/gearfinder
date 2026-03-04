"use client";
import RangeSlider from "@/app/components/rangeSlider";
import { useRecoilState } from "recoil";
import { imageFinetuneAtom } from "./annotation-components/atoms/annotationAtoms";

export default function ImageFinetune() {
  const [finetune, setFinetune] = useRecoilState(imageFinetuneAtom);

  const update = (key: keyof typeof finetune) => (value: number) =>
    setFinetune((prev) => ({ ...prev, [key]: value }));

  return (
    <>
      <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
        Adjust Image
      </h1>
      <p className="text-md text-dark">Brightness</p>
      <RangeSlider
        min={0}
        max={200}
        defaultValue={100}
        value={finetune.brightness}
        onChange={update("brightness")}
      />
      <p className="text-md text-dark mt-[10px]">Contrast</p>
      <RangeSlider
        min={0}
        max={200}
        defaultValue={100}
        value={finetune.contrast}
        onChange={update("contrast")}
      />
      <p className="text-md text-dark mt-[10px]">Saturation</p>
      <RangeSlider
        min={0}
        max={200}
        defaultValue={100}
        value={finetune.saturation}
        onChange={update("saturation")}
      />
      <p className="text-md text-dark mt-[10px]">Exposure</p>
      <RangeSlider
        min={0}
        max={200}
        defaultValue={100}
        value={finetune.exposure}
        onChange={update("exposure")}
      />
    </>
  );
}
