"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { use } from "react";
import { CircleAlertIcon, EllipsisIcon, GlobeIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Domain } from "@/server/models/domain";
import { dashboardAPIClient } from "@/lib/dashboard-api-client";
import { DomainStatus } from "@/components/domain-status";
import { DomainRegion } from "@/components/domain-region";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { deleteDomain, verifyDomain } from "@/lib/resend-api-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const DomainView: React.FC<{
  domainId: string;
  domainPromise: Promise<Domain>;
}> = ({ domainId, domainPromise }) => {
  const domainQuery = useQuery({
    queryKey: ["domain", domainId],
    initialData: use(domainPromise),
    queryFn: async () => {
      const response = await dashboardAPIClient["dashboard-api"].domains[
        ":domainId"
      ].$get({ param: { domainId } });
      if (!response.ok) {
        throw new Error("Failed to fetch domain");
      }
      return await response.json();
    },
    refetchInterval: 1000,
  });

  const domain = domainQuery.data;

  if (!domain) return null;

  return (
    <div className="@container max-w-5xl mx-auto px-4 py-12">
      <div className="flex gap-4 items-center">
        <div className="grid place-items-center bg-muted size-20 border-2 rounded-3xl shadow-md">
          <GlobeIcon className="size-11 text-muted-foreground" />
        </div>
        <h2 className="flex gap-1 flex-col flex-1">
          <span className="text-muted-foreground">Domain</span>
          <span className="text-xl font-medium">{domain.name}</span>
        </h2>
        <DomainActionButton domainId={domain.id} />
      </div>
      <div className="grid grid-cols-2 gap-4 mt-8 @lg:grid-cols-3">
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Created</div>
          <span className="text-sm">
            {formatDistanceToNow(new Date(domain.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Status</div>
          <DomainStatus status={domain.status} />
        </div>
        <div className="w-full">
          <div className="text-sm text-muted-foreground mb-2">Region</div>
          <div className="text-sm">
            <DomainRegion region={domain.region} />
          </div>
        </div>
      </div>
      <Alert className="mt-12" variant="destructive">
        <CircleAlertIcon />
        <AlertTitle>
          Do not register these records in the actual DNS provider
        </AlertTitle>
        <AlertDescription>
          The records below are for testing purposes only and should not be
          registered with your actual DNS provider. They are fictitious values
          for Resend API simulation.
        </AlertDescription>
      </Alert>
      <div className="rounded-2xl border p-4 mt-8">
        <h3 className="text-lg font-semibold mb-4">DNS Records</h3>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>TTL</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {domain.records.map((record, index) => (
              <TableRow key={index}>
                <TableCell className="font-mono">{record.type}</TableCell>
                <TableCell className="font-mono">{record.name}</TableCell>
                <TableCell className="font-mono">{record.value}</TableCell>
                <TableCell className="font-mono">{record.ttl}</TableCell>
                <TableCell className="font-mono">{record.priority}</TableCell>
                <TableCell>
                  <DomainStatus status={record.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

const DomainActionButton: React.FC<{
  domainId: string;
}> = ({ domainId }) => {
  const router = useRouter();
  const verifyMutation = useMutation({
    mutationFn: async () => verifyDomain(domainId),
    onSuccess: () => {
      toast("Domain verification has been scheduled");
    },
  });
  const deleteMutation = useMutation({
    mutationFn: async () => deleteDomain(domainId),
    onSuccess: () => {
      toast.success("Domain deleted successfully");
      router.push("/dashboard/domains");
    },
  });

  return (
    <div className="flex items-center gap-1.5">
      <Button
        onClick={() => verifyMutation.mutate()}
        disabled={verifyMutation.isPending}
      >
        Verify
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" aria-label="More options" variant="outline">
            <EllipsisIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => deleteMutation.mutate()}
            disabled={deleteMutation.isPending}
          >
            Delete Domain
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
