'use client';

import { useState, useSyncExternalStore } from 'react';
import { Settings2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import type { ColumnConfigDialogProps } from './types';

const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export const ColumnConfigDialog = ({
  columns,
  onColumnsChange,
}: ColumnConfigDialogProps) => {
  const isClient = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );
  const [open, setOpen] = useState(false);

  const visibleCount = isClient
    ? columns.filter((col) => col.visible).length
    : columns.length;

  const handleToggleColumn = (key: string) => {
    const column = columns.find((col) => col.key === key);

    if (column?.visible && visibleCount === 1) {
      return;
    }

    const updatedColumns = columns.map((col) =>
      col.key === key ? { ...col, visible: !col.visible } : col
    );
    onColumnsChange(updatedColumns);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings2 className="h-4 w-4 mr-2" />
          Columns ({visibleCount}/{columns.length})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configure Columns</DialogTitle>
          <DialogDescription>
            Show or hide columns in the data grid. Changes are applied
            immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {columns.map((column) => {
            const isLastVisible = column.visible && visibleCount === 1;
            return (
              <div key={column.key} className="flex items-center space-x-3">
                <Checkbox
                  id={column.key}
                  checked={column.visible}
                  disabled={isLastVisible}
                  onCheckedChange={() => handleToggleColumn(column.key)}
                />
                <Label
                  htmlFor={column.key}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {column.label}
                </Label>
              </div>
            );
          })}
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setOpen(false)}>Done</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
