/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  PaginationState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { getAllOwners } from '@/lib/mock-data';
import type { ColumnConfig, FilterConfig } from '@/lib/types';
import { useDocumentsApi } from './use-documents-api';
import { useUrlState } from './use-url-state';

const DEFAULT_COLUMNS: ColumnConfig[] = [
  { key: 'documentNr', label: 'Document Nr', visible: true },
  { key: 'title', label: 'Document Title', visible: true },
  { key: 'description', label: 'Description', visible: true },
  { key: 'revision', label: 'Revision Nr', visible: true },
  { key: 'createdDate', label: 'Created Date', visible: true },
  { key: 'owner', label: 'Document Owner', visible: true },
  { key: 'favourite', label: 'Favourite', visible: true },
];

const DEFAULT_PAGE_SIZE = 25;
const FIRST_PAGE = 1;

export const useDataGridState = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [isReady, setIsReady] = useState(false);
  const initialValuesRef = useRef({
    page: 0,
    pageSize: 0,
  });

  const [columns, setColumns] = useUrlState<ColumnConfig[]>(
    'columns',
    DEFAULT_COLUMNS
  );
  const [pageSize, setPageSize] = useUrlState<number>(
    'pageSize',
    DEFAULT_PAGE_SIZE,
    {
      alwaysInUrl: true,
    }
  );
  const [page, setPage] = useUrlState<number>('page', FIRST_PAGE, {
    alwaysInUrl: true,
  });
  const [filters, setFilters] = useUrlState<FilterConfig>('filters', {});
  const [favourites, setFavourites] = useUrlState<number[]>('favourites', []);

  useEffect(() => {
    if (!isReady) {
      initialValuesRef.current = { page, pageSize };
      setIsReady(true);
    }
  }, [isReady, page, pageSize]);

  const [pagination, setPagination] = useState<PaginationState>(() => ({
    pageIndex: page - FIRST_PAGE,
    pageSize: pageSize,
  }));

  const sortBy = sorting[0]?.id || '';
  const sortOrder = sorting[0]?.desc ? 'desc' : 'asc';

  const {
    documents: processedDocuments,
    pagination: apiPagination,
    loading,
    error,
  } = useDocumentsApi({
    page: page,
    pageSize: pageSize,
    searchQuery,
    filters,
    favourites,
    sortBy,
    sortOrder,
    enabled: isReady,
  });

  const columnVisibility = useMemo<VisibilityState>(() => {
    return columns.reduce((acc, col) => {
      acc[col.key] = col.visible;
      return acc;
    }, {} as VisibilityState);
  }, [columns]);

  const allOwners = useMemo(
    () => getAllOwners(processedDocuments),
    [processedDocuments]
  );

  const totalDocuments = apiPagination?.totalDocuments || 0;
  const totalPages = apiPagination?.totalPages || 1;

  const handleToggleFavourite = useCallback((id: number) => {
    setFavourites((prev) => {
      const newFavourites = prev.includes(id)
        ? prev.filter((fav) => fav !== id)
        : [...prev, id];
      return newFavourites;
    });
  }, []);

  const handleReset = useCallback(() => {
    setSearchQuery('');
    setSorting([]);
    setPagination({ pageIndex: 0, pageSize: DEFAULT_PAGE_SIZE });

    setColumns(DEFAULT_COLUMNS);
    setPageSize(DEFAULT_PAGE_SIZE);
    setPage(FIRST_PAGE);
    setFilters({});
    setFavourites([]);
  }, []);

  const handleRemoveFilter = useCallback((filterKey: keyof FilterConfig) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(FIRST_PAGE);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleFiltersChange = useCallback((newFilters: FilterConfig) => {
    setFilters(newFilters);
    setPage(FIRST_PAGE);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handlePageSizeChange = useCallback((size: number) => {
    setPageSize(size);
    setPage(FIRST_PAGE);
    setPagination({ pageIndex: 0, pageSize: size });
  }, []);

  useEffect(() => {
    setPagination({ pageIndex: page - 1, pageSize });
  }, [page, pageSize]);

  const handleColumnsChange = useCallback((newColumns: ColumnConfig[]) => {
    setColumns(newColumns);
  }, []);

  const handleSortingChange = useCallback(
    (updaterOrValue: SortingState | ((old: SortingState) => SortingState)) => {
      setSorting(updaterOrValue);
      setPage(FIRST_PAGE);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    []
  );

  const handlePaginationChange = useCallback(
    (
      updaterOrValue:
        | PaginationState
        | ((old: PaginationState) => PaginationState)
    ) => {
      const newPagination =
        typeof updaterOrValue === 'function'
          ? updaterOrValue(pagination)
          : updaterOrValue;

      setPagination(newPagination);
      setPage(newPagination.pageIndex + 1);
    },
    [pagination]
  );

  return {
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
  };
};
