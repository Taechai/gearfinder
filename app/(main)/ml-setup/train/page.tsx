import Button from "@/app/components/button";
import { AiSolidIcon } from "@/app/icons/myIcons";
export default function Page() {
  return (
    <div className="col-span-2 row-span-2 flex flex-col gap-[10px] mx-auto w-sm max-sm:w-full">
      <div className="relative size-[40px] bg-secondary-dark rounded-full flex items-center justify-center text-white font-bold ">
        <p>1</p>
        <p className="absolute left-[50px] text-nowrap text-[18px] text-secondary-dark font-bold">
          Source
        </p>
      </div>
      <div className="flex">
        <div className="w-[2px] h-full bg-secondary-dark ml-[19px]"></div>
        <div className="flex flex-col">
          <p className="text-md ml-[29px] text-secondary-main">
            Project Name: Summer Trip 2020
          </p>
          <p className="text-md ml-[29px] text-secondary-main">Images: 200</p>
          <p className="text-md ml-[29px] text-secondary-main">Classes: 2</p>
          <p className="text-md ml-[29px] text-secondary-main">
            Unassigned: 13
          </p>
        </div>
      </div>
      {/*  */}
      <div className="relative size-[40px] bg-secondary-dark rounded-full flex items-center justify-center text-white font-bold ">
        2
        <p className="absolute left-[50px] text-nowrap text-[18px] text-secondary-dark font-bold">
          Train / Test Split
        </p>
      </div>
      <div className="flex">
        <div className="w-[2px] h-[40px] bg-secondary-dark ml-[19px]"></div>
      </div>
      <div className="relative size-[40px] bg-secondary-dark rounded-full flex items-center justify-center text-white font-bold ">
        3
        <p className="absolute left-[50px] text-nowrap text-[18px] text-secondary-dark font-bold">
          Augmentation
        </p>
      </div>
      <div className="flex">
        <div className="w-[2px] h-[40px] bg-secondary-dark ml-[19px]"></div>
      </div>
      <div className="relative size-[40px] bg-secondary-light rounded-full flex items-center justify-center text-secondary-dark font-bold ring-[3px] ring-secondary-main">
        <p>4</p>
        <p className="absolute left-[50px] text-nowrap text-[18px] text-secondary-dark font-bold">
          Create
        </p>
      </div>
      <div className="flex">
        <div className="w-[2px] h-full ml-[19px]"></div>
        <div className="flex flex-col">
          <p className="text-md ml-[29px] text-secondary-main">
            Before creating your model, please ensure the following steps are
            completed:
          </p>
          <p className="text-md ml-[29px] text-secondary-main">
            {" "}
            → All images have been accurately labeled. Accurate labels are
            crucial for training an effective model.
          </p>
          <p className="text-md ml-[29px] text-secondary-main">
            {" "}
            → Check the distribution of your labels to ensure a balanced
            dataset. Imbalanced datasets can lead to biased models.
          </p>
          <Button
            Icon={AiSolidIcon}
            otherTwClass={
              "ml-[29px] mt-[20px] w-fit bg-secondary-light/50 !text-secondary-dark !font-bold"
            }
            twHover="hover:bg-secondary-light/75"
            twFocus="focus:ring-[3px] focus:ring-secondary-dark/50"
          >
            Create Model
          </Button>
        </div>
      </div>
    </div>
  );
}
