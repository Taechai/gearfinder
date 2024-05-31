import { CloudArrowUpIcon } from "@heroicons/react/20/solid";

export default function InputDragFile({
  twWidth,
  twHeight,
}: {
  twWidth?: string;
  twHeight?: string;
}) {
  return (
    <label
      htmlFor="dropzone-file"
      className={`${twWidth} ${twHeight} h-[200px] relative flex flex-col items-center justify-center border-[1px] border-dark border-dashed rounded-[10px] bg-light/50 hover:bg-light/80 transition-all`}
    >
      <div className="flex flex-col items-center justify-center p-[10px] gap-[10px]">
        <CloudArrowUpIcon className="size-[50px] text-dark mb-[10px]" />
        <p className="text-md text-dark font-light">
          <span className="font-semibold">Click to upload</span> or drag and
          drop
        </p>
        <p className="text-md text-dark font-light">
          <code className="font-bold">.XTF</code> files
        </p>
      </div>
      <input
        id="dropzone-file"
        type="file"
        className="opacity-0 size-full absolute cursor-pointer"
        accept=".xtf"
        required
      />
    </label>
  );
}
