import type { FilterConfig } from '@/lib/types';

export interface FilterChipsProps {
  filters: FilterConfig;
  onRemoveFilter: (key: keyof FilterConfig) => void;
}
