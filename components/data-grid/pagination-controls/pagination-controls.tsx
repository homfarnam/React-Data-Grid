'use client';

import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { PaginationControlsProps } from '../types';

export const PaginationControls = ({
  currentPage,
  totalPages,
  pageSize,
  totalDocuments,
  onPageChange,
  onPageSizeChange,
}: PaginationControlsProps) => {
  const startIndex =
    totalDocuments === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endIndex =
    totalDocuments === 0 ? 0 : Math.min(currentPage * pageSize, totalDocuments);
  const disableForwardNav = totalPages === 0 || currentPage >= totalPages;
  const currentPageDisplay = totalDocuments === 0 ? 0 : currentPage;
  const totalPagesDisplay = totalDocuments === 0 ? 0 : totalPages;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2">
      <div className="flex items-center gap-2 text-sm">
        <span>Rows per page:</span>
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => onPageSizeChange(Number(value))}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>
          Showing {startIndex} to {endIndex} of {totalDocuments} documents
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          First
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          Previous
        </Button>
        <div className="flex items-center gap-1 text-sm">
          <span className="text-foreground font-medium">
            {currentPageDisplay}
          </span>
          <span className="text-muted-foreground">of {totalPagesDisplay}</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={disableForwardNav}
        >
          Next
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(totalPages)}
          disabled={disableForwardNav}
        >
          Last
        </Button>
      </div>
    </div>
  );
};

