'use client';

import { useSyncExternalStore } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { FilterConfig } from '@/lib/types';
import type { FilterChipsProps } from './types';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const FilterChips = ({ filters, onRemoveFilter }: FilterChipsProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  if (!isClient) {
    return null;
  }

  const filterEntries = Object.entries(filters).filter(([_, value]) => {
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    return value !== null && value !== undefined;
  });

  if (filterEntries.length === 0) {
    return null;
  }

  const getFilterLabel = (
    key: string,
    value: Date | number | string | string[]
  ): string => {
    switch (key) {
      case 'dateFrom':
        return `From: ${new Date(value as string).toLocaleDateString()}`;
      case 'dateTo':
        return `To: ${new Date(value as string).toLocaleDateString()}`;
      case 'revisionOperator':
        return '';
      case 'revisionValue':
        const operator = filters.revisionOperator;
        const operatorSymbol =
          operator === 'equals' ? '=' : operator === 'greater' ? '>' : '<';
        return `Revision ${operatorSymbol} ${value}`;
      case 'owners':
        return `Owners: ${(value as string[]).length}`;
      case 'favourite':
        return value ? 'Favourites only' : 'Non-favourites only';
      default:
        return String(value);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      {filterEntries.map(([key, value]) => {
        if (key === 'revisionOperator') {
          return null;
        }

        const label = getFilterLabel(key, value);
        if (!label) {
          return null;
        }

        return (
          <Badge key={key} variant="secondary" className="gap-1 pr-1">
            {label}
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-transparent"
              onClick={() => onRemoveFilter(key as keyof FilterConfig)}
            >
              <X className="h-3 w-3" />
              <span className="sr-only">Remove filter</span>
            </Button>
          </Badge>
        );
      })}
    </div>
  );
};
