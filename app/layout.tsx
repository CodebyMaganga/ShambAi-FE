import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/auth-context';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'ShambAI | Explainable Credit for Women Smallholder Farmers',
  description:
    'Traditional credit systems stop at missing data. ShambAI looks for relationship evidence before saying no. An explainable credit assessment experience designed for women smallholder farmers.',
  keywords: [
    'financial inclusion',
    'smallholder farmers',
    'credit assessment',
    'women farmers',
    'Kenya',
    'impact investing',
    'AgriFin',
    'Neo4j',
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}