import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function Pagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) {
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  return (
    <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
        <span className="text-sm whitespace-nowrap">Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => {
            onPageSizeChange(Number(value));
            onPageChange(1);
          }}
        >
          <SelectTrigger className="w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[5, 10, 20, 50].map((size) => (
              <SelectItem key={size} value={size.toString()}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-gray-700 hidden sm:inline whitespace-nowrap">
          {startIndex + 1}-{endIndex} of {totalItems}
        </span>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
        <Button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          variant="outline"
          size="sm"
          className="text-sm whitespace-nowrap"
        >
          Previous
        </Button>

        <div className="hidden sm:flex items-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .filter((page) => {
              const distance = Math.abs(page - currentPage);
              return (
                distance === 0 ||
                distance === 1 ||
                page === 1 ||
                page === totalPages
              );
            })
            .map((page, index, array) => (
              <React.Fragment key={page}>
                {index > 0 && array[index - 1] !== page - 1 && (
                  <span className="px-1">...</span>
                )}
                <Button
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => onPageChange(page)}
                  className="text-sm min-w-[32px]"
                >
                  {page}
                </Button>
              </React.Fragment>
            ))}
        </div>

        <span className="sm:hidden text-sm">
          Page {currentPage} of {totalPages}
        </span>

        <Button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          variant="outline"
          size="sm"
          className="text-sm whitespace-nowrap"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
