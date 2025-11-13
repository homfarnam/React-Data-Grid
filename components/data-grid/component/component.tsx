'use client';

import { useMemo, useSyncExternalStore } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { createColumns } from '@/lib/columns';
import { EmptyState } from '../empty-state';
import { PaginationControls } from '../pagination-controls';
import { TableHeader } from '../table-header';
import type { DataGridProps } from '../types';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const DataGrid = ({
  documents,
  sorting,
  onSortingChange,
  pagination,
  onPaginationChange,
  columnVisibility,
  onToggleFavourite,
  totalDocuments,
  totalPages,
  onPageSizeChange,
}: DataGridProps) => {
  // Track if we're on the client to prevent hydration mismatch
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const columns = useMemo(
    () => createColumns(onToggleFavourite, isClient),
    [onToggleFavourite, isClient]
  );

  const table = useReactTable({
    data: documents,
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
    },
    onSortingChange,
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    autoResetPageIndex: false,
  });

  const visibleColumnCount = table.getVisibleLeafColumns().length || 1;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <TableHeader table={table} />
            <tbody>
              {documents.length === 0 ? (
                <EmptyState columnCount={visibleColumnCount} />
              ) : (
                documents.map((doc, index) => {
                  const row = table.getRowModel().rows[index];
                  return (
                    <tr key={doc.id} className="border-b hover:bg-muted/50">
                      {row?.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="p-3 align-top">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <PaginationControls
        currentPage={pagination.pageIndex + 1}
        totalPages={totalPages}
        pageSize={pagination.pageSize}
        totalDocuments={totalDocuments}
        onPageChange={(page) =>
          onPaginationChange({ ...pagination, pageIndex: page - 1 })
        }
        onPageSizeChange={onPageSizeChange}
      />
    </div>
  );
};
