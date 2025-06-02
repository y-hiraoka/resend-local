import { Domain } from "@/server/models/domain";
import { RegionFlag } from "./region-flag";

export const DomainRegion: React.FC<{
  region: Domain["region"];
}> = ({ region }) => {
  const regionName = {
    "ap-northeast-1": "Tokyo",
    "us-east-1": "N. Virginia",
    "eu-west-1": "Ireland",
    "sa-east-1": "São Paulo",
  }[region];

  return (
    <span className="flex items-center space-x-1">
      <RegionFlag region={region} className="inline-block h-6" />
      <span className="font-medium">{regionName}</span>
      <span className="text-muted-foreground">({region})</span>
    </span>
  );
};
