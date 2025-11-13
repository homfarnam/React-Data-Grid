import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { SearchBar } from '@/components/search-bar/search-bar';

const meta = {
  title: 'Components/SearchBar',
  component: SearchBar,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

const SearchBarWrapper = (args: {
  placeholder?: string;
  initialValue?: string;
  showDebugInfo?: boolean;
}) => {
  const [value, setValue] = useState(args.initialValue || '');
  return (
    <div className="w-[600px] space-y-4">
      <SearchBar
        value={value}
        onChange={setValue}
        placeholder={args.placeholder}
      />
      {args.showDebugInfo && (
        <>
          <div className="text-sm text-muted-foreground">
            Current search value: <strong>{value || '(empty)'}</strong>
          </div>
          <div className="text-xs text-muted-foreground">
            Type to search (debounced by 300ms)
          </div>
        </>
      )}
    </div>
  );
};

export const Default: Story = {
  args: {
    value: '',
    onChange: () => {},
  },
  render: () => <SearchBarWrapper />,
};

export const WithValue: Story = {
  args: {
    value: '',
    onChange: () => {},
  },
  render: () => <SearchBarWrapper initialValue="Engineering Report" />,
};

export const CustomPlaceholder: Story = {
  args: {
    value: '',
    onChange: () => {},
  },
  render: () => (
    <SearchBarWrapper placeholder="Search by title, number, or revision..." />
  ),
};

export const Interactive: Story = {
  args: {
    value: '',
    onChange: () => {},
  },
  render: () => <SearchBarWrapper showDebugInfo />,
};
