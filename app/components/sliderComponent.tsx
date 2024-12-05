import { cn } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";

type SliderProps = React.ComponentProps<typeof Slider>;

export function SliderComponent({
  className,
  min,
  max,
  step,
  defaultValue,
  ...props
}: SliderProps) {
  return (
    <Slider
      min={min}
      max={max}
      step={step}
      defaultValue={defaultValue}
      className={cn("w-[100%] hover:cursor-pointer", className)}
      {...props}
    />
  );
}
