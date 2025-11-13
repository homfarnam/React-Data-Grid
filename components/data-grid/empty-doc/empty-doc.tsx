'use client';

import type { EmptyStateProps } from '../types';

export const EmptyDoc = ({ columnCount }: EmptyStateProps) => {
  return (
    <tr>
      <td
        colSpan={columnCount}
        className="h-24 text-center text-muted-foreground"
      >
        No documents found.
      </td>
    </tr>
  );
};
