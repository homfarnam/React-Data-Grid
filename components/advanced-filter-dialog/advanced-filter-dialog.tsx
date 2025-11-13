'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';
import { Filter } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { FilterConfig } from '@/lib/types';
import type { AdvancedFilterDialogProps } from './types';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const AdvancedFilterDialog = ({
  filters,
  onFiltersChange,
  allOwners,
}: AdvancedFilterDialogProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<FilterConfig>(filters);

  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleApply = () => {
    onFiltersChange(localFilters);
    setOpen(false);
  };

  const handleCancel = () => {
    setLocalFilters(filters);
    setOpen(false);
  };

  const handleClear = () => {
    setLocalFilters({});
  };

  const toggleOwner = (owner: string) => {
    const currentOwners = localFilters.owners || [];
    const newOwners = currentOwners.includes(owner)
      ? currentOwners.filter((o) => o !== owner)
      : [...currentOwners, owner];

    setLocalFilters({
      ...localFilters,
      owners: newOwners.length > 0 ? newOwners : undefined,
    });
  };

  const activeFilterCount = isClient ? Object.keys(filters).length : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2 h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Advanced Filters</DialogTitle>
          <DialogDescription>
            Apply multiple filters to narrow down your document search.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <Label className="text-base font-semibold">
              Created Date Range
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateFrom" className="text-sm">
                  From
                </Label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={localFilters.dateFrom || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      dateFrom: e.target.value || undefined,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateTo" className="text-sm">
                  To
                </Label>
                <Input
                  id="dateTo"
                  type="date"
                  value={localFilters.dateTo || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      dateTo: e.target.value || undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Revision Number</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="revisionOperator" className="text-sm">
                  Operator
                </Label>
                <Select
                  value={localFilters.revisionOperator || ''}
                  onValueChange={(value) =>
                    setLocalFilters({
                      ...localFilters,
                      revisionOperator: value
                        ? (value as 'equals' | 'greater' | 'less')
                        : undefined,
                    })
                  }
                >
                  <SelectTrigger id="revisionOperator">
                    <SelectValue placeholder="Select operator" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="equals">Equals (=)</SelectItem>
                    <SelectItem value="greater">Greater than (&gt;)</SelectItem>
                    <SelectItem value="less">Less than (&lt;)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="revisionValue" className="text-sm">
                  Value
                </Label>
                <Input
                  id="revisionValue"
                  type="number"
                  min="1"
                  placeholder="Enter number"
                  value={localFilters.revisionValue || ''}
                  onChange={(e) =>
                    setLocalFilters({
                      ...localFilters,
                      revisionValue: e.target.value
                        ? Number(e.target.value)
                        : undefined,
                    })
                  }
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Document Owner</Label>
            <div className="max-h-48 overflow-y-auto border rounded-md p-3 space-y-2">
              {allOwners.map((owner) => (
                <div key={owner} className="flex items-center space-x-2">
                  <Checkbox
                    id={`owner-${owner}`}
                    checked={localFilters.owners?.includes(owner) || false}
                    onCheckedChange={() => toggleOwner(owner)}
                  />
                  <Label
                    htmlFor={`owner-${owner}`}
                    className="text-sm font-normal cursor-pointer flex-1"
                  >
                    {owner}
                  </Label>
                </div>
              ))}
            </div>
            {localFilters.owners && localFilters.owners.length > 0 && (
              <div className="text-sm text-muted-foreground">
                {localFilters.owners.length} owner(s) selected
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Label className="text-base font-semibold">Favourite Status</Label>
            <Select
              value={
                localFilters.favourite === true
                  ? 'yes'
                  : localFilters.favourite === false
                    ? 'no'
                    : 'all'
              }
              onValueChange={(value) =>
                setLocalFilters({
                  ...localFilters,
                  favourite:
                    value === 'yes' ? true : value === 'no' ? false : null,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All documents</SelectItem>
                <SelectItem value="yes">Favourites only</SelectItem>
                <SelectItem value="no">Non-favourites only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
