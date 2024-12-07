import { useRecoilValue } from "recoil";
import { augmentationParamsAtom } from "../atoms/trainingParamsAtom";

export default function AugmentationDescription({
  augmentationParamsKey,
}: {
  augmentationParamsKey: string;
}) {
  const augmentationParams = useRecoilValue(augmentationParamsAtom);
  return (
    <div className="text-secondary-dark/60 text-xs col-span-2 mb-[7px]">
      {augmentationParamsKey === "flip" ? (
        // Custom description for Flip
        <div>
          {augmentationParams.flip.params[0].value ? "Horizontal" : ""}
          {augmentationParams.flip.params[0].value &&
          augmentationParams.flip.params[1].value
            ? ", "
            : ""}
          {augmentationParams.flip.params[1].value ? "Vertical" : ""}
        </div>
      ) : (
        // General description for other augmentations
        augmentationParams[augmentationParamsKey].params.map((param) => {
          if (param.type === "range") {
            const booleanParam = augmentationParams[
              augmentationParamsKey
            ].params.find((p) => p.type === "boolean");
            if (booleanParam?.value) {
              return (
                <div key={param.name}>
                  Between {-param.value}
                  {param.unit} and {param.value}
                  {param.unit}
                </div>
              );
            } else {
              return (
                <div key={param.name}>
                  Between 0{param.unit} and {param.value}
                  {param.unit}
                </div>
              );
            }
          }
          return null;
        })
      )}
    </div>
  );
}
