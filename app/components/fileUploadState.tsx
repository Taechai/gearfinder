import {
  DocumentTextIcon,
  ExclamationCircleIcon,
  DocumentArrowUpIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid";
export default function FileUploadState({
  status,
  imageReconstructionState,
  fileName,
  twWidth,
  onDelete,
}: {
  status: string;
  imageReconstructionState: string;
  fileName: string;
  twWidth?: string;
  onDelete: () => void;
}) {
  let textColor, bgColor, borderColor, animate;
  let Icon: React.ComponentType<{
    className?: string;
  }>;
  switch (status) {
    case "local":
      textColor = "text-primary-dark";
      bgColor = "bg-primary-light/20";
      borderColor = "border-primary-dark/50";
      Icon = DocumentTextIcon;
      break;

    case "uploading":
      textColor = "text-warning-dark";
      bgColor = "bg-warning-light/20";
      borderColor = "border-warning-dark/50";
      animate = "animate-bounce";
      Icon = DocumentArrowUpIcon;
      break;

    case "uploaded":
      textColor = "text-success-dark";
      bgColor = "bg-success-light/20";
      borderColor = "border-success-dark/50";
      Icon = DocumentTextIcon;
      break;

    case "failed":
      textColor = "text-error-dark";
      bgColor = "bg-error-light/20";
      borderColor = "border-error-dark/50";
      Icon = ExclamationCircleIcon;
      break;

    default:
      textColor = "text-error-dark";
      bgColor = "bg-error-light/20";
      borderColor = "border-error-dark/50";
      Icon = ExclamationCircleIcon;
      break;
  }

  return (
    <div
      className={`${twWidth} flex flex-row gap-[10px] border-[2px] ${borderColor} justify-center items-center ${bgColor} transition-all rounded-[10px] px-[10px] py-[15px]`}
    >
      <Icon
        className={`size-[20px] min-w-[20px] ${textColor} transition-all ${animate}`}
      />
      <p
        className={`w-full pointer-events-auto peer bg-transparent text-md ${textColor} font-normal`}
      >
        {fileName}
      </p>
      {(imageReconstructionState || status != "local") && (
        <div
          className={`${
            status == "uploading"
              ? "bg-warning-dark"
              : imageReconstructionState == "completed"
              ? "bg-success-dark"
              : "bg-error-dark"
          } text-sm text-white py-[2px] px-[5px] rounded-[5px] w-fit text-nowrap`}
        >
          {status == "uploading"
            ? "Reconstructing the image"
            : imageReconstructionState == "completed"
            ? "Image reconstructed"
            : "Reconstruction failed"}
        </div>
      )}
      <XCircleIcon
        onClick={onDelete}
        className={`size-[23px] min-w-[23px] text-error-dark hover:scale-110 cursor-pointer transition-all`}
      />
    </div>
  );
}
