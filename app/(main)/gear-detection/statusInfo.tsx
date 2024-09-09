"use client";
import ButtonModal from "@/app/components/buttonModal";
import { BoatIcon, SensorIcon, WaterIcon } from "@/app/icons/myIcons";

export default function StatusInfo() {
  return (
    <>
      <h1 className="text-[18px] font-semibold text-dark mb-[5px]">
        Status Info
      </h1>

      <ButtonModal
        Icon={BoatIcon}
        twTextColor="text-dark"
        twBg="bg-light/50"
        twHover="hover:bg-light-dark/20"
        twFocus="focus:ring-[3px] focus:ring-light-dark/30"
        otherTwClass={"w-full text-sm !justify-start"}
        btnName="Ship Status"
        modalInfo={[
          { name: "Speed", value: "2.72m/s" },
          { name: "Depth", value: "0" },
          { name: "Altitude", value: "0" },
          { name: "Gyro", value: "254.8" },
        ]}
      >
        Ship Status
      </ButtonModal>
      <ButtonModal
        Icon={SensorIcon}
        twTextColor="text-dark"
        twBg="bg-light/50"
        twHover="hover:bg-light-dark/20"
        twFocus="focus:ring-[3px] focus:ring-light-dark/30"
        otherTwClass={"w-full text-sm !justify-start"}
        btnName="Ship Status"
        modalInfo={[
          { name: "Speed", value: "2.72m/s" },
          { name: "Depth", value: "13.82m" },
          { name: "Primary Altitude", value: "10.17m" },
          { name: "Pitch", value: "10.17m" },
          { name: "Role", value: "-1.4" },
          { name: "Heady", value: "-1.5" },
          { name: "Gyro", value: "261.89" },
        ]}
      >
        Sensor Status
      </ButtonModal>
      <ButtonModal
        Icon={WaterIcon}
        twTextColor="text-dark"
        twBg="bg-light/50"
        twHover="hover:bg-light-dark/20"
        twFocus="focus:ring-[3px] focus:ring-light-dark/30"
        otherTwClass={"w-full text-sm !justify-start"}
        btnName="Ship Status"
        modalInfo={[
          { name: "Water Temperature", value: "3.06ºC" },
          { name: "Water Conductivity", value: "0" },
          { name: "Pressure", value: "0" },
        ]}
      >
        Environment Status
      </ButtonModal>
    </>
  );
}
