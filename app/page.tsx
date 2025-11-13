'use client';

import { Suspense } from 'react';
import { DataGridContainer } from '@/components/data-grid';

const Home = () => {
  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Document Management System
          </h1>
          <p className="text-muted-foreground">
            Manage and search through 1,000 documents with advanced filtering
            and sorting
          </p>
        </div>
        <Suspense fallback={<div className="text-center py-8">Loading...</div>}>
          <DataGridContainer />
        </Suspense>
      </div>
    </main>
  );
};

export default Home;
