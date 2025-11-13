'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center">
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="space-y-4">
            <h1 className="text-9xl font-bold text-foreground">500</h1>
            <h2 className="text-3xl font-semibold text-foreground">
              Something went wrong!
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              An unexpected error occurred. Please try again.
            </p>
            {error.digest && (
              <p className="text-sm text-muted-foreground font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>

          <div className="flex gap-4 justify-center items-center flex-wrap">
            <Button size="lg" onClick={reset} className="font-medium">
              Try Again
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => (window.location.href = '/')}
              className="font-medium"
            >
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
