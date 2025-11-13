import type { Document, FilterConfig, SortConfig } from './types';

export const applySearch = (
  documents: Document[],
  searchQuery: string
): Document[] => {
  if (!searchQuery) {
    return documents;
  }

  const query = searchQuery.toLowerCase();
  return documents.filter(
    (doc) =>
      doc.documentNr.toLowerCase().includes(query) ||
      doc.title.toLowerCase().includes(query) ||
      doc.description.toLowerCase().includes(query) ||
      doc.owner.toLowerCase().includes(query)
  );
};

export const applyDateFilter = (
  documents: Document[],
  dateFrom?: string,
  dateTo?: string
): Document[] => {
  let result = documents;

  if (dateFrom) {
    result = result.filter(
      (doc) => new Date(doc.createdDate) >= new Date(dateFrom)
    );
  }

  if (dateTo) {
    result = result.filter(
      (doc) => new Date(doc.createdDate) <= new Date(dateTo)
    );
  }

  return result;
};

export const applyRevisionFilter = (
  documents: Document[],
  operator?: 'equals' | 'greater' | 'less',
  value?: number
): Document[] => {
  if (!operator || value === undefined) {
    return documents;
  }

  return documents.filter((doc) => {
    switch (operator) {
      case 'equals':
        return doc.revision === value;
      case 'greater':
        return doc.revision > value;
      case 'less':
        return doc.revision < value;
      default:
        return true;
    }
  });
};

export const applyOwnerFilter = (
  documents: Document[],
  owners?: string[]
): Document[] => {
  if (!owners || owners.length === 0) {
    return documents;
  }
  return documents.filter((doc) => owners.includes(doc.owner));
};

export const applyFavouriteFilter = (
  documents: Document[],
  favourite?: boolean | null
): Document[] => {
  if (favourite === null || favourite === undefined) {
    return documents;
  }
  return documents.filter((doc) => doc.favourite === favourite);
};

export const applyAllFilters = (
  documents: Document[],
  searchQuery: string,
  filters: FilterConfig,
  favourites: Set<number>
): Document[] => {
  // Add favourite state to documents
  let result = documents.map((doc) => ({
    ...doc,
    favourite: favourites.has(doc.id),
  }));

  result = applySearch(result, searchQuery);

  result = applyDateFilter(result, filters.dateFrom, filters.dateTo);

  result = applyRevisionFilter(
    result,
    filters.revisionOperator,
    filters.revisionValue
  );

  result = applyOwnerFilter(result, filters.owners);

  result = applyFavouriteFilter(result, filters.favourite);

  return result;
};

export const applySorting = (
  documents: Document[],
  sortConfig: SortConfig
): Document[] => {
  if (!sortConfig.key || !sortConfig.direction) {
    return documents;
  }

  const sortField = sortConfig.key;
  return [...documents].sort((firstDoc, secondDoc) => {
    const firstValue = firstDoc[sortField];
    const secondValue = secondDoc[sortField];

    if (firstValue === secondValue) {
      return 0;
    }

    const comparison = firstValue < secondValue ? -1 : 1;
    return sortConfig.direction === 'asc' ? comparison : -comparison;
  });
};

export const calculatePagination = (
  totalDocuments: number,
  pageSize: number
) => {
  const totalPages =
    totalDocuments === 0 ? 0 : Math.ceil(totalDocuments / pageSize);
  return { totalPages };
};

export const constrainPageNumber = (
  page: number,
  totalPages: number
): number => {
  if (totalPages === 0) {
    return 1;
  }
  return Math.max(1, Math.min(page, totalPages));
};
