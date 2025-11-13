import type { ColumnConfig } from '@/lib/types';

export interface ColumnConfigDialogProps {
  columns: ColumnConfig[];
  onColumnsChange: (columns: ColumnConfig[]) => void;
}
