'use client';

import { useSyncExternalStore } from 'react';
import { RotateCcw } from 'lucide-react';
import { AdvancedFilterDialog } from '@/components/advanced-filter-dialog';
import { ColumnConfigDialog } from '@/components/column-config-dialog';
import { SearchBar } from '@/components/search-bar';
import { ShareUrlButton } from '@/components/share-url-button';
import { Button } from '@/components/ui/button';
import type { DataGridControlsProps } from '../types';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const DataGridControls = ({
  searchQuery,
  onSearchChange,
  columns,
  onColumnsChange,
  filters,
  onFiltersChange,
  allOwners,
  onReset,
}: DataGridControlsProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const hasActiveFilters = isClient ? Object.keys(filters).length > 0 : false;
  const hasActiveSearch = searchQuery.trim() !== '';
  const canReset = hasActiveSearch || hasActiveFilters;

  return (
    <div className="flex flex-col w-full sm:flex-row gap-3 items-start sm:items-center justify-between">
      <div className="w-full lg:w-1/2">
        <SearchBar
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Search by document nr, title, description, or owner..."
        />
      </div>

      <div className="flex gap-2 flex-wrap sm:w-1/2 justify-start sm:justify-end">
        <ColumnConfigDialog
          columns={columns}
          onColumnsChange={onColumnsChange}
        />
        <AdvancedFilterDialog
          filters={filters}
          onFiltersChange={onFiltersChange}
          allOwners={allOwners}
        />
        <ShareUrlButton />
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!canReset}
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  );
};

