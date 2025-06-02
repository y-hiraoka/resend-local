import { cn } from "@/lib/utils";
import { Domain } from "@/server/models/domain";

export const DomainStatus: React.FC<{
  status: Domain["status"];
}> = ({ status }) => {
  return (
    <span
      className={cn(
        "inline-block px-2 py-1 rounded-sm text-xs font-medium",
        {
          not_started:
            "bg-neutral-500/20 text-neutral-700 dark:text-neutral-400",
          pending: "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400",
          verified: "bg-green-500/20 text-green-800 dark:text-green-400",
          failure: "bg-red-500/20 text-red-700 dark:text-red-400",
          temporary_failure:
            "bg-orange-500/20 text-orange-700 dark:text-orange-400",
        }[status],
      )}
    >
      {status}
    </span>
  );
};
