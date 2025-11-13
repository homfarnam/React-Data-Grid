'use client';

import { useCallback, useEffect, useState } from 'react';
import type { Document, FilterConfig } from '@/lib/types';

interface ApiFilters extends FilterConfig {
  search: string;
}

interface ApiResponse {
  documents: Document[];
  pagination: {
    page: number;
    pageSize: number;
    totalDocuments: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  filters: ApiFilters;
  sorting: {
    sortBy: string;
    sortOrder: string;
  };
}

interface UseDocumentsApiParams {
  page: number;
  pageSize: number;
  searchQuery: string;
  filters: FilterConfig;
  favourites: number[];
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  enabled?: boolean;
}

export const useDocumentsApi = ({
  page,
  pageSize,
  searchQuery,
  filters,
  favourites,
  sortBy = '',
  sortOrder = 'asc',
  enabled = true,
}: UseDocumentsApiParams) => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocuments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set('page', page.toString());
      params.set('pageSize', pageSize.toString());

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      if (sortBy) {
        params.set('sortBy', sortBy);
        params.set('sortOrder', sortOrder);
      }

      if (filters.dateFrom) {
        const dateFromISO = new Date(filters.dateFrom).toISOString();
        params.set('dateFrom', dateFromISO);
      }
      if (filters.dateTo) {
        const dateToISO = new Date(filters.dateTo).toISOString();
        params.set('dateTo', dateToISO);
      }
      if (filters.revisionOperator) {
        params.set('revisionOperator', filters.revisionOperator);
      }
      if (filters.revisionValue) {
        params.set('revisionValue', filters.revisionValue.toString());
      }
      if (filters.owners && filters.owners.length > 0) {
        params.set('owners', JSON.stringify(filters.owners));
      }
      if (filters.favourite !== null && filters.favourite !== undefined) {
        params.set('favourite', filters.favourite.toString());
      }

      if (favourites.length > 0) {
        params.set('favourites', JSON.stringify(favourites));
      }

      const response = await fetch(`/api/documents?${params.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch documents');
      }

      const result: ApiResponse = await response.json();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, filters, favourites, sortBy, sortOrder]);

  useEffect(() => {
    if (enabled) {
      fetchDocuments();
    }
  }, [fetchDocuments, enabled]);

  return {
    documents: data?.documents || [],
    pagination: data?.pagination,
    loading,
    error,
    refetch: fetchDocuments,
  };
};
