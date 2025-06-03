"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { use } from "react";
import { EllipsisIcon, KeyRoundIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { dashboardAPIClient } from "@/lib/dashboard-api-client";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";

import {
  getPaginationIndicator,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { APIKey } from "@/server/models/api-key";
import { GetAPIKeysResult } from "@/server/usecases/get-api-keys";
import { deleteAPIKey } from "@/lib/resend-api-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const APIKeyList: React.FC<{
  page: number;
  count: number;
  apiKeysPromise: Promise<GetAPIKeysResult>;
}> = ({ page, count, apiKeysPromise }) => {
  const apiKeysQuery = useQuery({
    queryKey: ["apiKeys", page, count],
    initialData: use(apiKeysPromise),
    queryFn: async () => {
      const response = await dashboardAPIClient["dashboard-api"][
        "api-keys"
      ].$get({
        query: { offset: String(page - 1), limit: String(count) },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }
      return await response.json();
    },
    refetchInterval: 1000,
  });

  const totalPages = Math.ceil(apiKeysQuery.data.total / count);

  const paginationIndicators = getPaginationIndicator({
    currentPage: page,
    totalPages,
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>Permission</TableHead>
            <TableHead>Domain</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {apiKeysQuery.data.apiKeys.map((apiKey) => (
            <APIKeyListItem key={apiKey.id} apiKey={apiKey} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={6}>
              <span>
                <span className="font-light">Page</span> {page}{" "}
                <span className="font-light">of</span> {totalPages}
              </span>
              <span className="ml-4">
                {apiKeysQuery.data.total}{" "}
                <span className="font-light">keys</span>
              </span>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      {totalPages > 1 && (
        <Pagination className="mt-8">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={`?page=${Math.max(1, page - 1)}&count=${count}`}
              />
            </PaginationItem>
            {paginationIndicators.map((indicator, index) => (
              <PaginationItem key={index}>
                {indicator.type === "page" ? (
                  <PaginationLink
                    href={`?page=${indicator.page}&count=${count}`}
                    isActive={indicator.isCurrent}
                  >
                    {indicator.page}
                  </PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={`?page=${Math.min(totalPages, page + 1)}&count=${count}`}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

const APIKeyListItem: React.FC<{ apiKey: APIKey }> = ({ apiKey }) => {
  const deleteMutation = useMutation({
    mutationFn: () => deleteAPIKey(apiKey.id),
    onSuccess: () => {
      toast.success("API key deleted successfully");
    },
  });

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <span className="inline-grid place-items-center size-7 border rounded-sm mr-2">
            <KeyRoundIcon className="text-muted-foreground size-4" />
          </span>
          {apiKey.name}
        </div>
      </TableCell>
      <TableCell>
        <Tooltip>
          <TooltipTrigger>
            <span className="font-mono text-xs">
              {apiKey.token.slice(0, 10)}...
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <span className="font-mono text-sm">{apiKey.token}</span>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        {
          {
            full_access: "Full access",
            sending_access: "Sending access",
          }[apiKey.permission]
        }
      </TableCell>
      <TableCell className="font-mono">{apiKey.domain?.name ?? "-"}</TableCell>
      <TableCell>
        {formatDistanceToNow(new Date(apiKey.createdAt), {
          addSuffix: true,
        })}
      </TableCell>
      <TableCell align="right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button type="button" variant="ghost" size="icon">
              <EllipsisIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              variant="destructive"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              Delete API Key
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
