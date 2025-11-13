import { type NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateMockDocuments } from '@/lib/mock-data';
import type { Document } from '@/lib/types';

const querySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(25),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc'),
  search: z.string().optional().default(''),

  dateFrom: z.iso.datetime().optional(),
  dateTo: z.iso.datetime().optional(),

  revisionOperator: z.enum(['equals', 'greater', 'less']).optional(),
  revisionValue: z.coerce.number().int().nonnegative().optional(),

  owners: z.string().optional(),
  favourite: z.enum(['true', 'false']).optional(),
  favourites: z.string().optional(),
});

const safeParseJsonArray = (raw: string | undefined): Array<unknown> => {
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const ALL_DOCUMENTS = generateMockDocuments(1000);

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const rawParams: Record<string, string> = {};

    for (const [key, value] of searchParams.entries()) {
      rawParams[key] = value;
    }

    const parsedParam = querySchema.safeParse(rawParams);

    console.log({ parsedParam });

    if (!parsedParam.success) {
      const flatError = z.flattenError(parsedParam.error);

      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          issues: flatError,
        },
        { status: 400 }
      );
    }

    const {
      page,
      pageSize,
      sortBy = '',
      sortOrder,
      search,
      dateFrom,
      dateTo,
      revisionOperator,
      revisionValue,
      owners: ownersRaw,
      favourite: favouriteRaw,
      favourites: favouritesRaw,
    } = parsedParam.data;

    const owners = safeParseJsonArray(ownersRaw) as Array<string>;
    const favourites = safeParseJsonArray(favouritesRaw).map((id) =>
      Number(id)
    );
    let filteredDocuments = [...ALL_DOCUMENTS];

    if (search) {
      const query = search.toLowerCase();
      filteredDocuments = filteredDocuments.filter(
        (doc) =>
          doc.documentNr.toLowerCase().includes(query) ||
          doc.title.toLowerCase().includes(query) ||
          doc.description.toLowerCase().includes(query) ||
          doc.owner.toLowerCase().includes(query)
      );
    }

    if (dateFrom) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => new Date(doc.createdDate) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      filteredDocuments = filteredDocuments.filter(
        (doc) => new Date(doc.createdDate) <= new Date(dateTo)
      );
    }

    if (revisionOperator && typeof revisionValue === 'number') {
      filteredDocuments = filteredDocuments.filter((doc) => {
        switch (revisionOperator) {
          case 'equals':
            return doc.revision === revisionValue;
          case 'greater':
            return doc.revision > revisionValue;
          case 'less':
            return doc.revision < revisionValue;
          default:
            return true;
        }
      });
    }

    if (owners.length > 0) {
      filteredDocuments = filteredDocuments.filter((doc) =>
        owners.includes(doc.owner)
      );
    }

    const favouriteFilter =
      favouriteRaw === 'true' ? true : favouriteRaw === 'false' ? false : null;

    if (favouriteFilter !== null) {
      filteredDocuments = filteredDocuments.filter((doc) => {
        const isFavourite = favourites.includes(doc.id);
        return favouriteFilter ? isFavourite : !isFavourite;
      });
    }

    const documentsWithFavourites = filteredDocuments.map((doc) => ({
      ...doc,
      favourite: favourites.includes(doc.id),
    }));

    if (sortBy) {
      const sortField = sortBy as keyof Document;
      documentsWithFavourites.sort((firstDoc, secondDoc) => {
        const firstValue = firstDoc[sortField];
        const secondValue = secondDoc[sortField];

        if (firstValue === secondValue) {
          return 0;
        }

        const comparison = firstValue < secondValue ? -1 : 1;
        return sortOrder === 'asc' ? comparison : -comparison;
      });
    }

    const totalDocuments = documentsWithFavourites.length;
    const totalPages = Math.max(1, Math.ceil(totalDocuments / pageSize));
    const safePage = Math.min(page, totalPages);

    const startIndex = (safePage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    const paginatedDocuments = documentsWithFavourites.slice(
      startIndex,
      endIndex
    );

    return NextResponse.json({
      documents: paginatedDocuments,
      pagination: {
        page: safePage,
        pageSize,
        totalDocuments,
        totalPages,
        hasNextPage: safePage < totalPages,
        hasPreviousPage: safePage > 1,
      },
      filters: {
        search,
        dateFrom,
        dateTo,
        revisionOperator,
        revisionValue,
        owners,
        favourite: favouriteFilter,
      },
      sorting: {
        sortBy,
        sortOrder,
      },
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
