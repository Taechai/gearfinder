import RangeSlider from "@/app/components/rangeSlider";

export default function ImageFinetune() {
  return (
    <>
      <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
        Adjust Image
      </h1>
      <p className="text-md text-dark">Brightness</p>
      <RangeSlider />
      <p className="text-md text-dark mt-[10px]">Contrast</p>
      <RangeSlider />
      <p className="text-md text-dark mt-[10px]">Saturation</p>
      <RangeSlider />
      <p className="text-md text-dark mt-[10px]">Exposure</p>
      <RangeSlider />
    </>
  );
}
