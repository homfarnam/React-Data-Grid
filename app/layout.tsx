import type React from 'react';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import '../styles/globals.css';

const _geist = Geist({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Document Management System',
  description:
    'Advanced data grid for managing 1,000+ documents with filtering, sorting, and search',
  icons: {
    icon: [{ url: '/favicon.ico' }],
    apple: '/favicon.ico',
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en" className={_geist.className}>
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
};

export default RootLayout;
