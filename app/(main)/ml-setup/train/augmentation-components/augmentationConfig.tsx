export interface AugmentationParams {
  name: string;
  effect?: string;
  isSelected: boolean;
  params: {
    name: string;
    min?: number;
    max?: number;
    step?: number;
    type: string;
    unit?: string;
    value: number | boolean;
  }[];
}

// DONT FORGET TO ADD REMOVE BUTTON
export const augmentationParamsInit: { [key: string]: AugmentationParams } = {
  flip: {
    name: "Flip",
    effect: "group-hover:scale-x-[-1]",
    isSelected: false,
    params: [
      { name: "Horizontal", type: "boolean", value: false },
      { name: "Vertical", type: "boolean", value: false },
    ],
  },
  rotation: {
    name: "Rotation",
    isSelected: false,
    effect: "group-hover:rotate-45",
    params: [
      {
        name: "Angle",
        min: 0,
        max: 45,
        step: 1,
        type: "range",
        unit: "º",
        value: 0,
      },
      {
        name: "Include negative rotation",
        type: "boolean",
        unit: "",
        value: true,
      },
    ],
  },
  noise: {
    name: "Noise",
    isSelected: false,
    params: [
      {
        name: "Intensity",
        min: 0,
        max: 20,
        step: 0.1,
        type: "range",
        unit: "%",
        value: 0,
      },
    ],
  },
  brightness: {
    name: "Brightness",
    isSelected: false,
    effect: "group-hover:brightness-200",
    params: [
      {
        name: "Level",
        min: 0,
        max: 100,
        step: 1,
        type: "range",
        unit: "%",
        value: 0,
      },
      {
        name: "Include darkening",
        type: "boolean",
        unit: "",
        value: true,
      },
    ],
  },
  contrast: {
    name: "Contrast",
    isSelected: false,
    effect: "group-hover:contrast-50",
    params: [
      {
        name: "Level",
        min: 0,
        max: 100,
        step: 1,
        type: "range",
        unit: "%",
        value: 0,
      },
      {
        name: "Include negative contrast",
        type: "boolean",
        unit: "",
        value: true,
      },
    ],
  },
  blur: {
    name: "Blur",
    isSelected: false,
    effect: "group-hover:blur-[2px]",
    params: [
      {
        name: "Radius",
        min: 0,
        max: 25,
        step: 0.1,
        type: "range",
        unit: "px",
        value: 0,
      },
    ],
  },
  hue: {
    name: "Hue",
    isSelected: false,
    effect: "group-hover:hue-rotate-90",
    params: [
      {
        name: "Level",
        min: 0,
        max: 180,
        step: 1,
        type: "range",
        unit: "º",
        value: 0,
      },
      {
        name: "Include negative hue",
        type: "boolean",
        unit: "",
        value: true,
      },
    ],
  },
};
