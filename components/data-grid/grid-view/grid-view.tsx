'use client';

import { DataGrid } from '@/components/data-grid/grid-table';
import { DataGridControls } from '@/components/data-grid/toolbar';
import { FilterChips } from '@/components/filter-chips';
import { Loading } from '@/components/shared/loading';
import { useDataGridState } from '@/hooks/use-data-grid-state';

export const DataGridContainer = () => {
  const {
    searchQuery,
    columns,
    sorting,
    pagination,
    columnVisibility,
    filters,
    allOwners,
    loading,
    error,
    processedDocuments,
    totalDocuments,
    totalPages,
    handleToggleFavourite,
    handleReset,
    handleRemoveFilter,
    handleSearchChange,
    handleFiltersChange,
    handlePageSizeChange,
    handleColumnsChange,
    handleSortingChange,
    handlePaginationChange,
  } = useDataGridState();

  return (
    <div className="space-y-4">
      <DataGridControls
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        columns={columns}
        onColumnsChange={handleColumnsChange}
        filters={filters}
        onFiltersChange={handleFiltersChange}
        allOwners={allOwners}
        onReset={handleReset}
      />

      <FilterChips filters={filters} onRemoveFilter={handleRemoveFilter} />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="relative">
        {loading && <Loading />}

        <DataGrid
          documents={processedDocuments}
          sorting={sorting}
          onSortingChange={handleSortingChange}
          pagination={pagination}
          onPaginationChange={handlePaginationChange}
          columnVisibility={columnVisibility}
          onToggleFavourite={handleToggleFavourite}
          totalDocuments={totalDocuments}
          totalPages={totalPages}
          onPageSizeChange={handlePageSizeChange}
        />
      </div>
    </div>
  );
};
