import { describe, expect, it } from 'vitest';
import {
  applyDateFilter,
  applyFavouriteFilter,
  applyOwnerFilter,
  applyRevisionFilter,
  applySearch,
  applySorting,
  calculatePagination,
  constrainPageNumber,
} from './data-grid-utils';
import type { Document, SortConfig } from './types';

const mockDocuments: Document[] = [
  {
    id: 1,
    documentNr: 'DOC-001',
    title: 'Project Specification',
    description: 'Initial project specs',
    revision: 1,
    createdDate: '2024-01-15',
    owner: 'John Doe',
    favourite: false,
  },
  {
    id: 2,
    documentNr: 'DOC-002',
    title: 'Design Document',
    description: 'UI/UX design guidelines',
    revision: 3,
    createdDate: '2024-02-20',
    owner: 'Jane Smith',
    favourite: true,
  },
  {
    id: 3,
    documentNr: 'DOC-003',
    title: 'Technical Requirements',
    description: 'Technical specifications',
    revision: 2,
    createdDate: '2024-03-10',
    owner: 'John Doe',
    favourite: false,
  },
];

describe('applySearch', () => {
  it('should return all documents when search query is empty', () => {
    const result = applySearch(mockDocuments, '');
    expect(result).toEqual(mockDocuments);
  });

  it('should filter by document number', () => {
    const result = applySearch(mockDocuments, 'DOC-001');
    expect(result).toHaveLength(1);
    expect(result[0].documentNr).toBe('DOC-001');
  });

  it('should filter by title (case insensitive)', () => {
    const result = applySearch(mockDocuments, 'design');
    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('Design Document');
  });

  it('should filter by description', () => {
    const result = applySearch(mockDocuments, 'specifications');
    expect(result).toHaveLength(1);
    expect(result[0].description).toBe('Technical specifications');
  });

  it('should filter by owner', () => {
    const result = applySearch(mockDocuments, 'jane');
    expect(result).toHaveLength(1);
    expect(result[0].owner).toBe('Jane Smith');
  });

  it('should return multiple matching documents', () => {
    const result = applySearch(mockDocuments, 'john');
    expect(result).toHaveLength(2);
  });
});

describe('applyDateFilter', () => {
  it('should filter by dateFrom', () => {
    const result = applyDateFilter(mockDocuments, '2024-02-01', undefined);
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe(2);
    expect(result[1].id).toBe(3);
  });

  it('should filter by dateTo', () => {
    const result = applyDateFilter(mockDocuments, undefined, '2024-02-01');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe(1);
  });

  it('should filter by date range', () => {
    const result = applyDateFilter(mockDocuments, '2024-01-01', '2024-02-28');
    expect(result).toHaveLength(2);
  });

  it('should return all documents when no dates provided', () => {
    const result = applyDateFilter(mockDocuments, undefined, undefined);
    expect(result).toEqual(mockDocuments);
  });
});

describe('applyRevisionFilter', () => {
  it('should filter by equals operator', () => {
    const result = applyRevisionFilter(mockDocuments, 'equals', 2);
    expect(result).toHaveLength(1);
    expect(result[0].revision).toBe(2);
  });

  it('should filter by greater operator', () => {
    const result = applyRevisionFilter(mockDocuments, 'greater', 1);
    expect(result).toHaveLength(2);
    expect(result.every((doc) => doc.revision > 1)).toBe(true);
  });

  it('should filter by less operator', () => {
    const result = applyRevisionFilter(mockDocuments, 'less', 3);
    expect(result).toHaveLength(2);
    expect(result.every((doc) => doc.revision < 3)).toBe(true);
  });

  it('should return all documents when no operator provided', () => {
    const result = applyRevisionFilter(mockDocuments, undefined, 2);
    expect(result).toEqual(mockDocuments);
  });

  it('should return all documents when no value provided', () => {
    const result = applyRevisionFilter(mockDocuments, 'equals', undefined);
    expect(result).toEqual(mockDocuments);
  });
});

describe('applyOwnerFilter', () => {
  it('should filter by single owner', () => {
    const result = applyOwnerFilter(mockDocuments, ['John Doe']);
    expect(result).toHaveLength(2);
    expect(result.every((doc) => doc.owner === 'John Doe')).toBe(true);
  });

  it('should filter by multiple owners', () => {
    const result = applyOwnerFilter(mockDocuments, ['John Doe', 'Jane Smith']);
    expect(result).toHaveLength(3);
  });

  it('should return all documents when owners array is empty', () => {
    const result = applyOwnerFilter(mockDocuments, []);
    expect(result).toEqual(mockDocuments);
  });

  it('should return all documents when owners is undefined', () => {
    const result = applyOwnerFilter(mockDocuments, undefined);
    expect(result).toEqual(mockDocuments);
  });
});

describe('applyFavouriteFilter', () => {
  it('should filter favourite documents', () => {
    const result = applyFavouriteFilter(mockDocuments, true);
    expect(result).toHaveLength(1);
    expect(result[0].favourite).toBe(true);
  });

  it('should filter non-favourite documents', () => {
    const result = applyFavouriteFilter(mockDocuments, false);
    expect(result).toHaveLength(2);
    expect(result.every((doc) => !doc.favourite)).toBe(true);
  });

  it('should return all documents when favourite is null', () => {
    const result = applyFavouriteFilter(mockDocuments, null);
    expect(result).toEqual(mockDocuments);
  });

  it('should return all documents when favourite is undefined', () => {
    const result = applyFavouriteFilter(mockDocuments, undefined);
    expect(result).toEqual(mockDocuments);
  });
});

describe('applySorting', () => {
  it('should sort by title ascending', () => {
    const sortConfig: SortConfig = { key: 'title', direction: 'asc' };
    const result = applySorting(mockDocuments, sortConfig);
    expect(result[0].title).toBe('Design Document');
    expect(result[2].title).toBe('Technical Requirements');
  });

  it('should sort by title descending', () => {
    const sortConfig: SortConfig = { key: 'title', direction: 'desc' };
    const result = applySorting(mockDocuments, sortConfig);
    expect(result[0].title).toBe('Technical Requirements');
    expect(result[2].title).toBe('Design Document');
  });

  it('should sort by revision ascending', () => {
    const sortConfig: SortConfig = { key: 'revision', direction: 'asc' };
    const result = applySorting(mockDocuments, sortConfig);
    expect(result[0].revision).toBe(1);
    expect(result[2].revision).toBe(3);
  });

  it('should sort by date descending', () => {
    const sortConfig: SortConfig = { key: 'createdDate', direction: 'desc' };
    const result = applySorting(mockDocuments, sortConfig);
    expect(result[0].createdDate).toBe('2024-03-10');
    expect(result[2].createdDate).toBe('2024-01-15');
  });

  it('should return original order when no sort key provided', () => {
    const sortConfig: SortConfig = { key: null, direction: 'asc' };
    const result = applySorting(mockDocuments, sortConfig);
    expect(result).toEqual(mockDocuments);
  });

  it('should not mutate original array', () => {
    const sortConfig: SortConfig = { key: 'title', direction: 'asc' };
    const original = [...mockDocuments];
    applySorting(mockDocuments, sortConfig);
    expect(mockDocuments).toEqual(original);
  });
});

describe('calculatePagination', () => {
  it('should calculate total pages correctly', () => {
    const result = calculatePagination(100, 10);
    expect(result.totalPages).toBe(10);
  });

  it('should round up partial pages', () => {
    const result = calculatePagination(95, 10);
    expect(result.totalPages).toBe(10);
  });

  it('should handle zero documents', () => {
    const result = calculatePagination(0, 10);
    expect(result.totalPages).toBe(0);
  });

  it('should handle single page', () => {
    const result = calculatePagination(5, 10);
    expect(result.totalPages).toBe(1);
  });
});

describe('constrainPageNumber', () => {
  it('should return page number within valid range', () => {
    const result = constrainPageNumber(5, 10);
    expect(result).toBe(5);
  });

  it('should constrain to minimum page (1)', () => {
    const result = constrainPageNumber(-1, 10);
    expect(result).toBe(1);
  });

  it('should constrain to maximum page', () => {
    const result = constrainPageNumber(15, 10);
    expect(result).toBe(10);
  });

  it('should return 1 when total pages is 0', () => {
    const result = constrainPageNumber(5, 0);
    expect(result).toBe(1);
  });

  it('should handle edge case at page 1', () => {
    const result = constrainPageNumber(1, 5);
    expect(result).toBe(1);
  });

  it('should handle edge case at last page', () => {
    const result = constrainPageNumber(5, 5);
    expect(result).toBe(5);
  });
});
