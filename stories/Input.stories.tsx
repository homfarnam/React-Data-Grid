import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { Search, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const meta = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'date'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="w-[350px] space-y-2">
      <Label htmlFor="document-title">Document Title</Label>
      <Input id="document-title" placeholder="Enter document title" />
    </div>
  ),
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'email@example.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="w-[350px] space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search documents..." />
      </div>
      <div className="relative">
        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" type="email" placeholder="Enter email" />
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  render: () => (
    <div className="w-[400px] space-y-4">
      <div className="space-y-2">
        <Label htmlFor="doc-name">Document Name</Label>
        <Input id="doc-name" placeholder="Quarterly Report 2024" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doc-number">Document Number</Label>
        <Input id="doc-number" placeholder="DOC-2024-001" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="revision">Revision</Label>
        <Input id="revision" type="number" placeholder="1" />
      </div>
    </div>
  ),
};
