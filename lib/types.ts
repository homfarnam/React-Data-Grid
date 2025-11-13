export interface Document {
  id: number;
  documentNr: string;
  title: string;
  description: string;
  revision: number;
  createdDate: string;
  owner: string;
  favourite: boolean;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: keyof Document | null;
  direction: SortDirection;
}

export interface ColumnConfig {
  key: keyof Document;
  label: string;
  visible: boolean;
}

export interface FilterConfig {
  dateFrom?: string;
  dateTo?: string;
  revisionOperator?: 'equals' | 'greater' | 'less';
  revisionValue?: number;
  owners?: string[];
  favourite?: boolean | null;
}
