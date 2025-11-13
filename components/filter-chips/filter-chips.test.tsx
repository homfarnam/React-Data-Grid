import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import type { FilterConfig } from '@/lib/types';
import { FilterChips } from './filter-chips';

describe('FilterChips Component', () => {
  it('should render nothing when no filters are active', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: null,
    };

    const { container } = render(
      <FilterChips filters={filters} onRemoveFilter={vi.fn()} />
    );

    expect(container.firstChild).toBeNull();
  });

  it('should render date from filter', () => {
    const filters: FilterConfig = {
      dateFrom: '2024-01-15',
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText(/From:/)).toBeInTheDocument();
  });

  it('should render date to filter', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: '2024-12-31',
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText(/To:/)).toBeInTheDocument();
  });

  it('should render revision filter with equals operator', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: 'equals',
      revisionValue: 5,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Revision = 5')).toBeInTheDocument();
  });

  it('should render revision filter with greater operator', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: 'greater',
      revisionValue: 3,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Revision > 3')).toBeInTheDocument();
  });

  it('should render revision filter with less operator', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: 'less',
      revisionValue: 10,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Revision < 10')).toBeInTheDocument();
  });

  it('should render owners filter with count', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: ['John Doe', 'Jane Smith'],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Owners: 2')).toBeInTheDocument();
  });

  it('should render favourite filter when true', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: true,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Favourites only')).toBeInTheDocument();
  });

  it('should render favourite filter when false', () => {
    const filters: FilterConfig = {
      dateFrom: undefined,
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: false,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Non-favourites only')).toBeInTheDocument();
  });

  it('should render multiple filters', () => {
    const filters: FilterConfig = {
      dateFrom: '2024-01-01',
      dateTo: '2024-12-31',
      revisionOperator: 'greater',
      revisionValue: 2,
      owners: ['John Doe'],
      favourite: true,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText(/From:/)).toBeInTheDocument();
    expect(screen.getByText(/To:/)).toBeInTheDocument();
    expect(screen.getByText('Revision > 2')).toBeInTheDocument();
    expect(screen.getByText('Owners: 1')).toBeInTheDocument();
    expect(screen.getByText('Favourites only')).toBeInTheDocument();
  });

  it('should call onRemoveFilter when remove button is clicked', async () => {
    const onRemoveFilter = vi.fn();
    const user = userEvent.setup();

    const filters: FilterConfig = {
      dateFrom: '2024-01-15',
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={onRemoveFilter} />);

    const removeButtons = screen.getAllByRole('button', {
      name: /remove filter/i,
    });
    await user.click(removeButtons[0]);

    expect(onRemoveFilter).toHaveBeenCalledWith('dateFrom');
  });

  it('should show "Active filters:" label when filters are present', () => {
    const filters: FilterConfig = {
      dateFrom: '2024-01-15',
      dateTo: undefined,
      revisionOperator: undefined,
      revisionValue: undefined,
      owners: [],
      favourite: null,
    };

    render(<FilterChips filters={filters} onRemoveFilter={vi.fn()} />);

    expect(screen.getByText('Active filters:')).toBeInTheDocument();
  });
});
