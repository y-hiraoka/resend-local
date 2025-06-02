"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { EllipsisIcon, GlobeIcon } from "lucide-react";
import Link from "next/link";
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
import { GetDomainsResult } from "@/server/usecases/get-domains";
import { Domain } from "@/server/models/domain";
import { DomainStatus } from "@/components/domain-status";
import { DomainRegion } from "@/components/domain-region";

export const DomainList: React.FC<{
  page: number;
  count: number;
  domainsPromise: Promise<GetDomainsResult>;
}> = ({ page, count, domainsPromise }) => {
  const emailsQuery = useQuery({
    queryKey: ["domains", page, count],
    initialData: use(domainsPromise),
    queryFn: async () => {
      const response = await dashboardAPIClient["dashboard-api"].domains.$get({
        query: { offset: String(page - 1), limit: String(count) },
      });
      if (!response.ok) {
        throw new Error("Failed to fetch emails");
      }
      return await response.json();
    },
    refetchInterval: 1000,
  });

  const totalPages = Math.ceil(emailsQuery.data.total / count);

  const paginationIndicators = getPaginationIndicator({
    currentPage: page,
    totalPages,
  });

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Domain</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailsQuery.data.domains.map((domain) => (
            <DomainListItem key={domain.id} domain={domain} />
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={5}>
              <span>
                <span className="font-light">Page</span> {page}{" "}
                <span className="font-light">of</span> {totalPages}
              </span>
              <span className="ml-4">
                {emailsQuery.data.total}{" "}
                <span className="font-light">emails</span>
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

const DomainListItem: React.FC<{ domain: Domain }> = ({ domain }) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <span className="inline-grid place-items-center size-7 border rounded-sm mr-2">
            <GlobeIcon className="text-muted-foreground size-4" />
          </span>
          <Link
            className="underline decoration-dashed underline-offset-2 decoration-muted-foreground hover:decoration-primary transition-colors"
            href={`/dashboard/domains/${domain.id}`}
          >
            {domain.name}
          </Link>
        </div>
      </TableCell>
      <TableCell>
        <DomainStatus status={domain.status} />
      </TableCell>
      <TableCell>
        <DomainRegion region={domain.region} />
      </TableCell>
      <TableCell>{new Date(domain.createdAt).toLocaleString()}</TableCell>
      <TableCell align="right">
        <Button type="button" variant="ghost" size="icon">
          <EllipsisIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};
