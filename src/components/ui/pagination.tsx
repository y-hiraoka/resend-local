import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      role="navigation"
      aria-label="pagination"
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex flex-row items-center gap-1", className)}
      {...props}
    />
  );
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />;
}

type PaginationLinkProps = {
  isActive?: boolean;
} & Pick<React.ComponentProps<typeof Button>, "size"> &
  React.ComponentProps<typeof Link>;

function PaginationLink({
  className,
  isActive,
  size = "icon",
  ...props
}: PaginationLinkProps) {
  return (
    <Link
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({
          variant: isActive ? "outline" : "ghost",
          size,
        }),
        className,
      )}
      {...props}
    />
  );
}

function PaginationPrevious({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to previous page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pl-2.5", className)}
      {...props}
    >
      <ChevronLeftIcon />
      <span className="hidden sm:block">Previous</span>
    </PaginationLink>
  );
}

function PaginationNext({
  className,
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink
      aria-label="Go to next page"
      size="default"
      className={cn("gap-1 px-2.5 sm:pr-2.5", className)}
      {...props}
    >
      <span className="hidden sm:block">Next</span>
      <ChevronRightIcon />
    </PaginationLink>
  );
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center", className)}
      {...props}
    >
      <MoreHorizontalIcon className="size-4" />
      <span className="sr-only">More pages</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
};

type PaginationItem =
  | { type: "page"; page: number; isCurrent: boolean }
  | { type: "ellipsis"; key: string };

export function getPaginationIndicator({
  currentPage,
  maxVisiblePages = 5,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
  maxVisiblePages?: number;
}): PaginationItem[] {
  if (totalPages < 1) return [];

  const items: PaginationItem[] = [];

  const sideCount = Math.floor(maxVisiblePages / 2);
  let start = Math.max(2, currentPage - sideCount);
  let end = Math.min(totalPages - 1, currentPage + sideCount);

  if (currentPage <= sideCount + 1) {
    start = 2;
    end = Math.min(totalPages - 1, 1 + maxVisiblePages);
  } else if (currentPage >= totalPages - sideCount) {
    start = Math.max(2, totalPages - maxVisiblePages);
    end = totalPages - 1;
  }

  // 先頭ページ
  items.push({
    type: "page",
    page: 1,
    isCurrent: currentPage === 1,
  });

  // 前省略
  if (start > 2) {
    items.push({ type: "ellipsis", key: "ellipsis-prev" });
  }

  // 中央ページ群
  for (let i = start; i <= end; i++) {
    items.push({
      type: "page",
      page: i,
      isCurrent: i === currentPage,
    });
  }

  // 後省略
  if (end < totalPages - 1) {
    items.push({ type: "ellipsis", key: "ellipsis-next" });
  }

  // 最後のページ
  if (totalPages > 1) {
    items.push({
      type: "page",
      page: totalPages,
      isCurrent: currentPage === totalPages,
    });
  }

  return items;
}
