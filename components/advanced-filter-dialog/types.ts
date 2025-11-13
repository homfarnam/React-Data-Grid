import type { FilterConfig } from '@/lib/types';

export interface AdvancedFilterDialogProps {
  filters: FilterConfig;
  onFiltersChange: (filters: FilterConfig) => void;
  allOwners: string[];
}
