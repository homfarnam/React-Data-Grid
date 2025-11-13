import type {
  OnChangeFn,
  PaginationState,
  SortingState,
  Table,
  VisibilityState,
} from '@tanstack/react-table';
import type { ColumnConfig, Document, FilterConfig } from '@/lib/types';

// Component types (from data-grid-component)
export interface DataGridProps {
  documents: Document[];
  sorting: SortingState;
  onSortingChange: OnChangeFn<SortingState>;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  columnVisibility: VisibilityState;
  onToggleFavourite: (id: number) => void;
  totalDocuments: number;
  totalPages: number;
  onPageSizeChange: (size: number) => void;
}

// Controls types (from data-grid-controls)
export interface DataGridControlsProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  allOwners: string[];
  onReset: () => void;
}

// Table component types
export interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalDocuments: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export interface TableHeaderProps {
  table: Table<Document>;
}

export interface EmptyStateProps {
  columnCount: number;
}
