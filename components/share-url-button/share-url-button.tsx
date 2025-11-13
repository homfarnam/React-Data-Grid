'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ShareUrlButtonProps } from './types';

export const ShareUrlButton = ({ className }: ShareUrlButtonProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    try {
      if (!navigator.clipboard) {
        console.warn('Clipboard API not available');
        return;
      }

      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn('Failed to copy URL:', error);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopyUrl}
      className={className}
    >
      {copied ? (
        <>
          <Check className="h-4 w-4 mr-2" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="h-4 w-4 mr-2" />
          Share URL
        </>
      )}
    </Button>
  );
};
