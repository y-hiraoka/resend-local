"use client";

import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { EllipsisIcon, MailIcon } from "lucide-react";
import Link from "next/link";
import { dashboardAPIClient } from "@/lib/dashboard-api-client";
import { Email } from "@/server/models/email";
import { GetEmailsResult } from "@/server/usecases/get-emails";
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
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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

export const EmailList: React.FC<{
  page: number;
  count: number;
  emailsPromise: Promise<GetEmailsResult>;
}> = ({ page, count, emailsPromise }) => {
  const emailsQuery = useQuery({
    queryKey: ["emails"],
    initialData: use(emailsPromise),
    queryFn: async () => {
      const response = await dashboardAPIClient["dashboard-api"].emails.$get({
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
            <TableHead>To</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Sent</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {emailsQuery.data.emails.map((email) => (
            <EmailListItem key={email.id} email={email} />
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

const EmailListItem: React.FC<{ email: Email }> = ({ email }) => {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center">
          <span className="inline-grid place-items-center size-7 border rounded-sm mr-2">
            <MailIcon className="text-muted-foreground size-4" />
          </span>
          <Link
            className="underline decoration-dashed underline-offset-2 decoration-muted-foreground hover:decoration-primary transition-colors"
            href={`/dashboard/emails/${email.id}`}
          >
            {email.to[0]}
          </Link>
          {email.to.length > 1 && (
            <Tooltip>
              <TooltipTrigger className="ml-2">
                <span className="rounded border text-muted-foreground px-1.5 py-0.5 text-xs block">
                  +{email.to.length - 1}
                </span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="mb-1">To</p>
                {email.to.map((to, index) => (
                  <p key={index} className="font-medium text-foreground">
                    {to}
                  </p>
                ))}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      </TableCell>
      <TableCell className="text-xs">{email.from}</TableCell>
      <TableCell>{email.subject}</TableCell>
      <TableCell className="text-muted-foreground">
        {new Date(email.createdAt).toLocaleString()}
      </TableCell>
      <TableCell align="right">
        <Button type="button" variant="ghost" size="icon">
          <EllipsisIcon />
        </Button>
      </TableCell>
    </TableRow>
  );
};
