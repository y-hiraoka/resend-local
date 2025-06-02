import Image from "next/image";
import brazilSvg from "./flags/brazil.svg";
import irelandSvg from "./flags/ireland.svg";
import japanSvg from "./flags/japan.svg";
import unitedStatesSvg from "./flags/united-states.svg";
import { Region } from "@/server/models/region";

export const RegionFlag: React.FC<{
  region: Region;
  className?: string;
}> = ({ region, className }) => {
  const flagMap: Record<Region, React.ComponentProps<typeof Image>["src"]> = {
    "ap-northeast-1": japanSvg,
    "eu-west-1": irelandSvg,
    "sa-east-1": brazilSvg,
    "us-east-1": unitedStatesSvg,
  };

  return (
    <Image
      src={flagMap[region]}
      alt="Brazil Flag"
      className={className}
      unoptimized
    />
  );
};
