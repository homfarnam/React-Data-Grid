'use client';

import type { ColumnDef } from '@tanstack/react-table';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Document } from '@/lib/types';
import { cn } from '@/lib/utils';

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = date.toLocaleString('en-US', { month: 'short' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${day}, ${year}`;
};

export const createColumns = (
  onToggleFavourite: (id: number) => void,
  isMounted: boolean = false
): ColumnDef<Document>[] => [
  {
    accessorKey: 'documentNr',
    id: 'documentNr',
    header: 'Document Nr',
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'title',
    id: 'title',
    header: 'Document Title',
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'description',
    id: 'description',
    header: 'Description',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return (
        <div className="truncate" title={value}>
          {value}
        </div>
      );
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'revision',
    id: 'revision',
    header: 'Revision Nr',
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'createdDate',
    id: 'createdDate',
    header: 'Created Date',
    cell: ({ getValue }) => {
      const value = getValue() as string;
      return <span suppressHydrationWarning>{formatDate(value)}</span>;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'owner',
    id: 'owner',
    header: 'Document Owner',
    cell: ({ getValue }) => getValue(),
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: 'favourite',
    id: 'favourite',
    header: () => (
      <div className="flex items-center justify-center">
        <Star className="h-4 w-4" />
      </div>
    ),
    cell: ({ row }) => {
      const document = row.original;
      // Show neutral state during SSR to prevent hydration mismatch
      const isFavourite = isMounted ? document.favourite : false;

      return (
        <div className="flex items-center justify-center">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => onToggleFavourite(document.id)}
          >
            <Star
              className={cn(
                'h-5 w-5 transition-colors',
                isFavourite
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-muted-foreground hover:text-yellow-400'
              )}
            />
          </Button>
        </div>
      );
    },
    enableSorting: false,
    enableHiding: true,
  },
];
