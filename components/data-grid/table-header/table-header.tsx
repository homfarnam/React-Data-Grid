'use client';

import { flexRender } from '@tanstack/react-table';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TableHeaderProps } from '../types';

export const TableHeader = ({ table }: TableHeaderProps) => {
  return (
    <thead>
      {table.getHeaderGroups().map((headerGroup) => (
        <tr key={headerGroup.id} className="border-b bg-muted/50">
          {headerGroup.headers.map((header) => {
            const canSort = header.column.getCanSort();
            const isSorted = header.column.getIsSorted();

            return (
              <th
                key={header.id}
                className="p-3 text-left font-semibold text-muted-foreground"
              >
                {header.isPlaceholder ? null : canSort ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 font-semibold hover:bg-accent"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                    <span className="ml-2">
                      {!isSorted && (
                        <ChevronsUpDown className="h-4 w-4 text-muted-foreground" />
                      )}
                      {isSorted === 'asc' && <ChevronUp className="h-4 w-4" />}
                      {isSorted === 'desc' && (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
                  </Button>
                ) : (
                  flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )
                )}
              </th>
            );
          })}
        </tr>
      ))}
    </thead>
  );
};

